import React, { useContext } from "react";
import {
  Drawer,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Box,
  Typography,
  Divider,
  styled,
  alpha,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import LogoutIcon from "@mui/icons-material/Logout";
import { AuthContext } from "../../context/authContext";

// Custom styled components
const StyledDrawer = styled(Drawer)(({ theme }) => ({
  width: 240,
  flexShrink: 0,
  "& .MuiDrawer-paper": {
    width: 240,
    boxSizing: "border-box",
    background: "linear-gradient(to bottom, #2c3e50, #3a4a5e)",
    color: theme.palette.common.white,
    borderRight: "none",
    boxShadow: "4px 0 15px rgba(0, 0, 0, 0.2)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
  },
}));

const SidebarHeader = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: alpha("#fd746c", 0.3),
  borderBottom: `1px solid ${alpha(theme.palette.common.white, 0.1)}`,
}));

const LogoText = styled(Typography)(({ theme }) => ({
  fontWeight: 700,
  fontSize: "1.3rem",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.15)",
  letterSpacing: 1,
}));

const StyledListItem = styled(ListItem)(({ theme, active }) => ({
  margin: theme.spacing(0.5, 1),
  borderRadius: theme.spacing(1),
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
  "&:before": active
    ? {
        content: '""',
        position: "absolute",
        left: 0,
        top: 0,
        height: "100%",
        width: 4,
        background: "#fd746c",
        borderRadius: theme.spacing(0, 1, 1, 0),
      }
    : {},
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    "& .MuiListItemIcon-root": {
      color: "white",
    },
  },
  ...(active && {
    backgroundColor: alpha(theme.palette.common.white, 0.1),
    "& .MuiListItemIcon-root": {
      color: "#fd746c",
    },
    "& .MuiListItemText-primary": {
      fontWeight: 600,
    },
  }),
}));

const StyledListItemIcon = styled(ListItemIcon)({
  color: "rgba(255, 255, 255, 0.7)",
  minWidth: 40,
  transition: "color 0.3s ease",
});

const StyledDivider = styled(Divider)(({ theme }) => ({
  margin: theme.spacing(1, 2),
  backgroundColor: alpha(theme.palette.common.white, 0.1),
}));

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useContext(AuthContext);

  // Menu items data structure
  const menuItems = [
    { path: "/", label: "Dashboard", icon: <DashboardIcon /> },
    { path: "/users", label: "Users", icon: <PeopleAltIcon /> },
    {
      path: "/services",
      label: "Services",
      icon: <MiscellaneousServicesIcon />,
    },
    { path: "/bookings", label: "Bookings", icon: <BookOnlineIcon /> },
  ];

  // Check if current path matches menu item path
  const isActive = (path) => location.pathname === path;

  return (
    <StyledDrawer variant="permanent">
      <Box>
        <SidebarHeader>
          <AdminPanelSettingsIcon sx={{ mr: 1, fontSize: 28 }} />
          <LogoText variant="h6">Admin Panel</LogoText>
        </SidebarHeader>

        <StyledDivider />

        <List sx={{ pt: 1 }}>
          {menuItems.map((item) => (
            <StyledListItem
              key={item.path}
              button
              component={Link}
              to={item.path}
              active={isActive(item.path) ? 1 : 0}
            >
              <StyledListItemIcon>{item.icon}</StyledListItemIcon>
              <ListItemText
                primary={item.label}
                primaryTypographyProps={{
                  fontSize: 15,
                  fontWeight: isActive(item.path) ? 600 : 400,
                  color: "#ffffff",
                }}
              />
            </StyledListItem>
          ))}
        </List>
      </Box>

      <Box>
        <StyledDivider />

        <StyledListItem button onClick={logout}>
          <StyledListItemIcon>
            <LogoutIcon />
          </StyledListItemIcon>
          <ListItemText primary="Logout" />
        </StyledListItem>
      </Box>
    </StyledDrawer>
  );
};

export default Sidebar;
