import { Routes, Route, HashRouter } from "react-router-dom";
import Rules from "./Rules";
import Setting from "./Setting";
import Layout from "./Layout";
import { SettingProvider } from "../../hooks/Setting";
import ThemeProvider from "../../hooks/Theme";
import { useEffect, useState } from "react";
import { isGm } from "../../libs/client";
import { sleep } from "../../libs/utils";
import { AlertProvider } from "../../hooks/Alert";
import { ConfirmProvider } from "../../hooks/Confirm";
import Link from "@mui/material/Link";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import { adaptScript } from "../../libs/gm";
import Alert from "@mui/material/Alert";
import Apis from "./Apis";
import InputSetting from "./InputSetting";
import Tranbox from "./Tranbox";
import FavWords from "./FavWords";
import Loading from "../../hooks/Loading";
import StylesSetting from "./StylesSetting";

export default function Options() {
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const isValidVersion = (v1Str, v2Str) => {
      if (!v1Str || !v2Str) {
        return false;
      }

      const v1 = v1Str.split(".");
      const v2 = v2Str.split(".");

      return v1[0] === v2[0] && v1[1] === v2[1];
    };

    (async () => {
      if (isGm) {
        // 等待GM注入
        let i = 0;
        for (;;) {
          if (window?.APP_INFO?.name === process.env.REACT_APP_NAME) {
            const { version, eventName } = window.APP_INFO;

            // 检查版本是否一致（只检查前两位）
            if (!isValidVersion(version, process.env.REACT_APP_VERSION)) {
              setError(
                `The version of the local script(v${version}) is not the latest version(v${process.env.REACT_APP_VERSION}). 本地脚本之版本(v${version})非最新版(v${process.env.REACT_APP_VERSION})。`
              );
              return;
            }

            if (eventName) {
              // 注入GM接口
              adaptScript(eventName);
            }

            break;
          }

          if (++i > 8) {
            setError(
              "Time out. Please confirm whether to install or enable Sequence Translator GreaseMonkey script? 连接超时，请检查是否安装或启用序列翻译油猴脚本。"
            );
            return;
          }

          await sleep(1000);
        }
      }

      // 同步数据
      setReady(true);
    })();
  }, []);

  if (error) {
    return (
      <center>
        <Divider>
          <Link
            href={process.env.REACT_APP_HOMEPAGE}
          >{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</Link>
        </Divider>
        <Alert severity="error">{error}</Alert>
        <Stack spacing={2}>
          <Link href={process.env.REACT_APP_USERSCRIPT_DOWNLOADURL}>
            Install/Update Userscript for Tampermonkey/Violentmonkey
          </Link>
          <Link href={process.env.REACT_APP_USERSCRIPT_IOS_DOWNLOADURL}>
            Install/Update Userscript for iOS Safari
          </Link>
        </Stack>
      </center>
    );
  }

  if (!ready) {
    return <Loading />;
  }

  return (
    <SettingProvider context="options">
      <ThemeProvider>
        <AlertProvider>
          <ConfirmProvider>
            <HashRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route index element={<Setting />} />
                  <Route path="rules" element={<Rules />} />
                  <Route path="styles" element={<StylesSetting />} />
                  <Route path="input" element={<InputSetting />} />
                  <Route path="tranbox" element={<Tranbox />} />
                  <Route path="apis" element={<Apis />} />
                  <Route path="words" element={<FavWords />} />
                </Route>
              </Routes>
            </HashRouter>
          </ConfirmProvider>
        </AlertProvider>
      </ThemeProvider>
    </SettingProvider>
  );
}
