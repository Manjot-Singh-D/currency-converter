import React from "react";

// MUI
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";

// Shows the input text and select dropdown
const InputText = ({
  label,
  value,
  valueLabel,
  handleChange,
  currency,
  currencyLabel,
  currencyList,
  otherCurrencyName,
  error,
}) => {
  return (
    <>
      <TextField
        id="standard-helperText"
        label={label}
        value={value}
        name={valueLabel}
        onChange={handleChange}
        variant="standard"
        disabled={error}
      />
      <FormControl>
        <Select
          value={currency}
          onChange={handleChange}
          displayEmpty
          name={currencyLabel}
          disabled={error}
        >
          {currencyList &&
            currencyList.map((currencyName, index) => {
              if (currencyName !== otherCurrencyName) {
                return (
                  <MenuItem key={index} value={currencyName}>
                    {currencyName}
                  </MenuItem>
                );
              }
            })}
        </Select>
      </FormControl>
    </>
  );
};

export default InputText;
