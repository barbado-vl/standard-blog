import React from "react";

import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import TagIcon from "@mui/icons-material/Tag";
import ListItemText from "@mui/material/ListItemText";
import Skeleton from "@mui/material/Skeleton";

import { SideBlock } from "./SideBlock";

export const TagsBlock = ({ items, homeHandleListClick, isLoading = true }) => {
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const handleListItemClick = (event, index) => {
    setSelectedIndex(index);
    homeHandleListClick(event);
  };
  
  return (
    <SideBlock title="Тэги">
      <ListItemButton
        selected={selectedIndex === 0}
        onClick={(event) => handleListItemClick(event, 0)}>
        <ListItemText primary="Все"/>
      </ListItemButton>
      <List>
        {(isLoading ? [...Array(5)] : items).map((name, i) => (
          
            <ListItem key={i} disablePadding>
              <ListItemButton
                selected={selectedIndex === i + 1}
                onClick={(event) => handleListItemClick(event, i + 1)}>
                <ListItemIcon>
                  <TagIcon />
                </ListItemIcon>
                {isLoading ? (
                  <Skeleton width={100} />
                ) : (
                  <ListItemText primary={name}/>
                )}
              </ListItemButton>
            </ListItem>

        ))}
      </List>
    </SideBlock>
  );
};
