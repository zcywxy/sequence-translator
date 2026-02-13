import { useState, useEffect, useCallback } from "react";
import Box from "@mui/material/Box";
import { sendTabMsg } from "../../libs/msg";
import { browser } from "../../libs/browser";
import Divider from "@mui/material/Divider";
import Header from "./Header";
import { MSG_TRANS_GETRULE } from "../../config";
import { kissLog } from "../../libs/log";
import PopupCont from "./PopupCont";
import { useTheme, alpha } from "@mui/material/styles";

export default function Popup() {
  const [rule, setRule] = useState(null);
  const [setting, setSetting] = useState(null);
  const [isSeparate, setIsSeparate] = useState(false);
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";

  const handleOpenSetting = useCallback(() => {
    browser?.runtime.openOptionsPage();
  }, []);

  useEffect(() => {
    (async () => {
      try {
        const cleanHash = window.location.hash.slice(1);
        if (cleanHash === "tranbox") {
          setIsSeparate(true);
          return;
        }

        const res = await sendTabMsg(MSG_TRANS_GETRULE);
        if (!res.error) {
          setRule(res.rule);
          setSetting(res.setting);
        }
      } catch (err) {
        kissLog("query rule", err);
      }
    })();
  }, []);

  if (isSeparate) {
    return (
      <Box
        sx={{
          background: isDark
            ? "linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)"
            : theme.palette.background.default,
          minHeight: "100vh",
        }}
      >
        <PopupCont
          rule={rule}
          setting={setting}
          setRule={setRule}
          setSetting={setSetting}
          isSeparate={true}
        />
      </Box>
    );
  }

  return (
    <Box
      width={360}
      sx={{
        position: "relative",
        background: isDark
          ? "linear-gradient(180deg, #0a0a0f 0%, #12121a 100%)"
          : theme.palette.background.paper,
        borderRadius: "12px",
        overflow: "hidden",
        "&::before": {
          content: '""',
          position: "absolute",
          inset: 0,
          borderRadius: "12px",
          padding: "1px",
          background: isDark
            ? "linear-gradient(135deg, rgba(0, 212, 255, 0.3) 0%, rgba(32, 156, 238, 0.1) 50%, rgba(0, 212, 255, 0.2) 100%)"
            : "linear-gradient(135deg, rgba(32, 156, 238, 0.2) 0%, rgba(0, 212, 255, 0.1) 50%, rgba(32, 156, 238, 0.15) 100%)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "xor",
          maskComposite: "exclude",
          pointerEvents: "none",
        },
      }}
    >
      <Header handleOpenSetting={handleOpenSetting} />
      <Divider
        sx={{
          borderColor: isDark
            ? "rgba(255, 255, 255, 0.06)"
            : "rgba(0, 0, 0, 0.06)",
        }}
      />
      <Box
        sx={{
          overflowY: "auto",
          maxHeight: 500,
          background: isDark
            ? "linear-gradient(180deg, rgba(18, 18, 26, 0.98) 0%, rgba(10, 10, 15, 0.98) 100%)"
            : alpha(theme.palette.background.paper, 0.98),
        }}
      >
        {rule ? (
          <PopupCont
            rule={rule}
            setting={setting}
            setRule={setRule}
            setSetting={setSetting}
          />
        ) : null}
      </Box>
    </Box>
  );
}
