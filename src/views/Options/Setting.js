import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Link from "@mui/material/Link";
import { useSetting } from "../../hooks/Setting";
import { useI18n } from "../../hooks/I18n";
import { useAlert } from "../../hooks/Alert";
import { isExt } from "../../libs/client";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import {
  UI_LANGS,
  TRANS_NEWLINE_LENGTH,
  CACHE_NAME,
  OPT_LANGDETECTOR_ALL,
  OPT_SHORTCUT_TRANSLATE,
  OPT_SHORTCUT_STYLE,
  OPT_SHORTCUT_POPUP,
  OPT_SHORTCUT_SETTING,
  DEFAULT_BLACKLIST,
  DEFAULT_CSPLIST,
  DEFAULT_ORILIST,
  MSG_CONTEXT_MENUS,
  MSG_UPDATE_CSP,
  DEFAULT_HTTP_TIMEOUT,
  OPT_LANGS_TO,
  OPT_LANGS_FROM,
  OPT_INPUT_TRANS_SIGNS,
  OPT_TRANBOX_TRIGGER_CLICK,
  OPT_TRANBOX_TRIGGER_ALL,
} from "../../config";
import { useShortcut } from "../../hooks/Shortcut";
import ShortcutInput from "./ShortcutInput";
import { sendBgMsg } from "../../libs/msg";
import { kissLog, LogLevel } from "../../libs/log";
import ValidationInput from "../../hooks/ValidationInput";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import { useInputRule } from "../../hooks/InputRule";
import { useTranbox } from "../../hooks/Tranbox";
import { useCallback } from "react";
import { useApiList } from "../../hooks/Api";
import { limitNumber } from "../../libs/utils";
import TooltipField from "./TooltipField";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

function ShortcutItem({ action, label }) {
  const { shortcut, setShortcut } = useShortcut(action);
  return (
    <ShortcutInput value={shortcut} onChange={setShortcut} label={label} />
  );
}

function TooltipSwitch({ label, tooltip, ...props }) {
  const i18n = useI18n();
  return (
    <FormControlLabel
      control={<Switch {...props} />}
      label={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <span>{label}</span>
          {tooltip && (
            <Tooltip title={i18n(tooltip)} arrow placement="top">
              <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.6 }} />
            </Tooltip>
          )}
        </Stack>
      }
      sx={{ width: "fit-content" }}
    />
  );
}

export default function Settings() {
  const i18n = useI18n();
  const { setting, updateSetting } = useSetting();
  const { inputRule, updateInputRule } = useInputRule();
  const { tranboxSetting, updateTranbox } = useTranbox();
  const { enabledApis } = useApiList();
  const alert = useAlert();

  const handleChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    switch (name) {
      case "contextMenuType":
        isExt && sendBgMsg(MSG_CONTEXT_MENUS, value);
        break;
      case "csplist":
        isExt && sendBgMsg(MSG_UPDATE_CSP, { csplist: value });
        break;
      case "orilist":
        isExt && sendBgMsg(MSG_UPDATE_CSP, { orilist: value });
        break;
      default:
    }
    updateSetting({
      [name]: value,
    });
  };

  const handleInputChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    updateInputRule({
      [name]: value,
    });
  };

  const handleInputShortcut = useCallback(
    (val) => {
      updateInputRule({ triggerShortcut: val });
    },
    [updateInputRule]
  );

  const handleTranboxChange = (e) => {
    e.preventDefault();
    let { name, value } = e.target;
    switch (name) {
      case "btnOffsetX":
      case "btnOffsetY":
      case "boxOffsetX":
      case "boxOffsetY":
        value = limitNumber(value, -200, 200);
        break;
      default:
    }
    updateTranbox({
      [name]: value,
    });
  };

  const handleTranboxShortcut = useCallback(
    (val) => {
      updateTranbox({ tranboxShortcut: val });
    },
    [updateTranbox]
  );

  const handleClearCache = () => {
    try {
      caches.delete(CACHE_NAME);
      alert.success(i18n("clear_success"));
    } catch (err) {
      kissLog("clear cache", err);
    }
  };

  const {
    uiLang,
    minLength,
    maxLength,
    clearCache,
    newlineLength = TRANS_NEWLINE_LENGTH,
    httpTimeout = DEFAULT_HTTP_TIMEOUT,
    contextMenuType = 1,
    touchModes = [2],
    blacklist = DEFAULT_BLACKLIST.join(",\n"),
    csplist = DEFAULT_CSPLIST.join(",\n"),
    orilist = DEFAULT_ORILIST.join(",\n"),
    transInterval = 100,
    langDetector = "-",
    logLevel = 1,
    preInit = true,
    skipLangs = [],
    transAllnow = false,
    rootMargin = 500,
  } = setting;

  const {
    transOpen,
    apiSlug,
    fromLang,
    toLang,
    triggerShortcut,
    triggerCount,
    triggerTime,
    transSign,
  } = inputRule;

  const {
    transOpen: tranboxTransOpen,
    apiSlugs,
    fromLang: tranboxFromLang,
    toLang: tranboxToLang,
    toLang2 = "en",
    tranboxShortcut,
    btnOffsetX,
    btnOffsetY,
    boxOffsetX = 0,
    boxOffsetY = 10,
    hideTranBtn = false,
    hideClickAway = false,
    simpleStyle = false,
    followSelection = false,
    autoHeight = false,
    triggerMode = OPT_TRANBOX_TRIGGER_CLICK,
  } = tranboxSetting;

  return (
    <Box>
      <Stack spacing={3}>
        <Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="uiLang"
                value={uiLang}
                label="ui_lang"
                tooltip="ui_lang_help"
                onChange={handleChange}
              >
                {UI_LANGS.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="preInit"
                value={preInit}
                label="if_pre_init"
                tooltip="if_pre_init_help"
                onChange={handleChange}
              >
                <MenuItem value={true}>{i18n("enable")}</MenuItem>
                <MenuItem value={false}>{i18n("disable")}</MenuItem>
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("min_translate_length")}
                tooltip="min_translate_length_help"
                type="number"
                name="minLength"
                value={minLength}
                onChange={handleChange}
                min={1}
                max={100}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("max_translate_length")}
                tooltip="max_translate_length_help"
                type="number"
                name="maxLength"
                value={maxLength}
                onChange={handleChange}
                min={100}
                max={100000}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("num_of_newline_characters")}
                tooltip="num_of_newline_characters_help"
                type="number"
                name="newlineLength"
                value={newlineLength}
                onChange={handleChange}
                min={1}
                max={1000}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("translate_interval")}
                tooltip="translate_interval_help"
                type="number"
                name="transInterval"
                value={transInterval}
                onChange={handleChange}
                min={1}
                max={2000}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("http_timeout")}
                tooltip="http_timeout_help"
                type="number"
                name="httpTimeout"
                value={httpTimeout}
                onChange={handleChange}
                min={1000}
                max={600000}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="touchModes"
                value={touchModes}
                label="touch_translate_shortcut"
                tooltip="touch_translate_shortcut_help"
                onChange={handleChange}
                SelectProps={{
                  multiple: true,
                }}
              >
                {[0, 2, 3, 4, 5, 6, 7].map((item) => (
                  <MenuItem key={item} value={item}>
                    {i18n(`touch_tap_${item}`)}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="contextMenuType"
                value={contextMenuType}
                label="context_menus"
                tooltip="context_menus_help"
                onChange={handleChange}
              >
                <MenuItem value={0}>{i18n("hide_context_menus")}</MenuItem>
                <MenuItem value={1}>{i18n("simple_context_menus")}</MenuItem>
                <MenuItem value={2}>{i18n("secondary_context_menus")}</MenuItem>
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="langDetector"
                value={langDetector}
                label="detected_lang"
                tooltip="detected_lang_help"
                onChange={handleChange}
              >
                <MenuItem value={"-"}>{i18n("disable")}</MenuItem>
                {OPT_LANGDETECTOR_ALL.map((item) => (
                  <MenuItem value={item} key={item}>
                    {item}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                size="small"
                fullWidth
                name="transAllnow"
                value={transAllnow}
                label="trigger_mode"
                tooltip="trigger_mode_help"
                onChange={handleChange}
              >
                <MenuItem value={false}>{i18n("mk_pagescroll")}</MenuItem>
                <MenuItem value={true}>{i18n("mk_pageopen")}</MenuItem>
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("pagescroll_root_margin")}
                tooltip="pagescroll_root_margin_help"
                type="number"
                name="rootMargin"
                value={rootMargin}
                onChange={handleChange}
                min={0}
                max={10000}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="logLevel"
                value={logLevel}
                label="log_level"
                tooltip="log_level_help"
                onChange={handleChange}
              >
                {Object.values(LogLevel).map(({ value, name }) => (
                  <MenuItem value={value} key={value}>
                    {name}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
          </Grid>
        </Box>

        <TextField
          select
          size="small"
          label={i18n("skip_langs")}
          helperText={i18n("skip_langs_helper")}
          name="skipLangs"
          value={skipLangs}
          onChange={handleChange}
          SelectProps={{
            multiple: true,
          }}
        >
          {OPT_LANGS_TO.map(([langKey, langName]) => (
            <MenuItem key={langKey} value={langKey}>
              {langName}
            </MenuItem>
          ))}
        </TextField>
        <TextField
          size="small"
          label={i18n("translate_blacklist")}
          helperText={i18n("translate_blacklist_help")}
          name="blacklist"
          value={blacklist}
          onChange={handleChange}
          maxRows={10}
          multiline
        />

        {isExt ? (
          <>
            <TextField
              select
              fullWidth
              size="small"
              name="clearCache"
              value={clearCache}
              label={i18n("if_clear_cache")}
              onChange={handleChange}
              helperText={
                <Link component="button" onClick={handleClearCache}>
                  {i18n("clear_all_cache_now")}
                </Link>
              }
            >
              <MenuItem value={false}>{i18n("clear_cache_never")}</MenuItem>
              <MenuItem value={true}>{i18n("clear_cache_restart")}</MenuItem>
            </TextField>

            <TextField
              size="small"
              label={i18n("disabled_orilist")}
              helperText={i18n("pattern_helper")}
              name="orilist"
              value={orilist}
              onChange={handleChange}
              multiline
            />
            <TextField
              size="small"
              label={i18n("disabled_csplist")}
              helperText={
                i18n("pattern_helper") + " " + i18n("disabled_csplist_helper")
              }
              name="csplist"
              value={csplist}
              onChange={handleChange}
              multiline
            />
          </>
        ) : (
          <>
            <Box>
              <Grid container spacing={2} columns={12}>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <ShortcutItem
                    action={OPT_SHORTCUT_TRANSLATE}
                    label={i18n("toggle_translate_shortcut")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <ShortcutItem
                    action={OPT_SHORTCUT_STYLE}
                    label={i18n("toggle_style_shortcut")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <ShortcutItem
                    action={OPT_SHORTCUT_POPUP}
                    label={i18n("toggle_popup_shortcut")}
                  />
                </Grid>
                <Grid item xs={12} sm={12} md={6} lg={3}>
                  <ShortcutItem
                    action={OPT_SHORTCUT_SETTING}
                    label={i18n("open_setting_shortcut")}
                  />
                </Grid>
              </Grid>
            </Box>
          </>
        )}

        <Divider />

        <TooltipSwitch
          checked={transOpen}
          onChange={() => {
            updateInputRule({ transOpen: !transOpen });
          }}
          label={i18n("use_input_box_translation")}
          tooltip="use_input_box_translation_help"
        />

        <Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="apiSlug"
                value={apiSlug}
                label="translate_service"
                tooltip="translate_service_help"
                onChange={handleInputChange}
              >
                {enabledApis.map((api) => (
                  <MenuItem key={api.apiSlug} value={api.apiSlug}>
                    {api.apiName}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="fromLang"
                value={fromLang}
                label="from_lang"
                tooltip="from_lang_help"
                onChange={handleInputChange}
              >
                {OPT_LANGS_FROM.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="toLang"
                value={toLang}
                label="to_lang"
                tooltip="to_lang_help"
                onChange={handleInputChange}
              >
                {OPT_LANGS_TO.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="transSign"
                value={transSign}
                label="input_trans_start_sign"
                tooltip="input_trans_start_sign_help"
                onChange={handleInputChange}
              >
                <MenuItem value={""}>{i18n("style_none")}</MenuItem>
                {OPT_INPUT_TRANS_SIGNS.map((item) => (
                  <MenuItem key={item} value={item}>
                    {item}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
          </Grid>
        </Box>

        <Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ShortcutInput
                value={triggerShortcut}
                onChange={handleInputShortcut}
                label={i18n("trigger_trans_shortcut")}
                helperText={i18n("trigger_trans_shortcut_help")}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="triggerCount"
                value={triggerCount}
                label="shortcut_press_count"
                tooltip="shortcut_press_count_help"
                onChange={handleInputChange}
              >
                {[1, 2, 3, 4, 5].map((val) => (
                  <MenuItem key={val} value={val}>
                    {val}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("combo_timeout")}
                tooltip="combo_timeout_help"
                type="number"
                name="triggerTime"
                value={triggerTime}
                onChange={handleInputChange}
                min={10}
                max={1000}
              />
            </Grid>
          </Grid>
        </Box>

        <Divider />

        <TooltipSwitch
          checked={tranboxTransOpen}
          onChange={() => {
            updateTranbox({ transOpen: !tranboxTransOpen });
          }}
          label={i18n("toggle_selection_translate")}
          tooltip="toggle_selection_translate_help"
        />

        <Box>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                select
                fullWidth
                size="small"
                name="apiSlugs"
                value={apiSlugs}
                label="translate_service_multiple"
                tooltip="translate_service_multiple_help"
                onChange={handleTranboxChange}
                SelectProps={{
                  multiple: true,
                }}
              >
                {enabledApis.map((api) => (
                  <MenuItem key={api.apiSlug} value={api.apiSlug}>
                    {api.apiName}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="fromLang"
                value={tranboxFromLang}
                label="from_lang"
                tooltip="from_lang_help"
                onChange={handleTranboxChange}
              >
                {OPT_LANGS_FROM.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="toLang"
                value={tranboxToLang}
                label="to_lang"
                tooltip="to_lang_help"
                onChange={handleTranboxChange}
              >
                {OPT_LANGS_TO.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TextField
                fullWidth
                select
                size="small"
                name="toLang2"
                value={toLang2}
                label={i18n("to_lang2")}
                helperText={i18n("to_lang2_helper")}
                onChange={handleTranboxChange}
              >
                <MenuItem value={"-"}>{i18n("disable")}</MenuItem>
                {OPT_LANGS_TO.map(([lang, name]) => (
                  <MenuItem key={lang} value={lang}>
                    {name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="triggerMode"
                value={triggerMode}
                label="trigger_mode"
                tooltip="trigger_mode_help"
                onChange={handleTranboxChange}
              >
                {OPT_TRANBOX_TRIGGER_ALL.map((item) => (
                  <MenuItem key={item} value={item}>
                    {i18n(`trigger_${item}`)}
                  </MenuItem>
                ))}
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="hideTranBtn"
                value={hideTranBtn}
                label="hide_tran_button"
                tooltip="hide_tran_button_help"
                onChange={handleTranboxChange}
              >
                <MenuItem value={false}>{i18n("show")}</MenuItem>
                <MenuItem value={true}>{i18n("hide")}</MenuItem>
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="hideClickAway"
                value={hideClickAway}
                label="hide_click_away"
                tooltip="hide_click_away_help"
                onChange={handleTranboxChange}
              >
                <MenuItem value={false}>{i18n("disable")}</MenuItem>
                <MenuItem value={true}>{i18n("enable")}</MenuItem>
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="simpleStyle"
                value={simpleStyle}
                label="use_simple_style"
                tooltip="use_simple_style_help"
                onChange={handleTranboxChange}
              >
                <MenuItem value={false}>{i18n("disable")}</MenuItem>
                <MenuItem value={true}>{i18n("enable")}</MenuItem>
              </TooltipField>
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="followSelection"
                value={followSelection}
                label="follow_selection"
                tooltip="follow_selection_help"
                onChange={handleTranboxChange}
              >
                <MenuItem value={false}>{i18n("disable")}</MenuItem>
                <MenuItem value={true}>{i18n("enable")}</MenuItem>
              </TooltipField>
            </Grid>

            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("tranbtn_offset_x")}
                tooltip="tranbtn_offset_x_help"
                type="number"
                name="btnOffsetX"
                value={btnOffsetX}
                onChange={handleTranboxChange}
                min={-200}
                max={200}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("tranbtn_offset_y")}
                tooltip="tranbtn_offset_y_help"
                type="number"
                name="btnOffsetY"
                value={btnOffsetY}
                onChange={handleTranboxChange}
                min={-200}
                max={200}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("tranbox_offset_x")}
                tooltip="tranbox_offset_x_help"
                type="number"
                name="boxOffsetX"
                value={boxOffsetX}
                onChange={handleTranboxChange}
                min={-200}
                max={200}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <ValidationInput
                fullWidth
                size="small"
                label={i18n("tranbox_offset_y")}
                tooltip="tranbox_offset_y_help"
                type="number"
                name="boxOffsetY"
                value={boxOffsetY}
                onChange={handleTranboxChange}
                min={-200}
                max={200}
              />
            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={3}>
              <TooltipField
                fullWidth
                select
                size="small"
                name="autoHeight"
                value={autoHeight}
                label="tranbox_auto_height"
                tooltip="tranbox_auto_height_help"
                onChange={handleTranboxChange}
              >
                <MenuItem value={false}>{i18n("disable")}</MenuItem>
                <MenuItem value={true}>{i18n("enable")}</MenuItem>
              </TooltipField>
            </Grid>
            {!isExt && (
              <Grid item xs={12} sm={12} md={6} lg={3}>
                <ShortcutInput
                  value={tranboxShortcut}
                  onChange={handleTranboxShortcut}
                  label={i18n("trigger_tranbox_shortcut")}
                />
              </Grid>
            )}
          </Grid>
        </Box>
      </Stack>
    </Box>
  );
}
