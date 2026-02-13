import { useState, useEffect } from "react";
import TextField from "@mui/material/TextField";
import Tooltip from "@mui/material/Tooltip";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Stack from "@mui/material/Stack";
import { limitNumber, limitFloat } from "../libs/utils";
import { useI18n } from "./I18n";

function ValidationInput({
  value,
  onChange,
  name,
  min,
  max,
  isFloat = false,
  tooltip,
  label,
  ...props
}) {
  const i18n = useI18n();
  const [localValue, setLocalValue] = useState(value);

  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  const handleLocalChange = (e) => {
    setLocalValue(e.target.value);
  };

  const handleBlur = () => {
    const numValue = Number(localValue);

    if (isNaN(numValue)) {
      setLocalValue(value);
      return;
    }

    const validatedValue = isFloat
      ? limitFloat(numValue, min, max)
      : limitNumber(numValue, min, max);

    if (validatedValue !== numValue) {
      setLocalValue(validatedValue);
    }

    onChange({
      target: {
        name: name,
        value: validatedValue,
      },
      preventDefault: () => {},
    });
  };

  const labelElement = tooltip ? (
    <Stack direction="row" alignItems="center" spacing={0.5}>
      <span>{label}</span>
      <Tooltip title={i18n(tooltip)} arrow placement="top">
        <InfoOutlinedIcon sx={{ fontSize: 16, opacity: 0.6 }} />
      </Tooltip>
    </Stack>
  ) : (
    label
  );

  return (
    <TextField
      {...props}
      label={labelElement}
      type="number"
      name={name}
      value={localValue}
      onChange={handleLocalChange}
      onBlur={handleBlur}
    />
  );
}

export default ValidationInput;
