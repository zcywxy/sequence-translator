export const DEFAULT_HTTP_TIMEOUT = 10000;
export const DEFAULT_FETCH_INTERVAL = 1000;
export const DEFAULT_BATCH_INTERVAL = 4000;
export const DEFAULT_BATCH_SIZE = 10;
export const DEFAULT_BATCH_LENGTH = 10000;

export const INPUT_PLACE_URL = "{{url}}";
export const INPUT_PLACE_FROM = "{{from}}";
export const INPUT_PLACE_TO = "{{to}}";
export const INPUT_PLACE_FROM_LANG = "{{fromLang}}";
export const INPUT_PLACE_TO_LANG = "{{toLang}}";
export const INPUT_PLACE_TEXT = "{{text}}";
export const INPUT_PLACE_TONE = "{{tone}}";
export const INPUT_PLACE_TITLE = "{{title}}";
export const INPUT_PLACE_DESCRIPTION = "{{description}}";
export const INPUT_PLACE_KEY = "{{key}}";
export const INPUT_PLACE_MODEL = "{{model}}";

export const OPT_TRANS_OPENAI = "OPENAI";
export const OPT_TRANS_OLLAMA = "OLLAMA";

export const OPT_ALL_TRANS_TYPES = [OPT_TRANS_OPENAI, OPT_TRANS_OLLAMA];

export const OPT_LANGDETECTOR_ALL = [OPT_TRANS_OPENAI, OPT_TRANS_OLLAMA];

export const OPT_LANGDETECTOR_MAP = new Set(OPT_LANGDETECTOR_ALL);

export const API_SPE_TYPES = {
  ai: new Set([OPT_TRANS_OPENAI, OPT_TRANS_OLLAMA]),
  machine: new Set([]),
  builtin: new Set(OPT_ALL_TRANS_TYPES),
  mulkeys: new Set([OPT_TRANS_OPENAI, OPT_TRANS_OLLAMA]),
  batch: new Set([OPT_TRANS_OPENAI, OPT_TRANS_OLLAMA]),
  stream: new Set([OPT_TRANS_OPENAI, OPT_TRANS_OLLAMA]),
};

export const BUILTIN_STONES = [
  "formal",
  "casual",
  "neutral",
  "technical",
  "marketing",
  "Literary",
  "academic",
  "legal",
  "literal",
  "ldiomatic",
  "transcreation",
  "machine-like",
  "concise",
];
export const BUILTIN_PLACEHOLDERS = ["{ }", "{{ }}", "[ ]", "[[ ]]"];
export const BUILTIN_PLACETAGS = ["i", "a", "b", "x"];

export const OPT_LANGS_TO = [
  ["en", "English"],
  ["zh-CN", "Simplified Chinese"],
  ["zh-TW", "Traditional Chinese"],
  ["ar", "Arabic"],
  ["bg", "Bulgarian"],
  ["ca", "Catalan"],
  ["hr", "Croatian"],
  ["cs", "Czech"],
  ["da", "Danish"],
  ["nl", "Dutch"],
  ["fa", "Persian"],
  ["fi", "Finnish"],
  ["fr", "French"],
  ["de", "German"],
  ["el", "Greek"],
  ["hi", "Hindi"],
  ["hu", "Hungarian"],
  ["id", "Indonesian"],
  ["it", "Italian"],
  ["ja", "Japanese"],
  ["ko", "Korean"],
  ["ms", "Malay"],
  ["mt", "Maltese"],
  ["nb", "Norwegian"],
  ["pl", "Polish"],
  ["pt", "Portuguese"],
  ["ro", "Romanian"],
  ["ru", "Russian"],
  ["sk", "Slovak"],
  ["sl", "Slovenian"],
  ["es", "Spanish"],
  ["sv", "Swedish"],
  ["ta", "Tamil"],
  ["te", "Telugu"],
  ["th", "Thai"],
  ["tr", "Turkish"],
  ["uk", "Ukrainian"],
  ["vi", "Vietnamese"],
];
export const OPT_LANGS_LIST = OPT_LANGS_TO.map(([lang]) => lang);
export const OPT_LANGS_FROM = [["auto", "Auto-detect"], ...OPT_LANGS_TO];
export const OPT_LANGS_MAP = new Map(OPT_LANGS_TO);

export const OPT_LANGS_SPEC_NAME = new Map(
  OPT_LANGS_FROM.map(([key, val]) => [key, val.split(" - ")[0]])
);
export const OPT_LANGS_SPEC_DEFAULT = new Map(
  OPT_LANGS_FROM.map(([key]) => [key, key])
);
export const OPT_LANGS_SPEC_DEFAULT_UC = new Map(
  OPT_LANGS_FROM.map(([key]) => [key, key.toUpperCase()])
);

export const OPT_LANGS_TO_SPEC = {
  [OPT_TRANS_OPENAI]: OPT_LANGS_SPEC_NAME,
  [OPT_TRANS_OLLAMA]: OPT_LANGS_SPEC_NAME,
};

const specToCode = (m) =>
  new Map(
    Array.from(m.entries()).map(([k, v]) => {
      if (v === "") {
        return ["auto", "auto"];
      }
      if (v === "zh" || v === "ZH") {
        return [v, "zh-CN"];
      }
      return [v, k];
    })
  );

export const OPT_LANGS_TO_CODE = {};
Object.entries(OPT_LANGS_TO_SPEC).forEach(([t, m]) => {
  OPT_LANGS_TO_CODE[t] = specToCode(m);
});

export const defaultNobatchPrompt = `You are a professional, authentic machine translation engine.`;
export const defaultNobatchUserPrompt = `Translate the following source text to ${INPUT_PLACE_TO}. Output translation directly without any additional text.\n\nSource Text: ${INPUT_PLACE_TEXT}\n\nTranslated Text:`;

export const defaultSystemPrompt = `Act as a translation API. Output a single raw JSON object only. No extra text or fences.

Input:
{"targetLanguage":"<lang>","title":"<context>","description":"<context>","segments":[{"id":1,"text":"..."}],"glossary":{"sourceTerm":"targetTerm"},"tone":"<formal|casual>"}

Output:
{"translations":[{"id":1,"text":"...","sourceLanguage":"<detected>"}]}

Rules:
1.  Use title/description for context only; do not output them.
2.  Keep id, order, and count of segments.
3.  Preserve whitespace, HTML entities, and all HTML-like tags (e.g., <i1>, <a1>). Translate inner text only.
4.  Highest priority: Follow 'glossary'. Use value for translation; if value is "", keep the key.
5.  Do not translate: content in <code>, <pre>, text enclosed in backticks, or placeholders like {1}, {{1}}, [1], [[1]].
6.  Apply the specified tone to the translation.
7.  Detect sourceLanguage for each segment.
8.  Return empty or unchanged inputs as is.

Example:
Input: {"targetLanguage":"zh-CN","segments":[{"id":1,"text":"A <b>React</b> component."}],"glossary":{"component":"组件","React":""}}
Output: {"translations":[{"id":1,"text":"一个<b>React</b>组件","sourceLanguage":"en"}]}

Fail-safe: On any error, return {"translations":[]}.`;

export const defaultSystemPromptXml = `Act as a translation API. Output raw XML-like format only. No Markdown fences (xml). No conversational filler.

Input:
{"targetLanguage":"<lang>","title":"<context>","description":"<context>","segments":[{"id":1,"text":"..."}],"glossary":{"sourceTerm":"targetTerm"},"tone":"<formal|casual>"}

Output Format:
<root>
    <t id="0" sourceLanguage="<detected_source_lang>">Translated text content...</t>
    <t id="1" sourceLanguage="<detected_source_lang>">Translated text content...</t>
</root>

Rules:
1.  **Strict Format**: Output ONLY the <root> element and its children. Do not include "xml" version declarations or markdown code blocks.
2.  **Structure**: Maintain the exact "id" from the input in the "id" attribute. Detect the source language for the "sourceLanguage" attribute.
3.  **HTML & Whitespace**: Preserve all HTML tags (e.g., <b>, <span>, <br>) and whitespace exactly as they appear in the structure. Only translate the text content inside them.
4.  **Glossary**: Highest priority. Use the glossary value for translation. If the value is "", keep the source term as is.
5.  **Do Not Translate**: Content inside <code>, <pre>, text in backticks ("code"), and placeholders like {1}, {{1}}, [1], [[1]].
6.  **Context**: Use the "title" and "description" fields to understand the context for better translation accuracy, but do not output them.
7.  **Tone**: Apply the specified "tone" (formal/casual).

Example:
Input:
{"targetLanguage":"zh-CN","segments":[{"id":0,"text":"Hello <b>World</b>!"}],"glossary":{"World":"世界"},"tone":"formal"}

Output:
<root>
    <t id="0" sourceLanguage="en">你好 <b>世界</b>！</t>
</root>`;

export const defaultSystemPromptLines = `Act as a translation API. Output raw text lines in "ID | Text" format. No Markdown. No conversational filler.

Input:
{"targetLanguage":"<lang>","title":"<context>","description":"<context>","segments":[{"id":1,"text":"..."}],"glossary":{"sourceTerm":"targetTerm"},"tone":"<formal|casual>"}

Output Format:
<id> | <Translation for Segment>
<id> | <Translation for Segment>
...

Rules:
1.  **Strict Format**: Output exactly one line per segment using the format: "{id} | {translated_text}".
2.  **ID Mapping**: You MUST copy the exact "id" from the input segment to the output line.
3.  **Newline Handling**: If the translated text contains a newline, replace it with the HTML tag "<br>" to ensure it stays on a single line.
4.  **Separator**: Use the pipe symbol " | " strictly to separate the ID and the text.
5.  **Context**: Use title/description for context only; do not output them.
6.  **HTML/Tags**: Preserve whitespace, HTML entities, and all HTML-like tags (e.g., <i1>, <b>). Translate inner text only.
7.  **Glossary**: Highest priority. Follow 'glossary'. Use value for translation; if value is "", keep the key.
8.  **Do Not Translate**: content in <code>, <pre>, text enclosed in backticks, or placeholders like {1}, {{1}}, [1].
9.  **Tone**: Apply the specified tone.

Example:
Input: {"targetLanguage":"zh-CN","segments":[{"id":0,"text":"Hello."},{"id":1,"text":"Line 1\nLine 2"}],"glossary":{}}
Output:
0 | 你好。
1 | 第一行<br>第二行

Fail-safe: On error, return "{id} | {original_text}" line by line.`;

const defaultRequestHook = `async (args, { url, body, headers, userMsg, method } = {}) => {
  console.log("request hook args:", { args, url, body, headers, userMsg, method });
  // return { url, body, headers, userMsg, method };
};`;

const defaultResponseHook = `async ({ res, ...args }) => {
  console.log("reaponse hook args:", { res, args });
  // const translations = [["你好", "zh"]];
  // const modelMsg = "";
  // return { translations, modelMsg };
};`;

const defaultApi = {
  apiSlug: "",
  apiName: "",
  apiType: "",
  url: "",
  key: "",
  model: "",
  systemPrompt: defaultSystemPromptXml,
  nobatchPrompt: defaultNobatchPrompt,
  nobatchUserPrompt: defaultNobatchUserPrompt,
  userPrompt: "",
  tone: BUILTIN_STONES[0],
  placeholder: BUILTIN_PLACEHOLDERS[0],
  placetag: [BUILTIN_PLACETAGS[0]],
  customHeader: "",
  customBody: "",
  reqHook: "",
  resHook: "",
  fetchInterval: DEFAULT_FETCH_INTERVAL,
  httpTimeout: DEFAULT_HTTP_TIMEOUT * 3,
  batchInterval: DEFAULT_BATCH_INTERVAL,
  batchSize: DEFAULT_BATCH_SIZE,
  batchLength: DEFAULT_BATCH_LENGTH,
  useBatchFetch: false,
  useStream: false,
  temperature: 0.0,
  maxTokens: 20480,
  isDisabled: false,
};

const defaultApiOpts = {
  [OPT_TRANS_OPENAI]: {
    ...defaultApi,
    url: "https://api.openai.com/v1/chat/completions",
    model: "gpt-4",
    useBatchFetch: true,
  },
  [OPT_TRANS_OLLAMA]: {
    ...defaultApi,
    url: "http://localhost:11434/v1/chat/completions",
    model: "llama3",
    useBatchFetch: true,
  },
};

export const DEFAULT_API_LIST = OPT_ALL_TRANS_TYPES.map((apiType) => ({
  ...defaultApiOpts[apiType],
  apiSlug: apiType,
  apiName: apiType,
  apiType,
}));

export const DEFAULT_API_TYPE = OPT_TRANS_OPENAI;
export const DEFAULT_API_SETTING = DEFAULT_API_LIST.find(
  (a) => a.apiType === DEFAULT_API_TYPE
);
