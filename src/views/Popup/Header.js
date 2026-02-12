import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import SettingsIcon from "@mui/icons-material/Settings";
import { useI18n } from "../../hooks/I18n";
import Box from "@mui/material/Box";
import { useTheme, alpha } from "@mui/material/styles";

export default function Header({
  openSeparateWindow,
  handleOpenSetting,
}) {
  const i18n = useI18n();
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const baseBtnStyle = {
    borderRadius: "8px",
    padding: "6px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    position: "relative",
    overflow: "hidden",
    "&::before": {
      content: '""',
      position: "absolute",
      inset: 0,
      borderRadius: "8px",
      background: isDark
        ? "linear-gradient(135deg, rgba(0, 212, 255, 0.1) 0%, transparent 100%)"
        : "linear-gradient(135deg, rgba(32, 156, 238, 0.08) 0%, transparent 100%)",
      opacity: 0,
      transition: "opacity 0.25s ease",
    },
    "& svg": {
      transition: "all 0.25s ease",
    },
  };

  return (
    <Box
      sx={{
        background: isDark
          ? "linear-gradient(180deg, rgba(22, 33, 62, 0.98) 0%, rgba(26, 26, 46, 0.95) 100%)"
          : `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.98)} 100%)`,
        padding: "8px 12px",
        position: "relative",
        "&::after": {
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "1px",
          background: isDark
            ? "linear-gradient(90deg, transparent, rgba(0, 212, 255, 0.3), transparent)"
            : "linear-gradient(90deg, transparent, rgba(32, 156, 238, 0.2), transparent)",
        },
      }}
    >
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        spacing={2}
      >
        <Typography
          component="div"
          sx={{
            userSelect: "none",
            WebkitUserSelect: "none",
            fontWeight: 600,
            fontSize: "13px",
            letterSpacing: "0.5px",
            background: isDark
              ? "linear-gradient(135deg, rgba(0, 212, 255, 0.9) 0%, rgba(32, 156, 238, 0.7) 100%)"
              : "linear-gradient(135deg, #209CEE 0%, #00d4ff 100%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            backgroundClip: "text",
          }}
        >
          {`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <IconButton
            onClick={openSeparateWindow}
            title={i18n("open_separate_window")}
            sx={{
              ...baseBtnStyle,
              "&:hover": {
                "&::before": { opacity: 1 },
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(0, 212, 255, 0.2)"
                  : "0 4px 12px rgba(32, 156, 238, 0.15)",
                "& svg": { 
                  color: theme.palette.primary.main,
                  transform: "scale(1.1)",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.95)",
              },
            }}
          >
            <OpenInNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleOpenSetting}
            title={i18n("setting")}
            sx={{
              ...baseBtnStyle,
              "&:hover": {
                "&::before": { opacity: 1 },
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(0, 212, 255, 0.2)"
                  : "0 4px 12px rgba(32, 156, 238, 0.15)",
                "& svg": { 
                  color: theme.palette.primary.main,
                  transform: "scale(1.1)",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.95)",
              },
            }}
          >
            <SettingsIcon fontSize="small" />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
