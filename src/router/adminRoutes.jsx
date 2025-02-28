import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "../pages/admin/Dashboard";
import AllUser from "../pages/admin/AllUsers";
import ServiceList from "../pages/admin/ServiceList";
import BookingList from "../pages/admin/BookingList";

import { Box } from "@mui/material";
import Sidebar from "../components/admin/Sidebar";

// Mock authentication function (replace with real auth logic)
// const isAdmin = () => {
//   const userRole = localStorage.getItem("user");
//   console.log(userRole);
//   return userRole.role === "admin";
// };

// const ProtectedRoute = ({ children }) => {
//   console.log(isAdmin);
//   return isAdmin() ? children : <Navigate to="/login" />;
// };

const AdminRoutes = () => {
  return (
    <Box sx={{ display: "flex" }}>
      <Sidebar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Routes>
          <Route
            path="/"
            element={
              // <ProtectedRoute>
              <Dashboard />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              // <ProtectedRoute>
              <AllUser />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/services"
            element={
              // <ProtectedRoute>
              <ServiceList />
              // </ProtectedRoute>
            }
          />
          <Route
            path="/bookings"
            element={
              // <ProtectedRoute>
              <BookingList />
              // </ProtectedRoute>
            }
          />
          {/* <Route path="*" element={<NotFound />} /> */}
        </Routes>
      </Box>
    </Box>
  );
};

export default AdminRoutes;
