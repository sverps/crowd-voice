import React from "react";
import {
  Drawer,
  TextField,
  Box,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { MultipleSelectChip } from "../multiple-select-chip/MultipleSelectChip";
import { filterOptions, useContactFilter } from "../../common/contacts-context";
import { Close } from "@mui/icons-material";

export const FilterDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => any;
}) => {
  const isWideScreen = useMediaQuery("(min-width:932px)");
  const [filter, setFilter] = useContactFilter();
  return (
    <Drawer anchor="top" open={open} onClose={onClose}>
      <Box
        sx={{
          maxWidth: 900,
          mt: 2,
          ...(isWideScreen
            ? {
                mx: "auto",
                width: "100%",
              }
            : {
                mx: 2,
                width: "calc(100% - 32px)",
              }),
        }}
      >
        <IconButton
          aria-label="close"
          size="large"
          sx={{ mr: -1.5, mt: -1.5, float: "right" }}
          onClick={onClose}
        >
          <Close fontSize="inherit" />
        </IconButton>
        <Box mb={2}>
          <MultipleSelectChip
            label="Committees"
            value={filter?.committees ?? []}
            options={Array.from(filterOptions.committees)}
            onChange={(selected: any[]) => {
              setFilter(({ committees, ...rest } = {}) => {
                const newFilter = {
                  ...(selected.length ? { committees: selected } : {}),
                  ...rest,
                };
                if (Object.keys(newFilter).length) {
                  return newFilter;
                }
                return undefined;
              });
            }}
          />
        </Box>
        <Box mb={2}>
          <MultipleSelectChip
            label="Countries"
            value={filter?.countries ?? []}
            options={Array.from(filterOptions.countries)}
            onChange={(selected: any[]) => {
              setFilter(({ countries, ...rest } = {}) => {
                const newFilter = {
                  ...(selected.length ? { countries: selected } : {}),
                  ...rest,
                };
                if (Object.keys(newFilter).length) {
                  return newFilter;
                }
                return undefined;
              });
            }}
          />
        </Box>
        <Box mb={2}>
          <MultipleSelectChip
            label="Groups"
            value={filter?.groups ?? []}
            options={Array.from(filterOptions.groups)}
            onChange={(selected: any[]) => {
              setFilter(({ groups, ...rest } = {}) => {
                const newFilter = {
                  ...(selected.length ? { groups: selected } : {}),
                  ...rest,
                };
                if (Object.keys(newFilter).length) {
                  return newFilter;
                }
                return undefined;
              });
            }}
          />
        </Box>
      </Box>
    </Drawer>
  );
};
