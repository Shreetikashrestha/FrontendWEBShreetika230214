import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  IconButton,
  Chip,
  alpha,
  styled,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  Tooltip,
  Snackbar,
  Alert,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";
import DescriptionIcon from "@mui/icons-material/Description";
import axios from "axios";

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "90%",
  margin: "0 auto",
}));

const StyledHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: theme.spacing(3),
}));

const PageTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 600,
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
  display: "flex",
  alignItems: "center",
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  overflow: "hidden",
  backgroundColor: alpha("#fff", 0.9),
  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
  backdropFilter: "blur(8px)",
}));

const StyledTableContainer = styled(TableContainer)({
  borderRadius: "inherit",
});

const StyledTableHead = styled(TableHead)(({ theme }) => ({
  background: "linear-gradient(to right, #2c3e50, #fd746c)",
  "& .MuiTableCell-head": {
    color: theme.palette.common.white,
    fontWeight: 600,
  },
}));

const AddButton = styled(Button)(({ theme }) => ({
  background: "linear-gradient(to right, #2c3e50, #fd746c)",
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1, 2),
  color: theme.palette.common.white,
  fontWeight: 500,
  textTransform: "none",
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  "&:hover": {
    boxShadow: "0 6px 16px rgba(0, 0, 0, 0.2)",
    background: "linear-gradient(to right, #263545, #e86b63)",
  },
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiPaper-root": {
    borderRadius: theme.spacing(2),
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
  },
}));

const DialogHeader = styled(DialogTitle)(({ theme }) => ({
  background: "linear-gradient(to right, #2c3e50, #fd746c)",
  color: theme.palette.common.white,
  fontWeight: 600,
}));

const PriceDisplay = styled(Typography)({
  fontWeight: 500,
});

const DescriptionText = styled(Typography)(({ theme }) => ({
  color: theme.palette.text.secondary,
  fontSize: "0.875rem",
  maxWidth: "300px",
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  display: "flex",
  alignItems: "center",
}));

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [formData, setFormData] = useState({
    Servicename: "",
    Description: "",
    Price: "",
  });

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in local storage");
        setLoading(false);
        return;
      }

      const { data } = await axios.get(
        "http://localhost:8080/api/services/view_services",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data.data);

      setServices(data.data || []);
    } catch (error) {
      console.error("Failed to fetch services:", error);
      setSnackbar({
        open: true,
        message: "Failed to load services. Please try again.",
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchServices();
  }, []);

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/services/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices(services.filter((service) => service.id !== id));
      setSnackbar({
        open: true,
        message: "Service deleted successfully",
        severity: "success",
      });
    } catch (error) {
      console.error("Failed to delete service:", error);
      setSnackbar({
        open: true,
        message: "Failed to delete service. Please try again.",
        severity: "error",
      });
    }
  };

  const handleOpenDialog = (service = null) => {
    if (service) {
      setEditingService(service);
      setFormData({
        Servicename: service.Servicename,
        Description: service.Description || "",
        Price: service.Price.toString().replace(/[$,]/g, ""),
      });
    } else {
      setEditingService(null);
      setFormData({ Servicename: "", Description: "", Price: "" });
    }
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    try {
      const token = localStorage.getItem("accessToken");
      const serviceData = {
        Servicename: formData.Servicename,
        Description: formData.Description,
        Price: parseFloat(formData.Price),
      };

      if (editingService) {
        // Update existing service
        await axios.put(
          `http://localhost:8080/api/services/${editingService.id}`,
          serviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setServices(
          services.map((service) =>
            service.id === editingService.id
              ? {
                  ...service,
                  ...serviceData,
                  // Price: `$${serviceData.Price}`,
                }
              : service
          )
        );

        setSnackbar({
          open: true,
          message: "Service updated successfully",
          severity: "success",
        });
      } else {
        // Add new service
        const response = await axios.post(
          "http://localhost:8080/api/services",
          serviceData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const newService = {
          id: response.data.data.id || services.length + 1,
          ...serviceData,
          // Price: `$${serviceData.Price}`,
        };

        setServices([...services, newService]);
        setSnackbar({
          open: true,
          message: "Service added successfully",
          severity: "success",
        });
      }

      handleCloseDialog();
    } catch (error) {
      console.error("Failed to save service:", error);
      setSnackbar({
        open: true,
        message: `Failed to ${
          editingService ? "update" : "add"
        } service. Please try again.`,
        severity: "error",
      });
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <StyledContainer>
      <StyledHeader>
        <PageTitle variant="h4">
          <MiscellaneousServicesIcon sx={{ mr: 1.5, fontSize: 32 }} />
          Service Management
        </PageTitle>
        <AddButton
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => handleOpenDialog()}
        >
          Add New Service
        </AddButton>
      </StyledHeader>

      <StyledPaper>
        <StyledTableContainer>
          {loading ? (
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: 300,
              }}
            >
              <CircularProgress sx={{ color: "#2c3e50" }} />
            </Box>
          ) : (
            <Table>
              <StyledTableHead>
                <TableRow>
                  <TableCell>ID</TableCell>
                  <TableCell>Servicename</TableCell>
                  <TableCell>Description</TableCell>
                  <TableCell>Price</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </StyledTableHead>
              <TableBody>
                {services.map((service) => (
                  <TableRow
                    key={service.id}
                    sx={{
                      "&:hover": {
                        backgroundColor: alpha("#fd746c", 0.05),
                      },
                    }}
                  >
                    <TableCell>
                      <Chip
                        label={service.id}
                        size="small"
                        sx={{
                          bgcolor: alpha("#2c3e50", 0.1),
                          fontWeight: 500,
                        }}
                      />
                    </TableCell>
                    <TableCell>{service.Servicename}</TableCell>
                    <TableCell>
                      <Tooltip title={service.Description || "No description"}>
                        <DescriptionText>
                          <DescriptionIcon
                            fontSize="small"
                            sx={{ mr: 0.5, color: alpha("#000", 0.5) }}
                          />
                          {service.Description || "No description provided"}
                        </DescriptionText>
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      <PriceDisplay>
                        ${parseFloat(service.Price).toFixed(2)}
                      </PriceDisplay>
                    </TableCell>
                    <TableCell align="center">
                      <IconButton
                        color="primary"
                        onClick={() => handleOpenDialog(service)}
                        sx={{
                          mr: 1,
                          "&:hover": {
                            backgroundColor: alpha("#2c3e50", 0.1),
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        color="error"
                        onClick={() => handleDelete(service.id)}
                        sx={{
                          "&:hover": {
                            backgroundColor: alpha("#fd746c", 0.1),
                            transform: "scale(1.1)",
                          },
                          transition: "all 0.2s",
                        }}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
                {services.length === 0 && !loading && (
                  <TableRow>
                    <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                      <Typography variant="body1" color="textSecondary">
                        No services found
                      </Typography>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          )}
        </StyledTableContainer>
      </StyledPaper>

      <StyledDialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogHeader>
          {editingService ? "Edit Service" : "Add New Service"}
        </DialogHeader>
        <DialogContent sx={{ pt: 3 }}>
          <TextField
            fullWidth
            label="Service Servicename"
            name="Servicename"
            value={formData.Servicename}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
          />
          <TextField
            fullWidth
            label="Description"
            name="Description"
            value={formData.Description}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            multiline
            rows={3}
            placeholder="Enter a detailed description of the service"
          />
          <TextField
            fullWidth
            label="Price"
            name="Price"
            value={formData.Price}
            onChange={handleChange}
            margin="normal"
            variant="outlined"
            required
            InputProps={{
              startAdornment: "$",
            }}
            type="number"
            inputProps={{ min: 0, step: "0.01" }}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button
            onClick={handleCloseDialog}
            sx={{
              color: "#2c3e50",
              textTransform: "none",
              fontWeight: 500,
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            variant="contained"
            disabled={!formData.Servicename || !formData.Price}
            sx={{
              background: "linear-gradient(to right, #2c3e50, #fd746c)",
              textTransform: "none",
              fontWeight: 500,
              px: 3,
              "&:hover": {
                background: "linear-gradient(to right, #263545, #e86b63)",
              },
            }}
          >
            {editingService ? "Update" : "Add"} Service
          </Button>
        </DialogActions>
      </StyledDialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
};

export default ServiceList;
