import React from "react";
import ReactDOM from "react-dom/client";
import Divider from "@mui/material/Divider";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Link from "@mui/material/Link";

function App() {
  return (
    <Paper sx={{ padding: 2, margin: 2 }}>
      <Divider>
        <Link
          href={process.env.REACT_APP_HOMEPAGE}
        >{`${process.env.REACT_APP_NAME} v${process.env.REACT_APP_VERSION}`}</Link>
      </Divider>
      <Stack spacing={2}>
        <Link href={process.env.REACT_APP_USERSCRIPT_DOWNLOADURL}>
          Install/Update Userscript for Tampermonkey/Violentmonkey
        </Link>
        <Link href={process.env.REACT_APP_USERSCRIPT_IOS_DOWNLOADURL}>
          Install/Update Userscript for iOS Safari
        </Link>
        <Link href={process.env.REACT_APP_OPTIONSPAGE}>Open Options Page</Link>
      </Stack>
    </Paper>
  );
}

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
