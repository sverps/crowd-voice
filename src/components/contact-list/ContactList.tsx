import React, { useState } from "react";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  IconButton,
  Typography,
  useMediaQuery,
} from "@mui/material";
import { Box } from "@mui/system";
import { useEmailTemplate } from "../../common/email-template-context";
import { useContacts } from "../../common/contacts-context";
import { useExclusionList } from "../../common/exclusion-context";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

export const ContactList = () => {
  const isWideScreen = useMediaQuery("(min-width:932px)");
  const [{ subject, body }] = useEmailTemplate();
  const contacts = useContacts();
  const [excluded, setExcluded] = useExclusionList();
  const [amountToDisplay, setAmountToDisplay] = useState(12);

  return (
    <Box
      my={2}
      sx={{
        display: "flex",
        justifyContent: "space-between",
        flexWrap: "wrap",
      }}
    >
      {contacts?.length ? (
        contacts.slice(0, amountToDisplay).map((contact) => {
          const isExcluded = excluded.includes(contact.id);
          return (
            <Card
              key={contact.id}
              sx={{
                flex: isWideScreen ? "0 1 calc(33% - 6px)" : "0 1 100%",
                display: "flex",
                flexDirection: "column",
                mb: 1,
              }}
              variant="outlined"
            >
              <CardContent
                sx={{
                  opacity: isExcluded ? 0.3 : 1,
                  flex: 1,
                }}
              >
                <Typography sx={{ fontSize: 16, fontWeight: 400 }}>
                  {`${contact.firstName} ${contact.lastName}`}
                </Typography>
                <Typography variant="body2">{`${contact.country} (${contact.party})`}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {contact.group}
                </Typography>
              </CardContent>
              <CardActions
                sx={{
                  justifyContent: "space-between",
                  opacity: isExcluded ? 0.3 : 1,
                }}
              >
                <Button
                  variant="outlined"
                  onClick={(event) => {
                    globalThis.open(
                      `mailto:${contact.email}?subject=${subject}&body=${body}`,
                      "mail"
                    );
                    event.preventDefault();
                    if (!isExcluded) {
                      setExcluded([...excluded, contact.id]);
                    }
                  }}
                >
                  Send an e-mail
                </Button>
                <IconButton
                  size="large"
                  sx={{ ml: "auto" }}
                  onClick={() => {
                    if (!isExcluded) {
                      setExcluded([...excluded, contact.id]);
                    } else {
                      setExcluded(excluded.filter((id) => id !== contact.id));
                    }
                  }}
                >
                  {isExcluded ? (
                    <VisibilityOffIcon color="primary" />
                  ) : (
                    <VisibilityIcon color="primary" />
                  )}
                </IconButton>
              </CardActions>
            </Card>
          );
        })
      ) : (
        <Typography>No members matching your filter criteria.</Typography>
      )}
      {amountToDisplay < contacts.length ? (
        <Button
          onClick={() => {
            setAmountToDisplay((current) => current + 12);
          }}
          fullWidth
          variant="outlined"
        >
          Show more
        </Button>
      ) : null}
    </Box>
  );
};
