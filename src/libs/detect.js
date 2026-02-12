import {
  OPT_LANGDETECTOR_MAP,
  OPT_LANGS_TO_CODE,
  OPT_LANGS_MAP,
} from "../config";
import { browser } from "./browser";
import { kissLog } from "./log";

export const tryDetectLang = async (text, langDetector = "-") => {
  let deLang = "";

  if (OPT_LANGDETECTOR_MAP.has(langDetector)) {
    try {
      const res = await browser?.i18n?.detectLanguage(text);
      const lang = res?.languages?.[0]?.language;
      if (lang && OPT_LANGS_MAP.has(lang)) {
        deLang = lang;
      } else if (lang?.startsWith("zh")) {
        deLang = "zh-CN";
      }
    } catch (err) {
      kissLog("detect lang remote", err);
    }
  }

  if (!deLang) {
    try {
      const res = await browser?.i18n?.detectLanguage(text);
      const lang = res?.languages?.[0]?.language;
      if (lang && OPT_LANGS_MAP.has(lang)) {
        deLang = lang;
      } else if (lang?.startsWith("zh")) {
        deLang = "zh-CN";
      }
    } catch (err) {
      kissLog("detect lang local", err);
    }
  }

  return deLang;
};
