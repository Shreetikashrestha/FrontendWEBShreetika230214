import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const userRole = localStorage.getItem("role");
  return userRole === "admin" ? children : <Navigate to="/login" />;
};

export default ProtectedRoute;