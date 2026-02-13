import { APP_NAME, APP_VERSION, APP_UPNAME } from "./app";

export const KV_RULES_KEY = `sequence-rules_v${APP_VERSION[0]}.json`;
export const KV_WORDS_KEY = "sequence-words.json";
export const KV_RULES_SHARE_KEY = `sequence-rules-share_v${APP_VERSION[0]}.json`;
export const KV_SETTING_KEY = `sequence-setting_v${APP_VERSION[0]}.json`;
export const KV_SALT_SYNC = `${APP_UPNAME}-SYNC`;
export const KV_SALT_SHARE = `${APP_UPNAME}-SHARE`;

export const STOKEY_MSAUTH = `${APP_NAME}_msauth`;
export const STOKEY_BDAUTH = `${APP_NAME}_bdauth`;
export const STOKEY_SETTING_OLD = `${APP_NAME}_setting`;
export const STOKEY_RULES_OLD = `${APP_NAME}_rules`;
export const STOKEY_SETTING = `${APP_NAME}_setting_v${APP_VERSION[0]}`;
export const STOKEY_RULES = `${APP_NAME}_rules_v${APP_VERSION[0]}`;
export const STOKEY_WORDS = `${APP_NAME}_words`;
export const STOKEY_SYNC = `${APP_NAME}_sync`;
export const STOKEY_TRANBOX = `${APP_NAME}_tranbox`;

export const CACHE_NAME = `${APP_NAME}_cache`;
export const DEFAULT_CACHE_TIMEOUT = 3600 * 24 * 7; // 缓存超时时间(7天)
