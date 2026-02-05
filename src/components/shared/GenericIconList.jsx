import React, { useState } from "react";
import {
  Box,
  Typography,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  IconButton,
} from "@mui/material";

/**
 * GenericIconList
 *
 * Props:
 * - items: array of objects to display
 * - getKey:        (item) => unique key
 * - getPrimary:    (item) => string (main text)
 * - getSecondary:  (item) => string (secondary text, optional)
 * - getIcon:       (item) => ReactNode (icon/avatar, optional)
 * - getSecondaryAction: (item) => ReactNode (secondary action, optional)
 * - title: string (list title)
 * - onSelect: (key) => void (callback when item is selected)
 * - maxHeight: number|string (maximum height before scrolling, optional)
 * - disableScroll: boolean (disable scrolling, optional)
 */
const GenericIconList = ({
  items = [],
  getKey = (item) => item.id || item.name,
  getPrimary = (item) => item.name,
  getSecondary = (item) => item.description,
  getIcon = (item) => item.icon,
  getSecondaryAction = (item) => item.secondaryAction,
  title = "Unnamed List",
  onSelect = null,
  maxHeight = "400px", // Default max height
  disableScroll = false, // Disable scrolling if needed
}) => {
  const [selected, setSelected] = useState(null);

  // ---- Empty‑state ---------------------------------------------------------
  if (!items || items.length === 0) {
    return (
      <Box>
        {title && (
          <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
            {title}
          </Typography>
        )}
        <Typography sx={{ p: 2, color: "text.secondary" }}>
          No items to display
        </Typography>
      </Box>
    );
  }

  // ---- Click handling -------------------------------------------------------
  const handleSelect = (itemKey) => {
    setSelected(itemKey);
    if (onSelect) onSelect(itemKey);
  };

  // ---- Render ---------------------------------------------------------------
  return (
    <Box>
      {/* Title ------------------------------------------------------------- */}
      {title && (
        <Typography sx={{ mt: 4, mb: 2 }} variant="h6" component="div">
          {title}
        </Typography>
      )}

      {/* Scroll container --------------------------------------------------- */}
      <Box
        sx={{
          maxHeight: disableScroll ? "none" : maxHeight,
          overflowY: disableScroll ? "visible" : "auto",
          overflowX: "hidden",
        }}
      >
        <List dense disablePadding>
          {items.map((item) => {
            const key = getKey(item);
            const isSelected = selected === key;

            return (
              <ListItem
                key={key}
                button
                selected={isSelected}
                onClick={() => handleSelect(key)}
                secondaryAction={
                  getSecondaryAction ? getSecondaryAction(item) : null
                }
                sx={{
                  // ---- “card‑like” look ---------------------------------------
                  border: 1,
                  borderColor: "divider",
                  borderRadius: 1,
                  backgroundColor: "background.paper",
                  mb: 1, // small vertical gap between items
                  // ---- Interaction styles ------------------------------------
                  "&:hover": {
                    backgroundColor: "action.hover", // theme‐aware hover colour
                    borderColor: "primary.main",
                  },
                  // Keep the selected colour from MUI but add a little extra visual cue
                  ...(isSelected && {
                    backgroundColor: "action.selected",
                    borderColor: "primary.main",
                  }),
                }}
              >
                {/* ---- Optional avatar/icon ------------------------------------ */}
                {getIcon && (
                  <ListItemAvatar>
                    <Avatar variant="square">
                      {typeof getIcon(item) === "string" ? (
                        <Typography>{getIcon(item)}</Typography>
                      ) : (
                        getIcon(item)
                      )}
                    </Avatar>
                  </ListItemAvatar>
                )}

                {/* ---- Primary / secondary text ------------------------------ */}
                <ListItemText
                  primary={getPrimary(item)}
                  secondary={getSecondary ? getSecondary(item) : null}
                />
              </ListItem>
            );
          })}
        </List>
      </Box>
    </Box>
  );
};

export default GenericIconList;