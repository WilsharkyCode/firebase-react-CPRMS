// DrawerContent.js
import React from "react";
import {
  Toolbar,
  Typography,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import DashboardIcon from '@mui/icons-material/Dashboard';
import CorporateFareIcon from '@mui/icons-material/CorporateFare';
import PeopleIcon from '@mui/icons-material/People';
import WorkIcon from '@mui/icons-material/Work';
import AddLocationAltIcon from '@mui/icons-material/AddLocationAlt';

import { useNavigate } from "react-router-dom";

const DrawerContent = () => {
    const Nav = useNavigate();

  return (
    <div >
      <Toolbar  >
      <Typography variant="h6" noWrap component="div" >
            LOGO
      </Typography>
      </Toolbar>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => Nav("/")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary={"Dashboard"} />
          </ListItemButton>
        </ListItem>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton onClick={() => Nav("/patient")}>
            <ListItemIcon>
              <PeopleIcon />
            </ListItemIcon>
            <ListItemText primary={"Patient Management"} />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton onClick={() => Nav("/inventory")}>
            <ListItemIcon>
              <CorporateFareIcon />
            </ListItemIcon>
            <ListItemText primary={"Inventory Management"} />
          </ListItemButton>
        </ListItem>
      <Divider />
        <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <WorkIcon />
            </ListItemIcon>
            <ListItemText primary={"Employee Management"} />
          </ListItemButton>
        </ListItem>
      <Divider />
      <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <AddLocationAltIcon />
            </ListItemIcon>
            <ListItemText primary={"Add a New Branch"} />
          </ListItemButton>
        </ListItem>
      <Divider />
      <ListItem disablePadding>
          <ListItemButton>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary={"Logout"} />
          </ListItemButton>
        </ListItem>
      </List>
    </div>
  );
};

export default DrawerContent;
