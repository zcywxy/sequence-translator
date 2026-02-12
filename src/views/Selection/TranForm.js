import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import DoneIcon from "@mui/icons-material/Done";
import CircularProgress from "@mui/material/CircularProgress";
import ContentPasteIcon from "@mui/icons-material/ContentPaste";
import { useI18n } from "../../hooks/I18n";
import {
  OPT_LANGS_FROM,
  OPT_LANGS_TO,
  OPT_LANGDETECTOR_ALL,
  OPT_LANGS_MAP,
} from "../../config";
import { useState, useMemo, useEffect, useRef } from "react";
import TranCont from "./TranCont";
import CopyBtn from "./CopyBtn";
import { isValidWord } from "../../libs/utils";
import { kissLog } from "../../libs/log";
import { tryDetectLang } from "../../libs/detect";
import { useTheme, alpha } from "@mui/material/styles";

export default function TranForm({
  text,
  setText,
  apiSlugs: initApiSlugs,
  fromLang: initFromLang,
  toLang: initToLang,
  toLang2: initToLang2,
  transApis,
  simpleStyle = false,
  langDetector: initLangDetector = "-",
  isPlaygound = false,
  enDict,
  enSug,
}) {
  const i18n = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(text);
  const [apiSlugs, setApiSlugs] = useState(initApiSlugs);
  const [fromLang, setFromLang] = useState(initFromLang);
  const [toLang, setToLang] = useState(initToLang);
  const [toLang2, setToLang2] = useState(initToLang2);
  const [langDetector, setLangDetector] = useState(initLangDetector);
  const [deLang, setDeLang] = useState("");
  const [deLoading, setDeLoading] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    const input = inputRef.current;
    if (!input) return;

    input.focus();

    const len = input.value.length;
    input.setSelectionRange(len, len);
  }, []);

  useEffect(() => {
    if (isValidWord(text)) {
      const event = new CustomEvent("kiss-add-word", {
        detail: { word: text },
      });
      document.dispatchEvent(event);
    }
  }, [text]);

  useEffect(() => {
    if (!editMode) {
      setEditText(text);
    }
  }, [text, editMode]);

  useEffect(() => {
    if (!text.trim()) {
      setDeLang("");
      return;
    }

    (async () => {
      try {
        setDeLoading(true);
        const deLang = await tryDetectLang(text, langDetector);
        if (deLang) {
          setDeLang(deLang);
        }
      } catch (err) {
        kissLog("tranbox: detect lang", err);
      } finally {
        setDeLoading(false);
      }
    })();
  }, [text, langDetector, setDeLang, setDeLoading]);

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      setText(text.trim());
    } catch (err) {
      //
    }
  };

  // todo: 语言变化后，realToLang引发二次翻译请求
  const realToLang = useMemo(() => {
    if (
      fromLang === "auto" &&
      toLang !== toLang2 &&
      toLang2 !== "-" &&
      deLang === toLang
    ) {
      return toLang2;
    }

    return toLang;
  }, [fromLang, toLang, toLang2, deLang]);

  const optApis = useMemo(
    () =>
      transApis
        .filter((api) => !api.isDisabled)
        .map((api) => ({
          key: api.apiSlug,
          name: api.apiName || api.apiSlug,
        })),
    [transApis]
  );

  const isWord = useMemo(() => isValidWord(text), [text]);
  const xs = useMemo(() => (isPlaygound ? 6 : 4), [isPlaygound]);
  const md = useMemo(() => (isPlaygound ? 3 : 4), [isPlaygound]);

  const textFieldSx = useMemo(() => ({
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
  }), [isDark, theme.palette.primary.main]);

  const originalTextFieldSx = useMemo(() => ({
    ...textFieldSx,
    "& .MuiOutlinedInput-root": {
      ...textFieldSx["& .MuiOutlinedInput-root"],
      background: isDark
        ? "linear-gradient(135deg, rgba(0, 212, 255, 0.04) 0%, rgba(32, 156, 238, 0.02) 100%)"
        : "linear-gradient(135deg, rgba(32, 156, 238, 0.03) 0%, rgba(0, 212, 255, 0.01) 100%)",
    },
    "& .MuiInputBase-input": {
      lineHeight: 1.6,
    },
  }), [textFieldSx, isDark]);

  return (
    <Stack spacing={simpleStyle ? 1 : 2}>
      {!simpleStyle && (
        <>
          <Box>
            <Grid container spacing={2} columns={12}>
              <Grid item xs={xs} md={md}>
                <TextField
                  select
                  SelectProps={{
                    multiple: true,
                    MenuProps: { disablePortal: !isPlaygound },
                  }}
                  fullWidth
                  size="small"
                  value={apiSlugs}
                  name="apiSlugs"
                  label={i18n("translate_service_multiple")}
                  onChange={(e) => {
                    setApiSlugs(e.target.value);
                  }}
                  sx={textFieldSx}
                >
                  {optApis.map(({ key, name }) => (
                    <MenuItem key={key} value={key}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={xs} md={md}>
                <TextField
                  select
                  SelectProps={{ MenuProps: { disablePortal: !isPlaygound } }}
                  fullWidth
                  size="small"
                  name="fromLang"
                  value={fromLang}
                  label={i18n("from_lang")}
                  onChange={(e) => {
                    setFromLang(e.target.value);
                  }}
                  sx={textFieldSx}
                >
                  {OPT_LANGS_FROM.map(([lang, name]) => (
                    <MenuItem key={lang} value={lang}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={xs} md={md}>
                <TextField
                  select
                  SelectProps={{ MenuProps: { disablePortal: !isPlaygound } }}
                  fullWidth
                  size="small"
                  name="toLang"
                  value={toLang}
                  label={i18n("to_lang")}
                  onChange={(e) => {
                    setToLang(e.target.value);
                  }}
                  sx={textFieldSx}
                >
                  {OPT_LANGS_TO.map(([lang, name]) => (
                    <MenuItem key={lang} value={lang}>
                      {name}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>

              {isPlaygound && (
                <>
                  <Grid item xs={xs} md={md}>
                    <TextField
                      select
                      SelectProps={{
                        MenuProps: { disablePortal: !isPlaygound },
                      }}
                      fullWidth
                      size="small"
                      name="toLang2"
                      value={toLang2}
                      label={i18n("to_lang2")}
                      onChange={(e) => {
                        setToLang2(e.target.value);
                      }}
                      sx={textFieldSx}
                    >
                      {OPT_LANGS_TO.map(([lang, name]) => (
                        <MenuItem key={lang} value={lang}>
                          {name}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={xs} md={md}>
                    <TextField
                      select
                      SelectProps={{
                        MenuProps: { disablePortal: !isPlaygound },
                      }}
                      fullWidth
                      size="small"
                      name="langDetector"
                      value={langDetector}
                      label={i18n("detected_lang")}
                      onChange={(e) => {
                        setLangDetector(e.target.value);
                      }}
                      sx={textFieldSx}
                    >
                      <MenuItem value={"-"}>{i18n("disable")}</MenuItem>
                      {OPT_LANGDETECTOR_ALL.map((item) => (
                        <MenuItem value={item} key={item}>
                          {item}
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item xs={xs} md={md}>
                    <TextField
                      fullWidth
                      size="small"
                      name="deLang"
                      value={deLang && OPT_LANGS_MAP.get(deLang)}
                      label={i18n("detected_result")}
                      disabled
                      InputProps={{
                        startAdornment: deLoading ? (
                          <CircularProgress size={16} sx={{ color: theme.palette.primary.main }} />
                        ) : null,
                      }}
                      sx={textFieldSx}
                    />
                  </Grid>
                </>
              )}
            </Grid>
          </Box>

          <Box>
            <TextField
              size="small"
              label={i18n("original_text")}
              fullWidth
              multiline
              inputRef={inputRef}
              minRows={isPlaygound ? 2 : 1}
              maxRows={10}
              value={editText}
              onChange={(e) => {
                setEditText(e.target.value);
              }}
              onFocus={() => {
                setEditMode(true);
              }}
              onBlur={() => {
                setEditMode(false);
                setText(editText.trim());
              }}
              InputProps={{
                endAdornment: (
                  <Stack
                    direction="row"
                    sx={{
                      position: "absolute",
                      right: 0,
                      top: 0,
                    }}
                  >
                    {editMode ? (
                      <IconButton
                        size="small"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditMode(false);
                          setText(editText.trim());
                        }}
                        title={i18n("submit")}
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: theme.palette.primary.main,
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <DoneIcon fontSize="inherit" />
                      </IconButton>
                    ) : text ? (
                      <CopyBtn text={text} title={i18n("copy")} />
                    ) : (
                      <IconButton
                        size="small"
                        onClick={handlePaste}
                        title={i18n("paste")}
                        sx={{
                          transition: "all 0.2s ease",
                          "&:hover": {
                            color: theme.palette.primary.main,
                            transform: "scale(1.1)",
                          },
                        }}
                      >
                        <ContentPasteIcon fontSize="inherit" />
                      </IconButton>
                    )}
                  </Stack>
                ),
              }}
              sx={originalTextFieldSx}
              InputLabelProps={{
                shrink: true,
              }}
            />
          </Box>
        </>
      )}

      {apiSlugs.map((slug) => (
        <TranCont
          key={slug}
          text={text}
          fromLang={fromLang}
          toLang={realToLang}
          simpleStyle={simpleStyle}
          apiSlug={slug}
          transApis={transApis}
        />
      ))}
    </Stack>
  );
}
