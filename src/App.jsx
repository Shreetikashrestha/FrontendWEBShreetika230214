import React, { useContext } from "react";
import { BrowserRouter } from "react-router-dom";
import { ThemeProvider, CssBaseline, Box } from "@mui/material";
import { styled } from "@mui/material/styles";

import theme from "./theme/theme";
import AppRoutes from "./router/routes";
import { ToastContainer } from "react-toastify";
import { AuthContext } from "./context/authContext";
import AdminRoutes from "./router/AdminRoutes";

const GradientBackground = styled(Box)({
  minHeight: "100vh",
  display: "flex",
  flexDirection: "column",
  background: "linear-gradient(to right, #2c3e50, #fd746c)",
  overflowX: "hidden",
  width: "100%",
  position: "relative",
  margin: 0,
  padding: 0,
});

const MainContent = styled(Box)({
  flex: 1,
  width: "100%",
  position: "relative",
  overflowX: "hidden",
});

const App = () => {
  const { currentUser } = useContext(AuthContext);
  const isAdmin = currentUser?.role === "admin"; // Check if the user is an admin

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer position="top-right" autoClose={3000} />
      <BrowserRouter>
        <GradientBackground>
          <MainContent>{isAdmin ? <AdminRoutes /> : <AppRoutes />}</MainContent>
        </GradientBackground>
      </BrowserRouter>
    </ThemeProvider>
  );
};

export default App;
