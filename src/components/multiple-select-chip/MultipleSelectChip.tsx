import React from "react";
import { Theme, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import Chip from "@mui/material/Chip";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 6.5 + ITEM_PADDING_TOP,
      // width: 250,
    },
  },
};

function getStyles(option: string, selected: string[], theme: Theme) {
  return {
    whiteSpace: "initial",
    fontWeight:
      selected.indexOf(option) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

export function MultipleSelectChip({
  label,
  value = [],
  onChange,
  options,
}: {
  label: string;
  value: string[];
  onChange: (value: string[]) => any;
  options: string[];
}) {
  const theme = useTheme();

  const handleChange = (event: SelectChangeEvent<string[]>) => {
    const {
      target: { value },
    } = event;
    onChange(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  return (
    <FormControl sx={{ width: "100%" }}>
      <InputLabel id={`${label}-input-label`}>{label}</InputLabel>
      <Select<string[]>
        fullWidth
        labelId={`${label}-select-label`}
        id={`${label}-select`}
        multiple
        value={value}
        onChange={handleChange}
        input={<OutlinedInput id={`${label}-select-chip`} label={label} />}
        renderValue={(selected) => (
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value} />
            ))}
          </Box>
        )}
        MenuProps={MenuProps}
      >
        {options.map((option: any) => (
          <MenuItem
            key={option}
            value={option}
            style={getStyles(option, value, theme) as any}
          >
            {option}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
