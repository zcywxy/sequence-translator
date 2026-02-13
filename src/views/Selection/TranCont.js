import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import { useI18n } from "../../hooks/I18n";
import { useEffect, useState, useMemo } from "react";
import { apiTranslate } from "../../apis";
import CopyBtn from "./CopyBtn";
import Typography from "@mui/material/Typography";
import Alert from "@mui/material/Alert";
import { useTheme, alpha } from "@mui/material/styles";

export default function TranCont({
  text,
  fromLang,
  toLang,
  apiSlug,
  transApis,
  simpleStyle = false,
}) {
  const i18n = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [trText, setTrText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const apiSetting = useMemo(
    () => transApis.find((api) => api.apiSlug === apiSlug),
    [transApis, apiSlug]
  );

  useEffect(() => {
    if (!text?.trim() || !apiSetting) {
      return;
    }

    (async () => {
      try {
        setLoading(true);
        setTrText("");
        setError("");

        const { trText } = await apiTranslate({
          text,
          fromLang,
          toLang,
          apiSetting,
        });

        setTrText(trText);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    })();
  }, [text, fromLang, toLang, apiSetting]);

  if (simpleStyle) {
    return (
      <Box>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : loading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 1 }}>
            <CircularProgress
              size={18}
              sx={{ color: theme.palette.primary.main }}
            />
          </Box>
        ) : (
          <Typography
            sx={{
              whiteSpace: "pre-line",
              lineHeight: 1.6,
            }}
          >
            {trText}
          </Typography>
        )}
      </Box>
    );
  }

  if (!apiSetting) {
    return null;
  }

  return (
    <Box>
      <style>
        {`
          @keyframes kt-result-fade-in {
            from {
              opacity: 0;
              transform: translateY(4px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }
          .KT-trancont-result {
            animation: kt-result-fade-in 0.3s ease-out;
          }
        `}
      </style>
      <TextField
        size="small"
        label={`${i18n("translated_text")} - ${apiSetting.apiName || apiSetting.apiSlug}`}
        fullWidth
        multiline
        value={trText}
        helperText={error}
        InputProps={{
          startAdornment: loading ? (
            <CircularProgress
              size={16}
              sx={{ color: theme.palette.primary.main }}
            />
          ) : null,
          endAdornment: (
            <Stack
              direction="row"
              sx={{
                position: "absolute",
                right: 0,
                top: 0,
              }}
            >
              <CopyBtn text={trText} title={i18n("copy")} />
            </Stack>
          ),
        }}
        sx={{
          "& .MuiOutlinedInput-root": {
            transition: "all 0.25s ease",
            background: isDark
              ? "linear-gradient(135deg, rgba(0, 212, 255, 0.03) 0%, rgba(32, 156, 238, 0.02) 100%)"
              : "linear-gradient(135deg, rgba(32, 156, 238, 0.02) 0%, rgba(0, 212, 255, 0.01) 100%)",
            borderRadius: "10px",
            "&:hover": {
              boxShadow: isDark
                ? "0 0 0 1px rgba(0, 212, 255, 0.2), 0 2px 8px rgba(0, 212, 255, 0.1)"
                : "0 0 0 1px rgba(32, 156, 238, 0.15), 0 2px 8px rgba(32, 156, 238, 0.08)",
            },
            "&.Mui-focused": {
              boxShadow: isDark
                ? "0 0 0 2px rgba(0, 212, 255, 0.25), 0 4px 16px rgba(0, 212, 255, 0.15)"
                : "0 0 0 2px rgba(32, 156, 238, 0.2), 0 4px 16px rgba(32, 156, 238, 0.1)",
            },
          },
          "& .MuiInputLabel-root": {
            fontWeight: 500,
            "&.Mui-focused": {
              color: theme.palette.primary.main,
            },
          },
          "& .MuiInputBase-input": {
            lineHeight: 1.6,
          },
        }}
        InputLabelProps={{
          shrink: true,
        }}
      />
    </Box>
  );
}
