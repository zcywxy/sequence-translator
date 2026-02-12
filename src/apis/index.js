import queryString from "query-string";
import { fetchData } from "../libs/fetch";
import {
  URL_CACHE_TRAN,
  KV_SALT_SYNC,
  OPT_LANGS_TO_SPEC,
  OPT_LANGS_SPEC_DEFAULT,
  API_SPE_TYPES,
  DEFAULT_API_SETTING,
  OPT_LANGS_TO_CODE,
} from "../config";
import { sha256, withTimeout } from "../libs/utils";
import { handleTranslate } from "./trans";
import { getHttpCachePolyfill, putHttpCachePolyfill } from "../libs/cache";
import { getBatchQueue } from "../libs/batchQueue";
import { fnPolyfill } from "../libs/fetch";
import { getFetchPool } from "../libs/pool";

export const apiSyncData = async (url, key, data) =>
  fetchData(url, {
    headers: {
      "Content-type": "application/json",
      Authorization: `Bearer ${await sha256(key, KV_SALT_SYNC)}`,
    },
    method: "POST",
    body: JSON.stringify(data),
  });

export const apiFetch = (url) => fetchData(url);

export const apiTranslate = async ({
  text,
  fromLang = "auto",
  toLang,
  apiSetting = DEFAULT_API_SETTING,
  docInfo = {},
  glossary,
  useCache = true,
  usePool = true,
}) => {
  if (!text) {
    throw new Error("The text cannot be empty.");
  }

  const { apiType, apiSlug, useBatchFetch } = apiSetting;
  const langMap = OPT_LANGS_TO_SPEC[apiType] || OPT_LANGS_SPEC_DEFAULT;
  const from = langMap.get(fromLang);
  const to = langMap.get(toLang);
  if (!to) {
    throw new Error(`The target lang: ${toLang} not support`);
  }

  const [v1, v2] = process.env.REACT_APP_VERSION.split(".");
  const cacheOpts = {
    apiSlug,
    text,
    fromLang,
    toLang,
    version: [v1, v2].join("."),
  };
  const cacheInput = `${URL_CACHE_TRAN}?${queryString.stringify(cacheOpts)}`;

  if (useCache) {
    const cache = await getHttpCachePolyfill(cacheInput);
    if (cache?.trText) {
      return cache;
    }
  }

  let translation = [];
  if (useBatchFetch && API_SPE_TYPES.batch.has(apiType)) {
    const { apiSlug, batchInterval, batchSize, batchLength, useStream } =
      apiSetting;
    const enableStream = useStream && API_SPE_TYPES.stream.has(apiType);
    const key = `${apiSlug}_${fromLang}_${toLang}_${enableStream ? "stream" : "batch"}`;
    const queue = getBatchQueue(key, handleTranslate, {
      batchInterval,
      batchSize,
      batchLength,
    });

    translation = await queue.addTask(text, {
      from,
      to,
      fromLang,
      toLang,
      langMap,
      docInfo,
      glossary,
      apiSetting,
      usePool,
    });
  } else {
    const { value } = await handleTranslate([text], {
      from,
      to,
      fromLang,
      toLang,
      langMap,
      docInfo,
      glossary,
      apiSetting,
      usePool,
    }).next();
    translation = value?.result;
  }

  let trText = "";
  let srLang = "";
  let srCode = "";
  if (Array.isArray(translation)) {
    [trText, srLang = ""] = translation;
    if (srLang) {
      srCode = OPT_LANGS_TO_CODE[apiType].get(srLang) || "";
    }
  } else if (typeof translation === "string") {
    trText = translation;
  }

  if (!trText) {
    throw new Error("tanslate api got empty trtext");
  }

  const isSame = fromLang === "auto" && srLang === to;

  if (useCache) {
    putHttpCachePolyfill(cacheInput, null, { trText, isSame, srLang, srCode });
  }

  return { trText, srLang, srCode, isSame };
};
