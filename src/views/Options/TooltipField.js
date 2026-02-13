import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Stack from "@mui/material/Stack";
import { useI18n } from "../../hooks/I18n";

export default function TooltipField({ tooltip, label, ...props }) {
  const i18n = useI18n();

  if (!tooltip) {
    return <TextField label={label ? i18n(label) : undefined} {...props} />;
  }

  return (
    <TextField
      label={
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <span>{label ? i18n(label) : ""}</span>
          <Tooltip title={i18n(tooltip)} arrow placement="top">
            <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.6 }} />
          </Tooltip>
        </Stack>
      }
      {...props}
    />
  );
}
