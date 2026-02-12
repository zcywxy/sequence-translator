import { trustedTypesHelper } from "./trustedTypes";
import { APP_LCNAME } from "../config/app";

// Function to inject inline JavaScript code
export const injectInlineJs = (code, id = `${APP_LCNAME}-inline-js`) => {
  if (document.getElementById(id)) {
    return;
  }

  const el = document.createElement("script");
  el.setAttribute("data-source", `${APP_LCNAME} injectInlineJs`);
  el.type = "text/javascript";
  el.id = id;
  el.textContent = trustedTypesHelper.createScript(code);
  (document.head || document.documentElement).appendChild(el);
};

export const injectInlineJsBg = (code, id = `${APP_LCNAME}-inline-js`) => {
  if (document.getElementById(id)) {
    return;
  }

  const el = document.createElement("script");
  el.setAttribute("data-source", `${APP_LCNAME} injectInlineJsBg`);
  el.type = "text/javascript";
  el.id = id;
  el.textContent = code;
  (document.head || document.documentElement).appendChild(el);
};

// Function to inject external JavaScript file
export const injectExternalJs = (src, id = `${APP_LCNAME}-external-js`) => {
  if (document.getElementById(id)) {
    return;
  }

  const el = document.createElement("script");
  el.setAttribute("data-source", `${APP_LCNAME} injectExternalJs`);
  el.type = "text/javascript";
  el.id = id;
  el.src = trustedTypesHelper.createScriptURL(src);
  (document.head || document.documentElement).appendChild(el);
};

// Function to inject internal CSS code
export const injectInternalCss = (styles) => {
  const el = document.createElement("style");
  el.setAttribute("data-source", `${APP_LCNAME} injectInternalCss`);
  el.textContent = styles;
  document.head?.appendChild(el);
};

// Function to inject external CSS file
export const injectExternalCss = (href) => {
  const el = document.createElement("link");
  el.setAttribute("data-source", `${APP_LCNAME} injectExternalCss`);
  el.setAttribute("rel", "stylesheet");
  el.setAttribute("type", "text/css");
  el.setAttribute("href", href);
  document.head?.appendChild(el);
};
