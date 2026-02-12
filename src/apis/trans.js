import queryString from "query-string";
import {
  OPT_TRANS_OPENAI,
  OPT_TRANS_OLLAMA,
  API_SPE_TYPES,
  INPUT_PLACE_FROM,
  INPUT_PLACE_TO,
  INPUT_PLACE_TEXT,
  INPUT_PLACE_KEY,
  INPUT_PLACE_MODEL,
  DEFAULT_USER_AGENT,
  defaultSystemPrompt,
  defaultNobatchPrompt,
  defaultNobatchUserPrompt,
  INPUT_PLACE_TONE,
  INPUT_PLACE_TITLE,
  INPUT_PLACE_DESCRIPTION,
  INPUT_PLACE_TO_LANG,
  INPUT_PLACE_FROM_LANG,
  defaultSystemPromptXml,
  defaultSystemPromptLines,
} from "../config";
import { interpreter } from "../libs/interpreter";
import {
  parseJsonObj,
  extractJson,
  stripMarkdownCodeBlock,
} from "../libs/utils";
import {
  parseStreamingSegments,
  createStreamingJsonParser,
  detectStreamFormat,
  getStreamDelta,
} from "../libs/stream";
import { kissLog } from "../libs/log";
import { fetchData, fetchStream } from "../libs/fetch";

const keyMap = new Map();
const urlMap = new Map();

// 轮询key/url
const keyPick = (apiSlug, key = "", cacheMap) => {
  const keys = key
    .split(/\n|,/)
    .map((item) => item.trim())
    .filter(Boolean);

  if (keys.length === 0) {
    return "";
  }

  const preIndex = cacheMap.get(apiSlug) ?? -1;
  const curIndex = (preIndex + 1) % keys.length;
  cacheMap.set(apiSlug, curIndex);

  return keys[curIndex];
};

const genSystemPrompt = ({
  systemPrompt,
  tone,
  from,
  to,
  fromLang,
  toLang,
  texts,
  docInfo: { title = "", description = "" } = {},
}) =>
  systemPrompt
    .replaceAll(INPUT_PLACE_TITLE, title)
    .replaceAll(INPUT_PLACE_DESCRIPTION, description)
    .replaceAll(INPUT_PLACE_TONE, tone)
    .replaceAll(INPUT_PLACE_FROM, from)
    .replaceAll(INPUT_PLACE_TO, to)
    .replaceAll(INPUT_PLACE_FROM_LANG, fromLang)
    .replaceAll(INPUT_PLACE_TO_LANG, toLang)
    .replaceAll(INPUT_PLACE_TEXT, texts[0]);

const genUserPrompt = ({
  nobatchUserPrompt,
  useBatchFetch,
  tone,
  glossary,
  from,
  to,
  fromLang,
  toLang,
  texts,
  docInfo: { title = "", description = "" } = {},
}) => {
  if (useBatchFetch) {
    const promptObj = {
      targetLanguage: toLang,
      segments: texts.map((text, i) => ({ id: i, text })),
    };

    title && (promptObj.title = title);
    description && (promptObj.description = description);
    glossary &&
      Object.keys(glossary).length !== 0 &&
      (promptObj.glossary = glossary);
    tone && (promptObj.tone = tone);

    return JSON.stringify(promptObj);
  }

  return nobatchUserPrompt
    .replaceAll(INPUT_PLACE_TITLE, title)
    .replaceAll(INPUT_PLACE_DESCRIPTION, description)
    .replaceAll(INPUT_PLACE_TONE, tone)
    .replaceAll(INPUT_PLACE_FROM, from)
    .replaceAll(INPUT_PLACE_TO, to)
    .replaceAll(INPUT_PLACE_FROM_LANG, fromLang)
    .replaceAll(INPUT_PLACE_TO_LANG, toLang)
    .replaceAll(INPUT_PLACE_TEXT, texts[0]);
};

const parseAIRes = (raw, useBatchFetch = true) => {
  if (!raw) {
    return [];
  }

  if (!useBatchFetch) {
    return [[raw]];
  }

  // try {
  //   const jsonString = extractJson(raw);
  //   if (!jsonString) return [];

  //   const data = JSON.parse(jsonString);
  //   if (Array.isArray(data.translations)) {
  //     // todo: 考虑序号id可能会打乱
  //     return data.translations.map((item) => [
  //       item?.text ?? "",
  //       item?.sourceLanguage ?? "",
  //     ]);
  //   }
  // } catch (err) {
  //   kissLog("parse AI Res", err);
  // }
  // return [];

  let content = stripMarkdownCodeBlock(raw).trim();

  // JSON
  try {
    const start = content.search(/(\{|\[)/);
    const end = content.lastIndexOf(content.includes("}") ? "}" : "]");

    if (start > -1 && end > -1) {
      const jsonStr = content.substring(start, end + 1);
      const parsed = JSON.parse(jsonStr);

      const list = Array.isArray(parsed)
        ? parsed
        : parsed.translations || (parsed.result ? [parsed.result] : [parsed]);

      if (
        list.length > 0 &&
        (list[0].text !== undefined || list[0].translations)
      ) {
        return list.map((item) => [
          String(item.text || ""),
          String(item.sourceLanguage || ""),
        ]);
      }
    }
  } catch (e) {
    //
  }

  // XML
  const xmlTagPattern = /<(t|item|seg)\b/i;
  if (xmlTagPattern.test(content)) {
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");
      const elements = doc.querySelectorAll("t, item, seg");

      if (elements.length > 0) {
        return Array.from(elements).map((el) => [
          el.innerHTML.trim(),
          el.getAttribute("sourceLanguage") || "",
        ]);
      }
    } catch (e) {
      //
    }
  }

  // 纯文本换行
  return content.split("\n").map((line) => {
    const pipeMatch = line.match(/^\d+\s*\|\s*(.*)/);
    if (pipeMatch) {
      return [pipeMatch[1].trim(), ""];
    }

    const text = line.replace(/<br\s*\/?>/gi, "\n").trim();
    return [text, ""];
  });
};

const genOpenAI = ({
  url,
  key,
  systemPrompt,
  userPrompt,
  model,
  temperature,
  maxTokens,
  useStream = false,
}) => {
  const userMsg = {
    role: "user",
    content: userPrompt,
  };
  const body = {
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      userMsg,
    ],
    temperature,
    max_tokens: maxTokens,
    stream: useStream,
  };

  const headers = {
    "Content-type": "application/json",
    Authorization: `Bearer ${key}`,
  };

  return { url, body, headers, userMsg };
};

const genOllama = ({
  url,
  key,
  systemPrompt,
  userPrompt,
  model,
  temperature,
  maxTokens,
  useStream = false,
}) => {
  const userMsg = {
    role: "user",
    content: userPrompt,
  };
  const body = {
    model,
    messages: [
      {
        role: "system",
        content: systemPrompt,
      },
      userMsg,
    ],
    temperature,
    num_predict: maxTokens,
    stream: useStream,
  };

  const headers = {
    "Content-type": "application/json",
  };

  return { url, body, headers, userMsg };
};



const genReqFuncs = {
  [OPT_TRANS_OPENAI]: genOpenAI,
  [OPT_TRANS_OLLAMA]: genOllama,
};

const genInit = ({
  url = "",
  body = null,
  headers = {},
  userMsg = null,
  method = "POST",
}) => {
  if (!url) {
    throw new Error("genInit: url is empty");
  }

  const init = {
    method,
    headers,
  };
  if (method !== "GET" && method !== "HEAD" && body) {
    let payload = JSON.stringify(body);
    const id = body?.params?.id;
    if (id) {
      payload = payload.replace(
        'method":"',
        (id + 3) % 13 === 0 || (id + 5) % 29 === 0
          ? 'method" : "'
          : 'method": "'
      );
    }
    Object.assign(init, { body: payload });
  }

  return [url, init, userMsg];
};

/**
 * 构造翻译接口请求参数
 * @param {*}
 * @returns
 */
export const genTransReq = async ({ reqHook, ...args }) => {
  const {
    apiType,
    apiSlug,
    key,
    systemPrompt,
    // userPrompt,
    nobatchPrompt = defaultNobatchPrompt,
    nobatchUserPrompt = defaultNobatchUserPrompt,
    useBatchFetch,
    from,
    to,
    fromLang,
    toLang,
    texts,
    docInfo,
    glossary,
    customHeader,
    customBody,
    events,
    tone,
  } = args;

  if (API_SPE_TYPES.mulkeys.has(apiType)) {
    args.key = keyPick(apiSlug, key, keyMap);
  }

  if (API_SPE_TYPES.ai.has(apiType)) {
    args.systemPrompt = events
      ? systemPrompt.replaceAll(INPUT_PLACE_TO, to)
      : genSystemPrompt({
          systemPrompt: useBatchFetch ? systemPrompt : nobatchPrompt,
          from,
          to,
          fromLang,
          toLang,
          texts,
          docInfo,
          tone,
        });
    args.userPrompt = events
      ? JSON.stringify(events)
      : genUserPrompt({
          nobatchUserPrompt,
          useBatchFetch,
          from,
          to,
          fromLang,
          toLang,
          texts,
          docInfo,
          tone,
          glossary,
        });
  }

  const {
    url = "",
    body = null,
    headers = {},
    userMsg = null,
    method = "POST",
  } = genReqFuncs[apiType](args);

  // 合并用户自定义headers和body
  if (customHeader?.trim()) {
    Object.assign(headers, parseJsonObj(customHeader));
  }
  if (customBody?.trim()) {
    Object.assign(body, parseJsonObj(customBody));
  }

  // 执行 request hook
  if (reqHook?.trim() && !events) {
    try {
      const req = {
        url,
        body,
        headers,
        userMsg,
        method,
      };
      interpreter.run(`exports.reqHook = ${reqHook}`);
      const hookResult = await interpreter.exports.reqHook(
        {
          ...args,
          defaultSystemPrompt,
          defaultSystemPromptXml,
          defaultSystemPromptLines,
          defaultNobatchPrompt,
          defaultNobatchUserPrompt,
          req,
        },
        req
      );
      if (hookResult && hookResult.url) {
        return genInit(hookResult);
      }
    } catch (err) {
      kissLog("run req hook", err);
      throw new Error(`Request hook error: ${err.message}`);
    }
  }

  return genInit({ url, body, headers, userMsg, method });
};

/**
 * 解析翻译接口返回数据
 * @param {*} res
 * @param {*} param3
 * @returns
 */
export const parseTransRes = async (
  res,
  {
    texts,
    from,
    to,
    fromLang,
    toLang,
    langMap,
    resHook,
    userMsg,
    apiType,
    useBatchFetch,
  }
) => {
  // 执行 response hook
  if (resHook?.trim()) {
    try {
      interpreter.run(`exports.resHook = ${resHook}`);
      const hookResult = await interpreter.exports.resHook({
        apiType,
        userMsg,
        res,
        texts,
        from,
        to,
        fromLang,
        toLang,
        langMap,
        extractJson,
        parseAIRes,
      });
      if (hookResult && Array.isArray(hookResult.translations)) {
        return hookResult.translations;
      } else if (Array.isArray(hookResult)) {
        return hookResult;
      }
    } catch (err) {
      kissLog("run res hook", err);
      throw new Error(`Response hook error: ${err.message}`);
    }
  }

  // todo: 根据结果抛出实际异常信息
  switch (apiType) {
    case OPT_TRANS_OPENAI:
    case OPT_TRANS_OLLAMA:
      return parseAIRes(res?.choices?.[0]?.message?.content, useBatchFetch);
    default:
  }

  throw new Error("parse translate result: apiType not matched", apiType);
};

/**
 * 发送翻译请求并解析
 * 支持流式和非流式两种模式
 * @param {*} texts 待翻译文本数组
 * @param {*} options 翻译选项
 * @yields {{id: number, result: [string, string]}} 流式模式下逐个返回结果
 * @returns {Promise<Array>} 非流式模式下返回完整结果数组
 */
export async function* handleTranslate(
  texts = [],
  {
    from,
    to,
    fromLang,
    toLang,
    langMap,
    docInfo,
    glossary,
    apiSetting,
    usePool,
  }
) {
  const {
    apiType,
    fetchInterval,
    httpTimeout,
    useStream,
  } = apiSetting;

  const enableStream = useStream && API_SPE_TYPES.stream.has(apiType);

  let token = "";
  const [input, init, userMsg] = await genTransReq({
    texts,
    from,
    to,
    fromLang,
    toLang,
    langMap,
    docInfo,
    glossary,
    token,
    useStream: enableStream,
    ...apiSetting,
  });

  if (enableStream) {
    yield* handleTranslateStreamInternal(texts, input, init, {
      apiType,
      usePool,
      fetchInterval,
      httpTimeout,
    });
  } else {
    const response = await fetchData(input, init, {
      useCache: false,
      usePool,
      fetchInterval,
      httpTimeout,
    });
    if (!response) {
      throw new Error("translate got empty response");
    }

    const result = await parseTransRes(response, {
      texts,
      from,
      to,
      fromLang,
      toLang,
      langMap,
      userMsg,
      ...apiSetting,
    });
    if (!result?.length) {
      throw new Error("translate got an unexpected result");
    }

    for (let i = 0; i < result.length; i++) {
      yield { id: i, result: result[i] };
    }
  }
}

/**
 * 内部流式翻译处理
 */
async function* handleTranslateStreamInternal(
  texts,
  input,
  init,
  { apiType, usePool, fetchInterval, httpTimeout }
) {
  const results = new Array(texts.length).fill(null);
  let fullContent = "";
  const processedIds = new Set();

  const jsonParser = createStreamingJsonParser();
  let isJsonFormat = false;
  let formatDetected = false;

  try {
    for await (const rawData of fetchStream(input, init, {
      useCache: false,
      usePool,
      fetchInterval,
      httpTimeout,
    })) {
      try {
        const json = JSON.parse(rawData);
        const delta = getStreamDelta(json, apiType);

        if (delta) {
          fullContent += delta;
          fullContent = stripMarkdownCodeBlock(fullContent, true);

          if (!formatDetected) {
            const { isJson, detected } = detectStreamFormat(fullContent);
            if (detected) {
              formatDetected = true;
              isJsonFormat = isJson;
              // 格式检测成功后，将累积的内容写入解析器
              if (isJsonFormat) {
                for (const { id, translation } of jsonParser.write(
                  fullContent
                )) {
                  results[id] = translation;
                  yield { id, result: translation };
                }
              }
            }
          } else if (isJsonFormat) {
            for (const { id, translation } of jsonParser.write(delta)) {
              results[id] = translation;
              yield { id, result: translation };
            }
          } else {
            for (const { id, translation } of parseStreamingSegments(
              fullContent,
              processedIds
            )) {
              results[id] = translation;
              yield { id, result: translation };
            }
          }
        }
      } catch (e) {
        // 忽略解析错误
      }
    }

    if (isJsonFormat) {
      jsonParser.end();
    }
  } catch (error) {
    kissLog("handleTranslateStream error", error);
    throw error;
  }

  // 最终再解析一次，捕获可能遗漏的段落
  const hasEmpty = results.some((r) => !r);
  if (hasEmpty) {
    const parsed = parseAIRes(fullContent, true);
    for (let i = 0; i < texts.length && i < parsed.length; i++) {
      if (!results[i]) {
        results[i] = parsed[i];
        yield { id: i, result: results[i] };
      }
    }
  }
}
