import React from "react";
import {
  Drawer,
  TextField,
  Box,
  useMediaQuery,
  IconButton,
} from "@mui/material";
import { useEmailTemplate } from "../../common/email-template-context";
import { Close } from "@mui/icons-material";

export const EmailTemplateDrawer = ({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => any;
}) => {
  const isWideScreen = useMediaQuery("(min-width:932px)");
  const [{ subject, body }, setEmailTemplate] = useEmailTemplate();
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
          <TextField
            variant="outlined"
            label="Subject"
            onChange={(event) => {
              setEmailTemplate((template) => ({
                ...template,
                subject: event?.target?.value,
              }));
            }}
            value={subject}
            fullWidth
          />
        </Box>
        <Box mb={2}>
          <TextField
            variant="outlined"
            label="Body"
            onChange={(event) => {
              setEmailTemplate((template) => ({
                ...template,
                body: event?.target?.value,
              }));
            }}
            value={body}
            multiline
            minRows={4}
            fullWidth
          />
        </Box>
      </Box>
    </Drawer>
  );
};
