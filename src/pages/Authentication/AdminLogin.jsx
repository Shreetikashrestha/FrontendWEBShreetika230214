import React, { useState, useContext } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  InputAdornment,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion } from "framer-motion";
import { Email as Mail, Lock } from "@mui/icons-material";
import { AuthContext } from "../../context/authContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const GlassCard = styled(Box)({
  background: "rgba(255, 255, 255, 0.1)",
  backdropFilter: "blur(10px)",
  borderRadius: "20px",
  padding: "40px",
  boxShadow: "0 8px 32px 0 rgba(31, 38, 135, 0.37)",
  border: "1px solid rgba(255, 255, 255, 0.18)",
});

const StyledTextField = styled(TextField)({
  "& .MuiOutlinedInput-root": {
    color: "white",
    "& fieldset": {
      borderColor: "rgba(255, 255, 255, 0.3)",
    },
    "&:hover fieldset": {
      borderColor: "rgba(255, 255, 255, 0.5)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#f8a5c2",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255, 255, 255, 0.7)",
  },
  marginBottom: "20px",
});

const AdminLogin = () => {
  // State hooks for email and password
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Access login function from AuthContext
  const { login } = useContext(AuthContext);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = { email, password };
    // Add form submission logic here
    console.log("Form submitted:", formData);

    try {
      const response = await login(formData);
      navigate("/admin/dashboard"); // Navigate to the admin dashboard
    } catch (error) {
      toast.error("Error logging in as admin");
      console.log("Error logging in as admin:", error);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 8 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <GlassCard>
          <Typography
            variant="h3"
            sx={{ color: "white", mb: 2, textAlign: "center" }}
          >
            Admin Login
          </Typography>
          <Typography
            variant="h6"
            sx={{ color: "#f8a5c2", mb: 4, textAlign: "center" }}
          >
            Login to your Admin account
          </Typography>

          <form onSubmit={handleSubmit}>
            <StyledTextField
              fullWidth
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Mail sx={{ color: "#f8a5c2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <StyledTextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock sx={{ color: "#f8a5c2" }} />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              fullWidth
              variant="contained"
              size="large"
              type="submit"
              sx={{
                mt: 2,
                bgcolor: "#f8a5c2",
                color: "#2c3e50",
                "&:hover": {
                  bgcolor: "#f8a5c2cc",
                },
                py: 1.5,
              }}
            >
              Login
            </Button>
            <Typography
              sx={{
                color: "#f8a5c2",
                textAlign: "center",
                mt: 2,
                cursor: "pointer",
              }}
              onClick={() => navigate("/login")}
            >
              Back to User Login
            </Typography>
          </form>
        </GlassCard>
      </motion.div>
    </Container>
  );
};

export default AdminLogin;