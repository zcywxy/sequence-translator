import { useState, useEffect, useMemo } from "react";
import Stack from "@mui/material/Stack";
import MenuItem from "@mui/material/MenuItem";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Snackbar from "@mui/material/Snackbar";
import MuiAlert from "@mui/material/Alert";
import { sendBgMsg, sendTabMsg, getCurTab } from "../../libs/msg";
import { isExt } from "../../libs/client";
import { useI18n } from "../../hooks/I18n";
import TextField from "@mui/material/TextField";
import {
  MSG_TRANS_TOGGLE,
  MSG_TRANS_PUTRULE,
  MSG_SAVE_RULE,
  MSG_COMMAND_SHORTCUTS,
  MSG_TRANSBOX_TOGGLE,
  MSG_TRANSINPUT_TOGGLE,
  OPT_LANGS_FROM,
  OPT_LANGS_TO,
  GLOBAL_KEY,
  GLOBLA_RULE,
} from "../../config";
import { saveRule } from "../../libs/rules";
import { tryClearCaches } from "../../libs/cache";
import { kissLog } from "../../libs/log";
import { getDomainOptions, truncateMiddle } from "../../libs/url";
import { useAllTextStyles } from "../../hooks/CustomStyles";
import TranForm from "../Selection/TranForm";
import Divider from "@mui/material/Divider";
import { useTheme, alpha } from "@mui/material/styles";

export default function PopupCont({
  rule,
  setting,
  setRule,
  setSetting,
  processActions,
  isContent = false,
  isSeparate = false,
}) {
  const i18n = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [commands, setCommands] = useState({});
  const [domainOptions, setDomainOptions] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState("");
  const [snackbar, setSnackbar] = useState({ open: false, message: "" });
  const { allTextStyles } = useAllTextStyles();
  const [text, setText] = useState("");

  const handleTransToggle = async (e) => {
    try {
      setRule({ ...rule, transOpen: e.target.checked ? "true" : "false" });

      if (!processActions) {
        await sendTabMsg(MSG_TRANS_TOGGLE);
      } else {
        processActions({ action: MSG_TRANS_TOGGLE });
      }
    } catch (err) {
      kissLog("toggle trans", err);
    }
  };

  const handleTransboxToggle = async (e) => {
    try {
      setSetting((pre) => ({
        ...pre,
        tranboxSetting: { ...pre.tranboxSetting, transOpen: e.target.checked },
      }));

      if (!processActions) {
        await sendTabMsg(MSG_TRANSBOX_TOGGLE);
      } else {
        processActions({ action: MSG_TRANSBOX_TOGGLE });
      }
    } catch (err) {
      kissLog("toggle transbox", err);
    }
  };

  const handleInputTransToggle = async (e) => {
    try {
      setSetting((pre) => ({
        ...pre,
        inputRule: {
          ...pre.inputRule,
          transOpen: e.target.checked,
        },
      }));

      if (!processActions) {
        await sendTabMsg(MSG_TRANSINPUT_TOGGLE);
      } else {
        processActions({ action: MSG_TRANSINPUT_TOGGLE });
      }
    } catch (err) {
      kissLog("toggle inputtrans", err);
    }
  };

  const handleChange = async (e) => {
    try {
      let { name, value, checked } = e.target;
      if (name === "isPlainText") {
        value = checked;
      }
      setRule((pre) => ({ ...pre, [name]: value }));

      if (!processActions) {
        await sendTabMsg(MSG_TRANS_PUTRULE, { [name]: value });
      } else {
        processActions({ action: MSG_TRANS_PUTRULE, args: { [name]: value } });
      }
    } catch (err) {
      kissLog("update rule", err);
    }
  };

  const handleClearCache = () => {
    tryClearCaches();
  };

  const handleSaveRule = async () => {
    try {
      if (!selectedDomain) {
        return;
      }

      const curRule = { ...rule, pattern: selectedDomain };
      if (isExt && isContent) {
        sendBgMsg(MSG_SAVE_RULE, curRule);
      } else {
        saveRule(curRule);
      }
      setSnackbar({
        open: true,
        message: `${i18n("save_rule")}: ${selectedDomain}`,
      });
    } catch (err) {
      kissLog("save rule", err);
    }
  };

  useEffect(() => {
    (async () => {
      try {
        let href = "";
        if (!isContent) {
          const tab = await getCurTab();
          href = tab.url;
        } else {
          href = window.location?.href;
        }

        if (href && typeof href === "string") {
          const options = getDomainOptions(href);
          setDomainOptions(options);
          if (options.length > 0) {
            setSelectedDomain(options[0]);
          }
        }
      } catch (err) {
        kissLog("get domain options", err);
      }
    })();
  }, [isContent]);

  useEffect(() => {
    (async () => {
      try {
        const commands = {};
        if (isExt) {
          const res = await sendBgMsg(MSG_COMMAND_SHORTCUTS);
          res.forEach(({ name, shortcut }) => {
            commands[name] = shortcut;
          });
        } else {
          const shortcuts = setting.shortcuts;
          if (shortcuts) {
            Object.entries(shortcuts).forEach(([key, val]) => {
              commands[key] = val.join("+");
            });
          }
        }
        setCommands(commands);
      } catch (err) {
        kissLog("query cmds", err);
      }
    })();
  }, [setting.shortcuts]);

  const optApis = useMemo(
    () =>
      setting.transApis
        .filter((api) => !api.isDisabled)
        .map((api) => ({
          key: api.apiSlug,
          name: api.apiName || api.apiSlug,
        })),
    [setting.transApis]
  );

  const tranboxEnabled = setting.tranboxSetting.transOpen;
  const inputTransEnabled = setting.inputRule.transOpen;

  const {
    transOpen,
    apiSlug,
    fromLang,
    toLang,
    textStyle,
    autoScan,
    transOnly,
    hasRichText,
    hasShadowroot,
    isPlainText = false,
  } = rule || {};

  const displayTextStyle = textStyle === GLOBAL_KEY ? GLOBLA_RULE.textStyle : textStyle;

  const tranboxSetting = setting?.tranboxSetting || {};
  const transApis = setting?.transApis || [];
  const langDetector = setting?.langDetector || "-";

  const textFieldSx = useMemo(
    () => ({
      "& .MuiOutlinedInput-root": {
        transition: "all 0.25s ease",
        borderRadius: "10px",
        background: isDark
          ? "linear-gradient(135deg, rgba(0, 212, 255, 0.02) 0%, rgba(32, 156, 238, 0.01) 100%)"
          : "linear-gradient(135deg, rgba(32, 156, 238, 0.01) 0%, rgba(0, 212, 255, 0.005) 100%)",
        "&:hover": {
          boxShadow: isDark
            ? "0 0 0 1px rgba(0, 212, 255, 0.15)"
            : "0 0 0 1px rgba(32, 156, 238, 0.1)",
        },
        "&.Mui-focused": {
          boxShadow: isDark
            ? "0 0 0 2px rgba(0, 212, 255, 0.2), 0 2px 12px rgba(0, 212, 255, 0.1)"
            : "0 0 0 2px rgba(32, 156, 238, 0.15), 0 2px 12px rgba(32, 156, 238, 0.08)",
        },
      },
      "& .MuiInputLabel-root": {
        fontWeight: 500,
        fontSize: "0.8rem",
        "&.Mui-focused": {
          color: theme.palette.primary.main,
        },
      },
      "& .MuiSelect-select": {
        fontSize: "0.875rem",
      },
      "& .MuiMenuItem-root": {
        fontSize: "0.875rem",
      },
    }),
    [isDark, theme.palette.primary.main]
  );

  if (!rule || !setting) {
    return null;
  }

  return (
    <Stack sx={{ p: 2 }} spacing={2}>
      <TranForm
        text={text}
        setText={setText}
        apiSlugs={tranboxSetting.apiSlugs || []}
        fromLang={tranboxSetting.fromLang || "auto"}
        toLang={tranboxSetting.toLang || "zh-CN"}
        toLang2={tranboxSetting.toLang2 || "-"}
        transApis={transApis}
        simpleStyle={false}
        langDetector={langDetector}
        enDict={tranboxSetting.enDict}
        enSug={tranboxSetting.enSug}
      />

      {!isSeparate && (
        <>
          <Divider
            sx={{
              my: 1,
              borderColor: isDark
                ? "rgba(255, 255, 255, 0.08)"
                : "rgba(0, 0, 0, 0.08)",
            }}
          />

          <Grid container columns={12} spacing={1}>
            <Grid item xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={transOpen === "true"}
                    onChange={handleTransToggle}
                  />
                }
                label={
                  commands["toggleTranslate"]
                    ? `${i18n("translate_alt")}(${commands["toggleTranslate"]})`
                    : i18n("translate_alt")
                }
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="autoScan"
                    value={autoScan === "true" ? "false" : "true"}
                    checked={autoScan === "true"}
                    onChange={handleChange}
                  />
                }
                label={i18n("autoscan_alt")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="hasShadowroot"
                    value={hasShadowroot === "true" ? "false" : "true"}
                    checked={hasShadowroot === "true"}
                    onChange={handleChange}
                  />
                }
                label={i18n("shadowroot_alt")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="hasRichText"
                    value={hasRichText === "true" ? "false" : "true"}
                    checked={hasRichText === "true"}
                    onChange={handleChange}
                  />
                }
                label={i18n("richtext_alt")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="transOnly"
                    value={transOnly === "true" ? "false" : "true"}
                    checked={transOnly === "true"}
                    onChange={handleChange}
                  />
                }
                label={i18n("transonly_alt")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="tranboxEnabled"
                    value={!tranboxEnabled}
                    checked={tranboxEnabled}
                    onChange={handleTransboxToggle}
                  />
                }
                label={i18n("selection_translate")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="inputTransEnabled"
                    value={!inputTransEnabled}
                    checked={inputTransEnabled}
                    onChange={handleInputTransToggle}
                  />
                }
                label={i18n("input_translate")}
              />
            </Grid>
            <Grid item xs={6}>
              <FormControlLabel
                control={
                  <Switch
                    size="small"
                    name="isPlainText"
                    value={!isPlainText}
                    checked={isPlainText}
                    onChange={handleChange}
                  />
                }
                label={i18n("plain_text_translate")}
              />
            </Grid>
          </Grid>

          <Stack direction="row" spacing={2}>
            <TextField
              select
              SelectProps={{ MenuProps: { disablePortal: true } }}
              size="small"
              value={fromLang}
              name="fromLang"
              label={i18n("from_lang")}
              onChange={handleChange}
              fullWidth
              sx={textFieldSx}
            >
              {OPT_LANGS_FROM.map(([lang, name]) => (
                <MenuItem key={lang} value={lang}>
                  {name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              SelectProps={{ MenuProps: { disablePortal: true } }}
              size="small"
              value={toLang}
              name="toLang"
              label={i18n("to_lang")}
              onChange={handleChange}
              fullWidth
              sx={textFieldSx}
            >
              {OPT_LANGS_TO.map(([lang, name]) => (
                <MenuItem key={lang} value={lang}>
                  {name}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack direction="row" spacing={2}>
            <TextField
              select
              SelectProps={{ MenuProps: { disablePortal: true } }}
              size="small"
              value={apiSlug}
              name="apiSlug"
              label={i18n("translate_service")}
              onChange={handleChange}
              fullWidth
              sx={textFieldSx}
            >
              {optApis.map(({ key, name }) => (
                <MenuItem key={key} value={key}>
                  {name}
                </MenuItem>
              ))}
            </TextField>

            <TextField
              select
              SelectProps={{ MenuProps: { disablePortal: true } }}
              size="small"
              value={displayTextStyle}
              name="textStyle"
              label={
                commands["toggleStyle"]
                  ? `${i18n("text_style_alt")}(${commands["toggleStyle"]})`
                  : i18n("text_style_alt")
              }
              onChange={handleChange}
              fullWidth
              sx={textFieldSx}
            >
              {allTextStyles.map((item) => (
                <MenuItem key={item.styleSlug} value={item.styleSlug}>
                  {item.styleName}
                </MenuItem>
              ))}
            </TextField>
          </Stack>

          <Stack>
            <TextField
              select
              SelectProps={{ MenuProps: { disablePortal: true } }}
              size="small"
              value={selectedDomain}
              label={i18n("domain")}
              onChange={(e) => setSelectedDomain(e.target.value)}
              fullWidth
              sx={{ mb: 1, ...textFieldSx }}
            >
              {domainOptions.map((domain) => (
                <MenuItem key={domain} value={domain} title={domain}>
                  {truncateMiddle(domain)}
                </MenuItem>
              ))}
            </TextField>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Button
                variant="text"
                onClick={handleSaveRule}
                disabled={domainOptions.length === 0}
              >
                {i18n("save_rule")}
              </Button>
              <Button variant="text" onClick={handleClearCache}>
                {i18n("clear_cache")}
              </Button>
            </Stack>
          </Stack>
        </>
      )}

      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={() => setSnackbar({ open: false, message: "" })}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <MuiAlert
          onClose={() => setSnackbar({ open: false, message: "" })}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Stack>
  );
}
