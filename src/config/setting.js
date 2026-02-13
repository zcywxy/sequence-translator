import { LogLevel } from "../libs/log";
import { DEFAULT_HTTP_TIMEOUT, DEFAULT_API_LIST } from "./api";
import { DEFAULT_CUSTOM_STYLES } from "./styles";

// 默认快捷键
export const OPT_SHORTCUT_TRANSLATE = "toggleTranslate";
export const OPT_SHORTCUT_STYLE = "toggleStyle";
export const OPT_SHORTCUT_POPUP = "togglePopup";
export const OPT_SHORTCUT_SETTING = "openSetting";
export const DEFAULT_SHORTCUTS = {
  [OPT_SHORTCUT_TRANSLATE]: ["AltLeft", "KeyQ"],
  [OPT_SHORTCUT_STYLE]: ["AltLeft", "KeyC"],
  [OPT_SHORTCUT_POPUP]: ["AltLeft", "KeyK"],
  [OPT_SHORTCUT_SETTING]: ["AltLeft", "KeyO"],
};

export const TRANS_MIN_LENGTH = 2; // 最短翻译长度
export const TRANS_MAX_LENGTH = 100000; // 最长翻译长度
export const TRANS_NEWLINE_LENGTH = 20; // 换行字符数
export const DEFAULT_BLACKLIST = [
  "https://fishjar.github.io/sequence-translator/options.html",
  "https://translate.google.com",
  "https://www.deepl.com/translator",
]; // 禁用翻译名单
export const DEFAULT_CSPLIST = []; // 禁用CSP名单
export const DEFAULT_ORILIST = ["https://dict.youdao.com"]; // 移除Origin名单

// 输入框翻译
export const OPT_INPUT_TRANS_SIGNS = ["/", "//", "\\", "\\\\", ">", ">>"];
export const DEFAULT_INPUT_SHORTCUT = ["AltLeft", "KeyI"];
export const DEFAULT_INPUT_RULE = {
  transOpen: true,
  apiSlug: "OPENAI",
  fromLang: "auto",
  toLang: "en",
  triggerShortcut: DEFAULT_INPUT_SHORTCUT,
  triggerCount: 1,
  triggerTime: 200,
  transSign: OPT_INPUT_TRANS_SIGNS[0],
};

// 划词翻译
export const PHONIC_MAP = {
  en_phonic: ["英", "uk"],
  us_phonic: ["美", "en"],
};
export const OPT_TRANBOX_TRIGGER_CLICK = "click";
export const OPT_TRANBOX_TRIGGER_HOVER = "hover";
export const OPT_TRANBOX_TRIGGER_SELECT = "select";
export const OPT_TRANBOX_TRIGGER_ALL = [
  OPT_TRANBOX_TRIGGER_CLICK,
  OPT_TRANBOX_TRIGGER_HOVER,
  OPT_TRANBOX_TRIGGER_SELECT,
];
export const DEFAULT_TRANBOX_SHORTCUT = ["AltLeft", "KeyS"];
export const DEFAULT_TRANBOX_SETTING = {
  transOpen: true,
  apiSlugs: ["OPENAI"],
  fromLang: "auto",
  toLang: "zh-CN",
  toLang2: "en",
  tranboxShortcut: DEFAULT_TRANBOX_SHORTCUT,
  btnOffsetX: 10,
  btnOffsetY: 10,
  boxOffsetX: 0,
  boxOffsetY: 10,
  hideTranBtn: false,
  hideClickAway: false,
  simpleStyle: false,
  followSelection: false,
  autoHeight: false,
  triggerMode: OPT_TRANBOX_TRIGGER_CLICK,
};

export const DEFAULT_SETTING = {
  darkMode: "auto", // 深色模式
  uiLang: "en", // 界面语言
  minLength: TRANS_MIN_LENGTH,
  maxLength: TRANS_MAX_LENGTH,
  newlineLength: TRANS_NEWLINE_LENGTH,
  httpTimeout: DEFAULT_HTTP_TIMEOUT,
  clearCache: false, // 是否在浏览器下次启动时清除缓存
  contextMenuType: 1, // 右键菜单类型(0不显示，1简单菜单，2多级菜单)
  transApis: DEFAULT_API_LIST, // 翻译接口 (v2.0 对象改为数组)
  shortcuts: DEFAULT_SHORTCUTS, // 快捷键
  inputRule: DEFAULT_INPUT_RULE, // 输入框设置
  tranboxSetting: DEFAULT_TRANBOX_SETTING, // 划词翻译设置
  touchModes: [2], // 触屏翻译 {5:单指双击，6:单指三击，7:双指双击} (多选)
  blacklist: DEFAULT_BLACKLIST.join(",\n"), // 禁用翻译名单
  csplist: DEFAULT_CSPLIST.join(",\n"), // 禁用CSP名单
  orilist: DEFAULT_ORILIST.join(",\n"), // 禁用CSP名单
  skipLangs: [], // 不翻译的语言（从rule移回）
  transInterval: 100, // 翻译等待时间
  langDetector: "-", // 远程语言识别服务
  preInit: true, // 是否预加载脚本
  transAllnow: false, // 是否立即全部翻译
  logLevel: LogLevel.INFO.value, // 日志级别
  rootMargin: 500, // 提前触发翻译
  customStyles: DEFAULT_CUSTOM_STYLES, // 自定义样式列表
};
