export const UI_LANGS = [
  ["en", "English"],
  ["zh", "简体中文"],
];

const customApiLangs = `["en", "English - English"],
["zh-CN", "Simplified Chinese - 简体中文"],
["zh-TW", "Traditional Chinese - 繁體中文"],
["ar", "Arabic - العربية"],
["bg", "Bulgarian - Български"],
["ca", "Catalan - Català"],
["hr", "Croatian - Hrvatski"],
["cs", "Czech - Čeština"],
["da", "Danish - Dansk"],
["nl", "Dutch - Nederlands"],
["fi", "Finnish - Suomi"],
["fr", "French - Français"],
["de", "German - Deutsch"],
["el", "Greek - Ελληνικά"],
["hi", "Hindi - हिन्दी"],
["hu", "Hungarian - Magyar"],
["id", "Indonesian - Indonesia"],
["it", "Italian - Italiano"],
["ja", "Japanese - 日本語"],
["ko", "Korean - 한국어"],
["ms", "Malay - Melayu"],
["mt", "Maltese - Malti"],
["nb", "Norwegian - Norsk Bokmål"],
["pl", "Polish - Polski"],
["pt", "Portuguese - Português"],
["ro", "Romanian - Română"],
["ru", "Russian - Русский"],
["sk", "Slovak - Slovenčina"],
["sl", "Slovenian - Slovenščina"],
["es", "Spanish - Español"],
["sv", "Swedish - Svenska"],
["ta", "Tamil - தமிழ்"],
["te", "Telugu - తెలుగు"],
["th", "Thai - ไทย"],
["tr", "Turkish - Türkçe"],
["uk", "Ukrainian - Українська"],
["vi", "Vietnamese - Tiếng Việt"],
`;

const customApiHelpZH = `// 请求数据默认格式
{
  "url": "{{url}}",
  "method": "POST",
  "headers": {
    "Content-type": "application/json",
    "Authorization": "Bearer {{key}}"
  },
  "body": {
    "text": "{{text}}", // 待翻译文字
    "from": "{{from}}", // 文字的语言（可能为空）
    "to": "{{to}}",     // 目标语言
  },
}
// 返回数据默认格式
{
  text: "", // 翻译后的文字
  from: "", // 识别的源语言
  to: "",   // 目标语言（可选）
}
// Hook 范例
// URL
https://translate.googleapis.com/translate_a/single?client=gtx&dj=1&dt=t&ie=UTF-8&q={{text}}&sl=en&tl=zh-CN

// Request Hook
(text, from, to, url, key) => [url, {
  headers: {
      "Content-type": "application/json",
  },
  method: "GET",
  body: null,
}]

// Response Hook
// 其中返回数组第一个值表示译文字符串，第二个值为布尔值，表示原文语言与目标语言是否相同
(res, text, from, to) => [res.sentences.map((item) => item.trans).join(" "), to === res.src]
// 支持的语言代码如下
${customApiLangs}
`;

const customApiHelpEN = `// Default request
{
  "url": "{{url}}",
  "method": "POST",
  "headers": {
    "Content-type": "application/json",
    "Authorization": "Bearer {{key}}"
  },
  "body": {
    "text": "{{text}}", // Text to be translated
    "from": "{{from}}", // The language of the text (may be empty)
    "to": "{{to}}",     // Target language
  },
}
// Default response
{
  text: "", // translated text
  from: "", // Recognized source language
  to: "",   // Target language (optional)
}
/// Hook Example
// URL
https://translate.googleapis.com/translate_a/single?client=gtx&dj=1&dt=t&ie=UTF-8&q={{text}}&sl=en&tl=zh-CN

// Request Hook
(text, from, to, url, key) => [url, {
  headers: {
      "Content-type": "application/json",
  },
  method: "GET",
  body: null,
}]

// Response Hook
// In the returned array, the first value is the translated string, while the second value is a boolean
// that indicates whether the source language is the same as the target language.
(res, text, from, to) => [res.sentences.map((item) => item.trans).join(" "), to === res.src]
// The supported language codes are as follows
${customApiLangs}
`;

const requestHookHelperZH = `1、第一个参数包含如下字段：'texts', 'from', 'to', 'url', 'key', 'model', 'systemPrompt', ...
2、返回值必须是包含以下字段的对象： 'url', 'body', 'headers', 'method'
3、如返回空值，则hook函数不会产生任何效果。

// 示例
async (args, { url, body, headers, userMsg, method } = {}) => {
  return { url, body, headers, userMsg, method };
}`;

const requestHookHelperEN = `1. The first parameter contains the following fields: 'texts', 'from', 'to', 'url', 'key', 'model', 'systemPrompt', ...
2. The return value must be an object containing the following fields: 'url', 'body', 'headers', 'method'
3. If a null value is returned, the hook function will have no effect.

// Example
async (args, { url, body, headers, userMsg, method } = {}) => {
  return { url, body, headers, userMsg, method };
}`;

const responsetHookHelperZH = `1、第一个参数包含如下字段：'res', ...
2、返回值必须是包含以下字段的对象： 'translations'
  （'translations' 应为一个二维数组：[[译文, 原文语言]]）
3、如返回空值，则hook函数不会产生任何效果。

// 示例
async ({ res, ...args }) => {
  const translations = [["你好", "en"]];
  const modelMsg = {}; // 用于AI上下文
  return { translations, modelMsg };
}`;

const responsetHookHelperEN = `1. The first parameter contains the following fields: 'res', ...
2. The return value must be an object containing the following fields: 'translations'
  ('translations' should be a two-dimensional array: [[translation, source language]]).
3. If a null value is returned, the hook function will have no effect.

// Example
async ({ res, ...args }) => {
  const translations = [["你好", "en"]];
  const modelMsg = {}; // For AI context
  return { translations, modelMsg };
}`;

export const I18N = {
  app_name: {
    zh: `序列翻译`,
    en: `Sequence Translator`,
  },
  translate: {
    zh: `翻译`,
    en: `Translate`,
  },
  custom_api_help: {
    zh: customApiHelpZH,
    en: customApiHelpEN,
  },
  request_hook_helper: {
    zh: requestHookHelperZH,
    en: requestHookHelperEN,
  },
  response_hook_helper: {
    zh: responsetHookHelperZH,
    en: responsetHookHelperEN,
  },
  translate_alt: {
    zh: `翻译`,
    en: `Translate`,
  },
  basic_setting: {
    zh: `基本设置`,
    en: `Basic Setting`,
  },
  rules_setting: {
    zh: `规则设置`,
    en: `Rules Setting`,
  },
  apis_setting: {
    zh: `模型设置`,
    en: `Model Setting`,
  },
  sync_setting: {
    zh: `同步设置`,
    en: `Sync Setting`,
  },
  patch_setting: {
    zh: `补丁设置`,
    en: `Patch Setting`,
  },
  patch_setting_help: {
    zh: `针对一些特殊网站的修正脚本，以便翻译软件得到更好的展示效果。`,
    en: `Corrected scripts for some special websites so that the translation software can get better display results.`,
  },
  inject_webfix: {
    zh: `注入修复补丁`,
    en: `Inject Webfix`,
  },
  ui_lang: {
    zh: `界面语言`,
    en: `Interface Language`,
  },
  fetch_limit: {
    zh: `最大并发请求数量 (1-100)`,
    en: `Maximum Number Of Concurrent Requests (1-100)`,
  },
  if_think: {
    zh: `启用或禁用模型的深度思考能力`,
    en: `Enable or disable the model’s thinking behavior `,
  },
  think: {
    zh: `启用深度思考`,
    en: `enable thinking`,
  },
  nothink: {
    zh: `禁用深度思考`,
    en: `disable thinking`,
  },
  think_ignore: {
    zh: `忽略以下模型的<think>输出,逗号(,)分割,当模型支持思考但ollama不支持时需要填写本参数`,
    en: `Ignore the <think> block for the following models, comma (,) separated`,
  },
  fetch_interval: {
    zh: `每次请求间隔时间 (0-5000ms)`,
    en: `Time Between Requests (0-5000ms)`,
  },
  translate_interval: {
    zh: `翻译间隔时间 (1-2000ms)`,
    en: `Translation Interval (1-2000ms)`,
  },
  http_timeout: {
    zh: `请求超时时间 (100-6000000ms)`,
    en: `Request Timeout Time (100-6000000ms)`,
  },
  custom_header: {
    zh: `自定义Header参数`,
    en: `Custom Header Params`,
  },
  custom_header_help: {
    zh: `使用JSON格式，例如 "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0"`,
    en: `Use JSON format, for example "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:141.0) Gecko/20100101 Firefox/141.0"`,
  },
  custom_body: {
    zh: `自定义Body参数`,
    en: `Custom Body Params`,
  },
  custom_body_help: {
    zh: `使用JSON格式，例如 "top_p": 0.7`,
    en: `Use JSON format, for example "top_p": 0.7`,
  },
  min_translate_length: {
    zh: `最小翻译字符数 (1-100)`,
    en: `Minimum number Of Translated Characters (1-100)`,
  },
  max_translate_length: {
    zh: `最大翻译字符数 (100-100000)`,
    en: `Maximum number Of Translated Characters (100-100000)`,
  },
  num_of_newline_characters: {
    zh: `换行字符数 (1-1000)`,
    en: `Number of Newline Characters (1-1000)`,
  },
  translate_service: {
    zh: `翻译服务`,
    en: `Translate Service`,
  },
  translate_service_multiple: {
    zh: `翻译服务 (支持多选)`,
    en: `Translation service (multiple supported)`,
  },
  translate_timing: {
    zh: `翻译时机`,
    en: `Translate Timing`,
  },
  mk_pagescroll: {
    zh: `滚动加载翻译（推荐）`,
    en: `Rolling Loading (Suggested)`,
  },
  mk_pageopen: {
    zh: `立即全部翻译`,
    en: `Translate all now`,
  },
  mk_mouseover: {
    zh: `鼠标悬停翻译`,
    en: `Mouseover`,
  },
  mk_ctrlKey: {
    zh: `Control + 鼠标悬停`,
    en: `Control + Mouseover`,
  },
  mk_shiftKey: {
    zh: `Shift + 鼠标悬停`,
    en: `Shift + Mouseover`,
  },
  mk_altKey: {
    zh: `Alt + 鼠标悬停`,
    en: `Alt + Mouseover`,
  },
  from_lang: {
    zh: `原文语言`,
    en: `Source Language`,
  },
  to_lang: {
    zh: `目标语言`,
    en: `Target Language`,
  },
  to_lang2: {
    zh: `第二目标语言`,
    en: `Target Language 2`,
  },
  to_lang2_helper: {
    zh: `设定后，与目标语言产生互译效果，但依赖远程语言识别。`,
    en: `After setting, it will produce mutual translation effect with the target language, but it relies on remote language recognition.`,
  },
  text_style: {
    zh: `译文样式`,
    en: `Text Style`,
  },
  text_style_alt: {
    zh: `译文样式`,
    en: `Text Style`,
  },
  bg_color: {
    zh: `样式颜色`,
    en: `Style Color`,
  },
  remain_unchanged: {
    zh: `保留不变`,
    en: `Remain Unchanged`,
  },
  google_api: {
    zh: `谷歌翻译接口`,
    en: `Google Translate API`,
  },
  default_selector: {
    zh: `默认选择器`,
    en: `Default selector`,
  },
  selector_rules: {
    zh: `选择器规则`,
    en: `Selector Rules`,
  },
  save: {
    zh: `保存`,
    en: `Save`,
  },
  edit: {
    zh: `编辑`,
    en: `Edit`,
  },
  cancel: {
    zh: `取消`,
    en: `Cancel`,
  },
  delete: {
    zh: `删除`,
    en: `Delete`,
  },
  reset: {
    zh: `重置`,
    en: `Reset`,
  },
  add: {
    zh: `添加`,
    en: `Add`,
  },
  personal_rules: {
    zh: `个人规则`,
    en: `Rules`,
  },
  rules_warn_1: {
    zh: `1、规则生效的优先级依次为：个人规则 > 全局规则。"全局规则"相当于兜底规则。`,
    en: `1. The priority of rules is: personal rules > global rules. "Global rules" are like a fallback rule.`,
  },
  rules_warn_2: {
    zh: `2、关于规则填写：输入框留空或下拉框选"*"表示采用全局规则。CSS选择器支持 + 号前缀表示在全局规则基础上追加，- 号表示剔除。`,
    en: `2. Regarding filling in the rules: Leave the input box blank or select "*" in the drop-down box to use global rule. CSS selectors support prefixes: "+" means add to the global rules, "-" means exclude.`,
  },
  sync_warn: {
    zh: `涉及隐私数据的同步请谨慎选择第三方同步服务，建议自行搭建 kiss-worker 或 WebDAV 服务。`,
    en: `When synchronizing data that involves privacy, please be cautious about choosing third-party sync services. It is recommended to set up your own sync service using kiss-worker or WebDAV.`,
  },
  sync_warn_2: {
    zh: `如果服务器存在其他客户端同步的数据，第一次同步将直接覆盖本地配置，后面则根据修改时间，新的覆盖旧的。`,
    en: `If the server has data synchronized by other clients, the first synchronization will directly overwrite the local configuration, and later, according to the modification time, the new one will overwrite the old one.`,
  },
  about_sync_api: {
    zh: `自建kiss-wroker数据同步服务`,
    en: `Self-hosting a Kiss-worker data sync service`,
  },
  about_api: {
    zh: `1、其中 BuiltinAI 为浏览器内置AI翻译，目前仅 Chrome 138 及以上版本得到支持。`,
    en: `1. BuiltinAI is the browser's built-in AI translation, which is currently only supported by Chrome 138 and above.`,
  },
  about_api_2: {
    zh: `2、大部分AI接口都与OpenAI兼容，因此选择OpenAI类型即可。“是否聚合发送翻译请求”所对应的 Prompt 并不相同，并且不是所有接口都支持聚合翻译。`,
    en: `2. Most AI interfaces are compatible with OpenAI, so you can simply select the OpenAI type. The prompts corresponding to “Whether to aggregate translation requests” are different, and not all interfaces support aggregated translation.`,
  },
  about_api_3: {
    zh: `3、理论上，所有翻译接口，都可以通过自定义接口 (Custom) 的形式使用。`,
    en: `3. In theory, all translation interfaces can be used by configuring them as a custom interface.`,
  },
  about_api_proxy: {
    zh: `查看自建一个翻译接口代理`,
    en: `Check out the self-built translation interface proxy`,
  },
  setting_helper: {
    zh: `新旧配置并不兼容，导出的旧版配置，勿再次导入。`,
    en: `The old and new configurations are not compatible. Do not import the exported old configuration again.`,
  },
  style_none: {
    zh: `无`,
    en: `None`,
  },
  under_line: {
    zh: `下划直线`,
    en: `Underline`,
  },
  dot_line: {
    zh: `下划点状线`,
    en: `Dotted Underline`,
  },
  dash_line: {
    zh: `下划虚线`,
    en: `Dashed Underline`,
  },
  dash_box: {
    zh: `虚线框`,
    en: `Dashed Box`,
  },
  dash_line_bold: {
    zh: `下划虚线加粗`,
    en: `Dashed Underline Bold`,
  },
  dash_box_bold: {
    zh: `虚线框加粗`,
    en: `Dashed Box Bold`,
  },
  marker: {
    zh: `马克笔`,
    en: `Marker`,
  },
  gradient_marker: {
    zh: `渐变马克笔`,
    en: `Gradient Marker`,
  },
  wavy_line: {
    zh: `下划波浪线`,
    en: `Wavy Underline`,
  },
  wavy_line_bold: {
    zh: `下划波浪线加粗`,
    en: `Wavy Underline Bold`,
  },
  fuzzy: {
    zh: `模糊`,
    en: `Fuzzy`,
  },
  highlight: {
    zh: `高亮`,
    en: `Highlight`,
  },
  blockquote: {
    zh: `引用`,
    en: `Blockquote`,
  },
  gradient: {
    zh: `渐变`,
    en: `Gradient`,
  },
  blink: {
    zh: `闪现`,
    en: `Blink`,
  },
  glow: {
    zh: `发光`,
    en: `Glow`,
  },
  colorful: {
    zh: `多彩`,
    en: `Colorful`,
  },
  setting: {
    zh: `设置`,
    en: `Setting`,
  },
  pattern: {
    zh: `匹配网址`,
    en: `URL pattern`,
  },
  pattern_helper: {
    zh: `1、支持星号(*)通配符。2、多个URL用换行或英文逗号“,”分隔。`,
    en: `1. Supports the asterisk (*) wildcard character. 2. Separate multiple URLs with newlines or English commas ",".`,
  },
  selector_helper: {
    zh: `1、需要翻译的目标元素。2、开启自动扫描页面后，本设置无效。3、遵循CSS选择器语法。`,
    en: `1. The target element to be translated. 2. This setting is invalid when automatic page scanning is enabled. 3. Follow the CSS selector syntax.`,
  },
  translate_switch: {
    zh: `开启翻译`,
    en: `Translate Switch`,
  },
  default_enabled: {
    zh: `默认开启`,
    en: `Enabled`,
  },
  default_disabled: {
    zh: `默认关闭`,
    en: `Disabled`,
  },
  selector: {
    zh: `选择器`,
    en: `Selector`,
  },
  target_selector: {
    zh: `目标元素选择器`,
    en: `Target element selector`,
  },
  keep_selector: {
    zh: `保留元素选择器`,
    en: `Keep unchanged selector`,
  },
  keep_selector_helper: {
    zh: `1、目标元素下面需要原样保留的子节点。2、遵循CSS选择器语法。`,
    en: `1. The child nodes under the target element need to remain intact. 2. Follow the CSS selector syntax.`,
  },
  root_selector: {
    zh: `根节点选择器`,
    en: `Root node selector`,
  },
  root_selector_helper: {
    zh: `1、用于缩小页面翻译范围。2、遵循CSS选择器语法。`,
    en: `1. Used to narrow the translation scope of the page. 2. Follow the CSS selector syntax.`,
  },
  ignore_selector: {
    zh: `不翻译节点选择器`,
    en: `Ignore node selectors`,
  },
  ignore_selector_helper: {
    zh: `1、需要忽略的节点。2、遵循CSS选择器语法。`,
    en: `1. Nodes to be ignored. 2. Follow CSS selector syntax.`,
  },
  terms: {
    zh: `专业术语`,
    en: `Terms`,
  },
  terms_helper: {
    zh: `1、支持正则表达式匹配，无需斜杆，不支持修饰符。2、多条术语用换行或分号“;”隔开。3、术语和译文用英文逗号“,”隔开。4、没有译文视为不翻译术语。`,
    en: `1. Supports regular expression matching, no slash required, and no modifiers are supported. 2. Separate multiple terms with newlines or semicolons ";". 3. Terms and translations are separated by English commas ",". 4. If there is no translation, the term will be deemed not to be translated.`,
  },
  ai_terms: {
    zh: `AI专业术语`,
    en: `AI Terms`,
  },
  ai_terms_helper: {
    zh: `1、AI智能替换，不支持正则表达式。2、多条术语用换行或分号“;”隔开。3、术语和译文用英文逗号“,”隔开。4、没有译文视为不翻译术语。`,
    en: `1. AI intelligent replacement does not support regular expressions.2. Separate multiple terms with newlines or semicolons ";". 3. Terms and translations are separated by English commas ",". 4. If there is no translation, the term will be deemed not to be translated.`,
  },
  text_ext_style: {
    zh: `译文附加样式`,
    en: `Translation additional styles`,
  },
  selector_style: {
    zh: `选择器节点样式`,
    en: `Selector Style`,
  },
  terms_style: {
    zh: `专业术语样式`,
    en: `Terms Style`,
  },
  highlight_style: {
    zh: `词汇高亮样式`,
    en: `Fav Words highlight style`,
  },
  selector_style_helper: {
    zh: `开启翻译时注入。`,
    en: `It is injected when translation is turned on.`,
  },
  selector_parent_style: {
    zh: `选择器父节点样式`,
    en: `Parent Selector Style`,
  },
  selector_grand_style: {
    zh: `选择器祖节点样式`,
    en: `Grand Selector Style`,
  },
  inject_js: {
    zh: `注入JS`,
    en: `Inject JS`,
  },
  inject_js_helper: {
    zh: `预加载时注入，一个页面仅运行一次。内置全局对象 KT: {
      apiTranslate,
      apiDectect,
      apiSetting,
      apisMap,
      toLang,
      docInfo,
      glossary,
    }`,
    en: `Injected during preload, runs only once per page. Built-in global object KT: {
      apiTranslate,
      apiDectect,
      apiSetting,
      apisMap,
      toLang,
      docInfo,
      glossary,
    }`,
  },
  inject_css: {
    zh: `注入CSS`,
    en: `Inject CSS`,
  },
  inject_css_helper: {
    zh: `预加载时注入，一个页面仅运行一次。`,
    en: `Injected during preload, runs only once per page.`,
  },
  fixer_function: {
    zh: `修复函数`,
    en: `Fixer Function`,
  },
  fixer_function_helper: {
    zh: `1、br是将<br>换行替换成<p "kiss-p">。2、bn是将\\n换行替换成<p "kiss-p">。3、brToDiv和bnToDiv是替换成<div class="kiss-p">。`,
    en: `1. br replaces <br> line breaks with <p "kiss-p">. 2. bn replaces \\n newline with <p "kiss-p">. 3. brToDiv and bnToDiv are replaced with <div class="kiss-p">.`,
  },
  import: {
    zh: `导入`,
    en: `Import`,
  },
  export: {
    zh: `导出`,
    en: `Export`,
  },
  export_translation: {
    zh: `导出释义`,
    en: `Export Translation`,
  },
  error_cant_be_blank: {
    zh: `不能为空`,
    en: `Can not be blank`,
  },
  error_duplicate_values: {
    zh: `存在重复的值`,
    en: `There are duplicate values`,
  },
  error_wrong_file_type: {
    zh: `错误的文件类型`,
    en: `Wrong file type`,
  },
  error_fetch_url: {
    zh: `请检查url地址是否正确或稍后再试。`,
    en: `Please check if the url address is correct or try again later.`,
  },
  deepl_api: {
    zh: `DeepL 接口`,
    en: `DeepL API`,
  },
  deepl_key: {
    zh: `DeepL 密钥`,
    en: `DeepL Key`,
  },
  openai_api: {
    zh: `OpenAI 接口`,
    en: `OpenAI API`,
  },
  openai_key: {
    zh: `OpenAI 密钥`,
    en: `OpenAI Key`,
  },
  openai_model: {
    zh: `OpenAI 模型`,
    en: `OpenAI Model`,
  },
  openai_prompt: {
    zh: `OpenAI 提示词`,
    en: `OpenAI Prompt`,
  },
  if_clear_cache: {
    zh: `是否清除缓存（默认缓存7天）`,
    en: `Whether clear cache (Default cache is 7 days)`,
  },
  clear_cache_never: {
    zh: `不清除缓存`,
    en: `Never clear cache`,
  },
  clear_cache_restart: {
    zh: `重启浏览器时清除缓存`,
    en: `Clear cache when restarting browser`,
  },
  data_sync_type: {
    zh: `数据同步方式`,
    en: `Data Sync Type`,
  },
  data_sync_url: {
    zh: `数据同步接口`,
    en: `Data Sync API`,
  },
  data_sync_user: {
    zh: `数据同步账户`,
    en: `Data Sync User`,
  },
  data_sync_key: {
    zh: `数据同步密钥`,
    en: `Data Sync Key`,
  },
  sync_now: {
    zh: `立即同步`,
    en: `Sync Now`,
  },
  sync_success: {
    zh: `同步成功！`,
    en: `Sync Success`,
  },
  sync_failed: {
    zh: `同步失败！`,
    en: `Sync Error`,
  },
  error_got_some_wrong: {
    zh: `抱歉，出错了！`,
    en: `Sorry, something went wrong!`,
  },
  error_sync_setting: {
    zh: `您的同步类型必须为“KISS-Worker”，且需填写完整`,
    en: `Your sync type must be "KISS-Worker" and must be filled in completely`,
  },
  click_test: {
    zh: `点击测试`,
    en: `Click Test`,
  },
  test_success: {
    zh: `测试成功`,
    en: `Test success`,
  },
  test_failed: {
    zh: `测试失败`,
    en: `Test failed`,
  },
  clear_all_cache_now: {
    zh: `立即清除全部缓存`,
    en: `Clear all cache now`,
  },
  clear_cache: {
    zh: `清除缓存`,
    en: `Clear Cache`,
  },
  clear_success: {
    zh: `清除成功`,
    en: `Clear success`,
  },
  clear_failed: {
    zh: `清除失败`,
    en: `Clear failed`,
  },
  share: {
    zh: `分享`,
    en: `Share`,
  },
  clear_all: {
    zh: `清空`,
    en: `Clear All`,
  },
  help: {
    zh: `求助`,
    en: `Help`,
  },
  restore_default: {
    zh: `恢复默认`,
    en: `Restore Default`,
  },
  shortcuts_setting: {
    zh: `快捷键设置`,
    en: `Shortcuts Setting`,
  },
  toggle_translate_shortcut: {
    zh: `"开启翻译"快捷键`,
    en: `"Toggle Translate" Shortcut`,
  },
  toggle_style_shortcut: {
    zh: `"切换样式"快捷键`,
    en: `"Toggle Style" Shortcut`,
  },
  toggle_popup_shortcut: {
    zh: `"打开弹窗"快捷键`,
    en: `"Open Popup" Shortcut`,
  },
  open_setting_shortcut: {
    zh: `"打开设置"快捷键`,
    en: `"Open Setting" Shortcut`,
  },
  hide_tran_button: {
    zh: `隐藏翻译按钮`,
    en: `Hide Translate Button`,
  },
  hide_click_away: {
    zh: `点击外部关闭弹窗`,
    en: `Click outside to close the pop-up window`,
  },
  use_simple_style: {
    zh: `使用简洁界面`,
    en: `Use a simple interface`,
  },
  show: {
    zh: `显示`,
    en: `Show`,
  },
  hide: {
    zh: `隐藏`,
    en: `Hide`,
  },
  save_rule: {
    zh: `保存本站规则`,
    en: `Save this site rule`,
  },
  domain: {
    zh: `网域`,
    en: `Domain`,
  },
  global_rule: {
    zh: `全局规则`,
    en: `Global Rule`,
  },
  input_translate: {
    zh: `输入框翻译`,
    en: `Input Box Translation`,
  },
  use_input_box_translation: {
    zh: `启用输入框翻译`,
    en: `Input Box Translation`,
  },
  input_selector: {
    zh: `输入框选择器`,
    en: `Input Selector`,
  },
  input_selector_helper: {
    zh: `用于输入框翻译。`,
    en: `Used for input box translation.`,
  },
  trigger_trans_shortcut: {
    zh: `触发翻译快捷键`,
    en: `Trigger Translation Shortcut Keys`,
  },
  trigger_trans_shortcut_help: {
    zh: `默认为单击“AltLeft+KeyI”`,
    en: `Default is "AltLeft+KeyI"`,
  },
  shortcut_press_count: {
    zh: `快捷键连击次数`,
    en: `Shortcut Press Number`,
  },
  combo_timeout: {
    zh: `连击超时时间 (10-1000ms)`,
    en: `Combo Timeout (10-1000ms)`,
  },
  input_trans_start_sign: {
    zh: `翻译起始标识`,
    en: `Translation Start Sign`,
  },
  input_trans_start_sign_help: {
    zh: `标识后面可以加目标语言代码，如： “/en 你好”、“/zh hello”`,
    en: `The target language code can be added after the sign, such as: "/en 你好", "/zh hello"`,
  },
  detect_lang_remote: {
    zh: `远程语言检测`,
    en: `Remote language detection`,
  },
  detect_lang_remote_help: {
    zh: `启用后检测准确度增加，但会降低翻译速度，请酌情开启`,
    en: `After enabling, the detection accuracy will increase, but it will reduce the translation speed. Please enable it as appropriate.`,
  },
  detect_lang_service: {
    zh: `语言检测服务`,
    en: `Language detect service`,
  },
  disable: {
    zh: `禁用`,
    en: `Disable`,
  },
  enable: {
    zh: `启用`,
    en: `Enable`,
  },
  selection_translate: {
    zh: `划词翻译`,
    en: `Selection Translation`,
  },
  toggle_selection_translate: {
    zh: `启用划词翻译`,
    en: `Use Selection Translate`,
  },
  trigger_tranbox_shortcut: {
    zh: `显示翻译框/翻译选中文字快捷键`,
    en: `Open Translate Popup/Translate Selected Shortcut`,
  },
  tranbtn_offset_x: {
    zh: `翻译按钮偏移X（±200）`,
    en: `Translate Button Offset X (±200)`,
  },
  tranbtn_offset_y: {
    zh: `翻译按钮偏移Y（±200）`,
    en: `Translate Button Offset Y (±200)`,
  },
  tranbox_offset_x: {
    zh: `翻译框偏移X（±200）`,
    en: `Translate Box Offset X (±200)`,
  },
  tranbox_offset_y: {
    zh: `翻译框偏移Y（±200）`,
    en: `Translate Box Offset Y (±200)`,
  },
  translated_text: {
    zh: `译文`,
    en: `Translated Text`,
  },
  original_text: {
    zh: `原文`,
    en: `Original Text`,
  },
  favorite_words: {
    zh: `收藏词汇`,
    en: `Favorite Words`,
  },
  touch_setting: {
    zh: `触屏设置`,
    en: `Touch Setting`,
  },
  touch_translate_shortcut: {
    zh: `触屏翻译快捷方式 (支持多选)`,
    en: `Touch Translate Shortcut (multiple supported)`,
  },
  touch_tap_0: {
    zh: `禁用`,
    en: `Disable`,
  },
  touch_tap_2: {
    zh: `双指轻触`,
    en: `Two finger tap`,
  },
  touch_tap_3: {
    zh: `三指轻触`,
    en: `Three finger tap`,
  },
  touch_tap_4: {
    zh: `四指轻触`,
    en: `Four finger tap`,
  },
  touch_tap_5: {
    zh: `单指双击`,
    en: `Double-click`,
  },
  touch_tap_6: {
    zh: `单指三击`,
    en: `Triple-click`,
  },
  touch_tap_7: {
    zh: `双指双击`,
    en: `Two-finger double-click`,
  },
  translate_blacklist: {
    zh: `禁用翻译名单`,
    en: `Translate Blacklist`,
  },
  disabled_orilist: {
    zh: `禁用Origin名单`,
    en: `Disabled Origin List`,
  },
  disabled_csplist: {
    zh: `禁用CSP名单`,
    en: `Disabled CSP List`,
  },
  disabled_csplist_helper: {
    zh: `3、通过调整CSP策略，使得某些页面能够注入JS/CSS/Media，请谨慎使用，除非您已知晓相关风险。`,
    en: `3. By adjusting the CSP policy, some pages can inject JS/CSS/Media. Please use it with caution unless you are aware of the related risks.`,
  },
  skip_langs: {
    zh: `不翻译的语言`,
    en: `Disable Languages`,
  },
  skip_langs_helper: {
    zh: `此功能依赖准确的语言检测，建议启用远程语言检测。`,
    en: `This feature relies on accurate language detection. It is recommended to enable remote language detection.`,
  },
  context_menus: {
    zh: `右键菜单`,
    en: `Context Menus`,
  },
  hide_context_menus: {
    zh: `隐藏右键菜单`,
    en: `Hide Context Menus`,
  },
  simple_context_menus: {
    zh: `简单右键菜单`,
    en: `Simple_context_menus Context Menus`,
  },
  secondary_context_menus: {
    zh: `二级右键菜单`,
    en: `Secondary Context Menus`,
  },
  mulkeys_help: {
    zh: `支持用换行或英文逗号“,”分隔，轮询调用。`,
    en: `Supports polling calls separated by newlines or English commas ",".`,
  },
  translation_element_tag: {
    zh: `译文元素标签`,
    en: `Translation Element Tag`,
  },
  show_only_translations: {
    zh: `仅显示译文`,
    en: `Show Only Translations`,
  },
  show_only_translations_help: {
    zh: `非完美实现，某些页面可能有样式等问题。`,
    en: `It is not a perfect implementation and some pages may have style issues.`,
  },
  translate_page_title: {
    zh: `是否翻译页面标题`,
    en: `Translate Page Title`,
  },
  more: {
    zh: `更多`,
    en: `More`,
  },
  less: {
    zh: `更少`,
    en: `Less`,
  },
  fixer_selector: {
    zh: `网页修复选择器`,
    en: `Fixer Selector`,
  },
  reg_niutrans: {
    zh: `获取小牛翻译密钥【序列翻译专属新用户注册赠送300万字符】`,
    en: `Get NiuTrans APIKey [Sequence Translator Exclusive New User Registration Free 3 Million Characters]`,
  },
  trigger_mode: {
    zh: `触发方式`,
    en: `Trigger Mode`,
  },
  trigger_click: {
    zh: `点击触发`,
    en: `Click Trigger`,
  },
  trigger_hover: {
    zh: `鼠标悬停触发`,
    en: `Hover Trigger`,
  },
  trigger_select: {
    zh: `选中触发`,
    en: `Select Trigger`,
  },
  extend_styles: {
    zh: `附加样式`,
    en: `Extend Styles`,
  },
  custom_option: {
    zh: `自定义选项`,
    en: `Custom Option`,
  },
  translate_selected_text: {
    zh: `翻译选中文字`,
    en: `Translate Selected Text`,
  },
  toggle_style: {
    zh: `切换样式`,
    en: `Toggle Style`,
  },
  open_menu: {
    zh: `打开弹窗菜单`,
    en: `Open Popup Menu`,
  },
  open_setting: {
    zh: `打开设置`,
    en: `Open Setting`,
  },
  follow_selection: {
    zh: `翻译框跟随选中文本`,
    en: `Transbox Follow Selection`,
  },
  tranbox_auto_height: {
    zh: `翻译框自适应高度`,
    en: `Translation box adaptive height`,
  },
  translate_start_hook: {
    zh: `翻译开始钩子函数`,
    en: `Translate Start Hook`,
  },
  translate_start_hook_helper: {
    zh: `翻译前时运行，入参为： {text,
      fromLang,
      toLang,
      apiSetting,
      docInfo,
      glossary,}`,
    en: `Run before translation, input parameters are: {text,
      fromLang,
      toLang,
      apiSetting,
      docInfo,
      glossary,}`,
  },
  translate_end_hook: {
    zh: `翻译完成钩子函数`,
    en: `Translate End Hook`,
  },
  translate_end_hook_helper: {
    zh: `翻译完成时运行，入参为： ({hostNode, parentNode, nodes, wrapperNode, innerNode})`,
    en: `Run when translation is complete, input parameters are: ({hostNode, parentNode, nodes, wrapperNode, innerNode})`,
  },
  translate_remove_hook: {
    zh: `翻译移除钩子函数`,
    en: `Translate Removed Hook`,
  },
  translate_remove_hook_helper: {
    zh: `翻译移除时运行，入参为： 翻译节点。`,
    en: `Run when translation is removed, the input parameters are: translation node.`,
  },
  english_dict: {
    zh: `英文词典`,
    en: `English Dictionary`,
  },
  english_suggest: {
    zh: `英文建议`,
    en: `English Suggest`,
  },
  api_name: {
    zh: `接口名称`,
    en: `API Name`,
  },
  is_disabled: {
    zh: `是否禁用`,
    en: `Is Disabled`,
  },
  translate_selected: {
    zh: `是否启用划词翻译`,
    en: `If translate selected`,
  },
  use_batch_fetch: {
    zh: `是否聚合发送翻译请求`,
    en: `Whether to aggregate and send translation requests`,
  },
  batch_interval: {
    zh: `聚合请求等待时间(10-10000)`,
    en: `Aggregation request waiting time (10-10000)`,
  },
  batch_size: {
    zh: `聚合请求最大段落数(1-100)`,
    en: `Maximum number of paragraphs in an aggregation request (1-100)`,
  },
  batch_length: {
    zh: `聚合请求最大文本长度(1000-100000)`,
    en: `Maximum text length for aggregation requests (1000-100000)`,
  },
  use_stream: {
    zh: `是否启用流式传输`,
    en: `Whether to enable streaming`,
  },
  use_context: {
    zh: `是否启用智能上下文`,
    en: `Whether to enable AI context`,
  },
  context_size: {
    zh: `上下文会话数量(1-20)`,
    en: `Number of context sessions(1-20)`,
  },
  auto_scan_page: {
    zh: `自动扫描页面`,
    en: `Auto scan page`,
  },
  has_rich_text: {
    zh: `启用富文本翻译`,
    en: `Enable rich text translation`,
  },
  has_shadowroot: {
    zh: `扫描Shadowroot`,
    en: `Scan Shadowroot`,
  },
  mousehover_translate: {
    zh: `鼠标悬停翻译`,
    en: `Mouseover Translation`,
  },
  use_mousehover_translation: {
    zh: `启用鼠标悬停翻译`,
    en: `Enable mouseover translation`,
  },
  selected_translation_alert: {
    zh: `划词翻译的开启和关闭请到“规则设置”里面设置。`,
    en: `To turn selected translation on or off, please go to "Rule Settings".`,
  },
  mousehover_key_help: {
    zh: `当快捷键置空时表示鼠标懸停直接翻译`,
    en: `When the shortcut key is empty, it means that the mouse hovers to translate directly`,
  },
  autoscan_alt: {
    zh: `自动扫描`,
    en: `Auto Scan`,
  },
  shadowroot_alt: {
    zh: `ShadowRoot`,
    en: `ShadowRoot`,
  },
  richtext_alt: {
    zh: `保留富文本`,
    en: `Rich Text`,
  },
  transonly_alt: {
    zh: `隐藏原文`,
    en: `Hide Original`,
  },
  confirm_title: {
    zh: `确认`,
    en: `Confirm`,
  },
  confirm_message: {
    zh: `确定操作吗？`,
    en: `Are you sure you want to proceed?`,
  },
  confirm_action: {
    zh: `确定`,
    en: `Confirm`,
  },
  cancel_action: {
    zh: `取消`,
    en: `Cancel`,
  },
  pls_press_shortcut: {
    zh: `请按下快捷键组合`,
    en: `Please press the shortcut key combination`,
  },
  load_setting_err: {
    zh: `数据加载出错，请刷新页面或卸载后重新安装。`,
    en: `Please press the shortcut key combination`, // 注意：这里的英文和繁体是用户上次错误的拷贝
    en: `Translation style`,
  },
  placeholder: {
    zh: `占位符`,
    en: `Placeholder`,
  },
  tag_name: {
    zh: `占位标签名`,
    en: `Placeholder tag name`,
  },
  system_prompt_helper_1: {
    zh: `1. 根据实际情况选择AI支持的聚合格式：`,
    en: `1. Select the aggregation format supported by the AI according to your needs:`,
  },
  json_output: {
    zh: `点击切换 “JSON 格式“`,
    en: `Click to switch to "JSON Format"`,
  },
  xml_output: {
    zh: `点击切换 “XML 格式“`,
    en: `Click to switch to "XML Format"`,
  },
  textlines_output: {
    zh: `点击切换 “多行文本格式“`,
    en: `Click to switch to "Multi-line Text Format"`,
  },
  system_prompt_helper_2: {
    zh: `2. 在未完全理解默认Prompt的情况下，请勿随意修改，否则可能无法工作。`,
    en: `2. Do not modify the default prompt without fully understanding it, otherwise it may not work.`,
  },
  if_pre_init: {
    zh: `是否预初始化`,
    en: `Whether to pre-initialize`,
  },
  export_old: {
    zh: `导出旧版`,
    en: `Export old version`,
  },
  favorite_words_helper: {
    zh: `导入词汇请使用txt文件，每一行一个单词。`,
    en: `To import vocabulary, please use a txt file with one word per line.`,
  },
  btn_tip_click_away: {
    zh: `失焦隐藏/显示`,
    en: `Loss of focus hide/show`,
  },
  btn_tip_follow_selection: {
    zh: `跟随/固定模式`,
    en: `Follow/Fixed Mode`,
  },
  btn_tip_simple_style: {
    zh: `迷你/常规模式`,
    en: `Mini/Regular Mode`,
  },
  api_placeholder: {
    zh: `占位符`,
    en: `Placeholder`,
  },
  api_placetag: {
    zh: `占位标签`,
    en: `Placeholder tags`,
  },
  detected_lang: {
    zh: `语言检测`,
    en: `Language detection`,
  },
  detected_result: {
    zh: `检测结果`,
    en: `Detect result`,
  },
  subtitle_translate: {
    zh: `字幕翻译`,
    en: `Subtitle Translation`,
  },
  toggle_subtitle_translate: {
    zh: `启用字幕翻译`,
    en: `Enable subtitle translation`,
  },
  is_bilingual_view: {
    zh: `双语显示`,
    en: `Enable bilingual display`,
  },
  is_skip_ad: {
    zh: `快进广告`,
    en: `Skip AD`,
  },
  download_subtitles: {
    zh: `下载字幕`,
    en: `Download subtitles`,
  },
  background_styles: {
    zh: `背景样式`,
    en: `DBackground Style`,
  },
  origin_styles: {
    zh: `原文样式`,
    en: `Original style`,
  },
  translation_styles: {
    zh: `译文样式`,
    en: `Translation style`,
  },
  ai_segmentation: {
    zh: `AI智能断句`,
    en: `AI intelligent punctuation`,
  },
  ai_chunk_length: {
    zh: `AI处理切割长度(200-20000)`,
    en: `AI processing chunk length(200-20000)`,
  },
  subtitle_helper_1: {
    zh: `1、目前仅支持Youtube桌面网站。`,
    en: `1. Currently only supports Youtube desktop website.`,
  },
  subtitle_helper_2: {
    zh: `2、插件内置基础的字幕合并、断句算法，可满足大部分情况。`,
    en: `2. The plug-in has built-in basic subtitle merging and sentence segmentation algorithms, which can meet most situations.`,
  },
  subtitle_helper_3: {
    zh: `3、亦可以启用AI智能断句，但需考虑切割长度及AI接口能力，可能处理时间会很长，甚至处理失败，导致无法看到字幕。`,
    en: `3. You can also enable AI intelligent segmentation, but you need to consider the segmentation length and AI interface capabilities. The processing time may be very long or even fail, resulting in the inability to see subtitles.`,
  },
  default_styles_example: {
    zh: `默认样式参考：`,
    en: `Default styles reference:`,
  },
  subtitle_load_succeed: {
    zh: `双语字幕加载成功！`,
    en: `Bilingual subtitles loaded successfully!`,
  },
  subtitle_load_failed: {
    zh: `双语字幕加载失败！`,
    en: `Failed to load bilingual subtitles!`,
  },
  try_get_subtitle_data: {
    zh: `尝试获取字幕数据，请稍候...`,
    en: `Trying to get subtitle data, please wait...`,
  },
  subtitle_data_processing: {
    zh: `字幕数据处理中...`,
    en: `Subtitle data processing...`,
  },
  starting_to_process_subtitle: {
    zh: `开始处理字幕数据...`,
    en: `Starting to process subtitle data...`,
  },
  subtitle_data_is_ready: {
    zh: `字幕数据已准备就绪，请点击KT按钮加载`,
    en: `The subtitle data is ready, please click the KT button to load it`,
  },
  starting_reprocess_events: {
    zh: `重新处理字幕数据...`,
    en: `Reprocess the subtitle data...`,
  },
  waitting_for_subtitle: {
    zh: `请等待字幕数据`,
    en: `Please wait for the subtitle data.`,
  },
  ai_processing_pls_wait: {
    zh: `AI处理中，请稍等...`,
    en: `AI processing in progress, please wait...`,
  },
  processing_subtitles: {
    zh: `字幕处理中...`,
    en: `Subtitle processing...`,
  },
  waiting_subtitles: {
    zh: `等待字幕中`,
    en: `Waiting for subtitles`,
  },
  subtitle_is_not_yet_ready: {
    zh: `字幕数据尚未准备好`,
    en: `Subtitle is not yet ready.`,
  },
  log_level: {
    zh: `日志级别`,
    en: `Log Level`,
  },
  goto_custom_api_example: {
    zh: `点击查看【自定义接口示例】`,
    en: `Click to view [Custom Interface Example]`,
  },
  split_paragraph: {
    zh: `切分长段落`,
    en: `Split long paragraph`,
  },
  split_length: {
    zh: `切分长度 (0-10000)`,
    en: `Segmentation length(0-10000)`,
  },
  highlight_words: {
    zh: `高亮收藏词汇`,
    en: `Highlight favorite words`,
  },
  split_disable: {
    zh: `禁用`,
    en: `Disable`,
  },
  split_textlength: {
    zh: `按照长度切分`,
    en: `Split by length`,
  },
  split_punctuation: {
    zh: `按照句子切分`,
    en: `Split by sentence`,
  },
  highlight_disable: {
    zh: `禁用`,
    en: `Disable`,
  },
  highlight_beforetrans: {
    zh: `翻译前高亮`,
    en: `Highlight before translation`,
  },
  highlight_aftertrans: {
    zh: `翻译后高亮`,
    en: `Highlight after translation`,
  },
  pagescroll_root_margin: {
    zh: `滚动加载提前触发 (0-10000px)`,
    en: `Early triggering of scroll loading (0-10000px)`,
  },
  styles_setting: {
    zh: `样式设置`,
    en: `Style Setting`,
  },
  style_name: {
    zh: `样式名称`,
    en: `Style Name`,
  },
  style_code: {
    zh: `样式代码`,
    en: `Style Code`,
  },
  pre_trans_seconds: {
    zh: `提前翻译时长 (10-36000s)`,
    en: `Pre translation seconds (10-36000s)`,
  },
  throttle_trans_interval: {
    zh: `节流翻译间隔 (1-3600s)`,
    en: `Throttling translation interval (1-3600s)`,
  },
  show_origin_subtitle: {
    zh: `显示原字幕`,
    en: `Show original subtitles`,
  },
  subtitle_same_lang: {
    zh: `原语言与目标语言相同，字幕不予处理`,
    en: `The source language is the same as the target language, subtitles will not be processed`,
  },
  plain_text_translate: {
    zh: `纯文本翻译`,
    en: `Plain text translation`,
  },
  is_enable_enhance: {
    zh: `启用增强功能`,
    en: `Enable Enhancement Features`,
  },
  open_separate_window: {
    zh: `独立窗口打开`,
    en: `Open in Separate Window`,
  },
  comment_support: {
    zh: `好评支持`,
    en: `Leave a Positive Review`,
  },
  appreciate_support: {
    zh: `赞赏支持`,
    en: `Support with a Tip`,
  },
  toggle_transbox: {
    zh: `切换翻译窗`,
    en: `Toggle Translation Box`,
  },
  copy: {
    zh: `复制`,
    en: `Copy`,
  },
  paste: {
    zh: `黏贴`,
    en: `Paste`,
  },
  submit: {
    zh: `提交`,
    en: `Submit`,
  },
  collect: {
    zh: `收藏`,
    en: `Save`,
  },
};

export const newI18n = (lang) => (key) => I18N[key]?.[lang] || "";
