import { SettingProvider } from "../../hooks/Setting";
import ThemeProvider from "../../hooks/Theme";
import DraggableResizable from "./DraggableResizable";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import UnfoldLessIcon from "@mui/icons-material/UnfoldLess";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import PushPinIcon from "@mui/icons-material/PushPin";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import LockIcon from "@mui/icons-material/Lock";
import LockOpenIcon from "@mui/icons-material/LockOpen";
import CloseIcon from "@mui/icons-material/Close";
import Typography from "@mui/material/Typography";
import { useI18n } from "../../hooks/I18n";
import { useCallback, useEffect, useState } from "react";
import { isMobile } from "../../libs/mobile";
import TranForm from "./TranForm.js";
import { MSG_OPEN_SEPARATE_WINDOW } from "../../config/msg.js";
import { sendBgMsg } from "../../libs/msg.js";
import { isExt } from "../../libs/client.js";
import { useTheme, alpha } from "@mui/material/styles";

function Header({
  setShowBox,
  simpleStyle,
  setSimpleStyle,
  hideClickAway,
  setHideClickAway,
  followSelection,
  setFollowSelection,
  mouseHover,
}) {
  const theme = useTheme();
  const i18n = useI18n();
  const isDark = theme.palette.mode === "dark";

  const iconColor = theme.palette.text.secondary;
  const buttonHoverBg = theme.palette.action.hover;

  const openSeparateWindow = useCallback(() => {
    sendBgMsg(MSG_OPEN_SEPARATE_WINDOW);
  }, []);

  const blurOnLeave = (e) => e.currentTarget.blur();

  const baseBtnStyle = {
    borderRadius: "8px",
    padding: "6px",
    minWidth: "32px",
    minHeight: "32px",
    transition: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    backgroundColor: "transparent",
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
      color: iconColor,
      transition: "all 0.25s ease",
    },
  };

  if (isMobile) {
    return null;
  }

  return (
    <Box
      onMouseUp={(e) => e.stopPropagation()}
      onTouchEnd={(e) => e.stopPropagation()}
      sx={{
        background: isDark
          ? "linear-gradient(180deg, rgba(22, 33, 62, 0.95) 0%, rgba(26, 26, 46, 0.9) 100%)"
          : `linear-gradient(180deg, ${theme.palette.background.paper} 0%, ${alpha(theme.palette.background.paper, 0.95)} 100%)`,
        padding: "6px 10px 6px 14px",
        height: "40px",
        display: "flex",
        alignItems: "center",
        minHeight: "auto",
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
        spacing={1}
        sx={{
          width: "100%",
          height: "100%",
        }}
      >
        {!simpleStyle && (
          <Typography
            variant="caption"
            sx={{
              fontWeight: 600,
              fontSize: "12px",
              letterSpacing: "0.3px",
              background: isDark
                ? "linear-gradient(135deg, rgba(0, 212, 255, 0.8) 0%, rgba(32, 156, 238, 0.6) 100%)"
                : "linear-gradient(135deg, #209CEE 0%, #00d4ff 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            {`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}
          </Typography>
        )}

        <Stack direction="row" alignItems="center" spacing={0.5}>
          {isExt && (
            <IconButton
              size="small"
              title={i18n("open_separate_window")}
              onClick={openSeparateWindow}
              onMouseLeave={blurOnLeave}
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
              <OpenInNewIcon sx={{ width: 16, height: 16 }} />
            </IconButton>
          )}

          <IconButton
            size="small"
            title={i18n("btn_tip_click_away")}
            onMouseLeave={blurOnLeave}
            onClick={() => setHideClickAway((pre) => !pre)}
            sx={{
              ...baseBtnStyle,
              "&:hover": {
                "&::before": { opacity: 1 },
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(16, 185, 129, 0.2)"
                  : "0 4px 12px rgba(16, 185, 129, 0.15)",
                "& svg": {
                  color: theme.palette.success.main,
                  transform: "scale(1.1)",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.95)",
              },
            }}
          >
            {hideClickAway ? (
              <LockOpenIcon
                sx={{
                  width: 16,
                  height: 16,
                  color: theme.palette.success.main,
                }}
              />
            ) : (
              <LockIcon sx={{ width: 16, height: 16 }} />
            )}
          </IconButton>

          <IconButton
            size="small"
            title={i18n("btn_tip_follow_selection")}
            onMouseLeave={blurOnLeave}
            onClick={() => setFollowSelection((pre) => !pre)}
            sx={{
              ...baseBtnStyle,
              "&:hover": {
                "&::before": { opacity: 1 },
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(245, 158, 11, 0.2)"
                  : "0 4px 12px rgba(245, 158, 11, 0.15)",
                "& svg": {
                  color: theme.palette.warning.main,
                  transform: "scale(1.1)",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.95)",
              },
            }}
          >
            {followSelection ? (
              <PushPinOutlinedIcon
                sx={{
                  width: 16,
                  height: 16,
                  color: theme.palette.warning.main,
                }}
              />
            ) : (
              <PushPinIcon sx={{ width: 16, height: 16 }} />
            )}
          </IconButton>

          <IconButton
            size="small"
            title={i18n("btn_tip_simple_style")}
            onMouseLeave={blurOnLeave}
            onClick={() => setSimpleStyle((pre) => !pre)}
            sx={{
              ...baseBtnStyle,
              "&:hover": {
                "&::before": { opacity: 1 },
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(0, 212, 255, 0.2)"
                  : "0 4px 12px rgba(32, 156, 238, 0.15)",
                "& svg": {
                  color: theme.palette.info.main,
                  transform: "scale(1.1)",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.95)",
              },
            }}
          >
            {simpleStyle ? (
              <UnfoldMoreIcon
                sx={{ width: 16, height: 16, color: theme.palette.info.main }}
              />
            ) : (
              <UnfoldLessIcon sx={{ width: 16, height: 16 }} />
            )}
          </IconButton>

          <IconButton
            size="small"
            title={i18n("close")}
            onMouseLeave={blurOnLeave}
            onClick={() => setShowBox(false)}
            sx={{
              ...baseBtnStyle,
              "&:hover": {
                "&::before": { opacity: 1 },
                transform: "translateY(-1px)",
                boxShadow: isDark
                  ? "0 4px 12px rgba(239, 68, 68, 0.2)"
                  : "0 4px 12px rgba(239, 68, 68, 0.15)",
                "& svg": {
                  color: theme.palette.error.main,
                  transform: "scale(1.1)",
                },
              },
              "&:active": {
                transform: "translateY(0) scale(0.95)",
              },
            }}
          >
            <CloseIcon sx={{ width: 16, height: 16 }} />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}

function TranBoxContent({
  simpleStyle,
  text,
  setText,
  apiSlugs,
  fromLang,
  toLang,
  toLang2,
  transApis,
  langDetector,
  enDict,
  enSug,
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const scrollbarTrackColor =
    theme.palette.mode === "dark" ? "#1f1f23" : theme.palette.background.paper;
  const scrollbarThumbColor =
    theme.palette.mode === "dark"
      ? alpha(theme.palette.text.primary, 0.28)
      : alpha(theme.palette.text.primary, 0.24);

  return (
    <Box
      sx={{
        p: simpleStyle ? 1 : 2,
        backgroundColor: theme.palette.background.paper,

        "&::-webkit-scrollbar": {
          width: 10,
          height: 10,
        },
        "&::-webkit-scrollbar-track": {
          background: scrollbarTrackColor,
        },
        "&::-webkit-scrollbar-thumb": {
          backgroundColor: scrollbarThumbColor,
          borderRadius: 8,
          border: `2px solid ${theme.palette.background.paper}`,
        },
        "&::-webkit-scrollbar-thumb:hover": {
          backgroundColor: alpha(theme.palette.text.primary, 0.36),
        },
        // Firefox
        scrollbarWidth: "thin",
        scrollbarColor: `${scrollbarThumbColor} ${scrollbarTrackColor}`,

        color: isDark
          ? "rgba(255,255,255,0.82)" // 柔白, 避免刺眼
          : theme.palette.text.primary,

        lineHeight: 1.55,
      }}
    >
      <TranForm
        text={text}
        setText={setText}
        apiSlugs={apiSlugs}
        fromLang={fromLang}
        toLang={toLang}
        toLang2={toLang2}
        transApis={transApis}
        simpleStyle={simpleStyle}
        langDetector={langDetector}
        enDict={enDict}
        enSug={enSug}
      />
    </Box>
  );
}

export default function TranBox(props) {
  const [mouseHover, setMouseHover] = useState(false);

  const simpleStyle = props.simpleStyle;
  const setSimpleStyle = props.setSimpleStyle;
  const hideClickAway = props.hideClickAway;
  const setHideClickAway = props.setHideClickAway;
  const followSelection = props.followSelection;
  const setFollowSelection = props.setFollowSelection;
  return (
    <SettingProvider context="tranbox">
      <ThemeProvider styles={props.extStyles}>
        {props.showBox && (
          <DraggableResizable
            position={props.boxPosition}
            size={props.boxSize}
            setSize={props.setBoxSize}
            setPosition={props.setBoxPosition}
            autoHeight={props.tranboxSetting.autoHeight}
            header={
              <Header
                setShowBox={props.setShowBox}
                simpleStyle={simpleStyle}
                setSimpleStyle={setSimpleStyle}
                hideClickAway={hideClickAway}
                setHideClickAway={setHideClickAway}
                followSelection={followSelection}
                setFollowSelection={setFollowSelection}
                mouseHover={mouseHover}
              />
            }
            onClick={(e) => e.stopPropagation()}
            onMouseEnter={() => setMouseHover(true)}
            onMouseLeave={() => setMouseHover(false)}
          >
            <TranBoxContent
              simpleStyle={simpleStyle}
              text={props.text}
              setText={props.setText}
              apiSlugs={props.tranboxSetting.apiSlugs}
              fromLang={props.tranboxSetting.fromLang}
              toLang={props.tranboxSetting.toLang}
              toLang2={props.tranboxSetting.toLang2}
              transApis={props.transApis}
              langDetector={props.langDetector}
              enDict={props.tranboxSetting.enDict}
              enSug={props.tranboxSetting.enSug}
            />
          </DraggableResizable>
        )}
      </ThemeProvider>
    </SettingProvider>
  );
}
