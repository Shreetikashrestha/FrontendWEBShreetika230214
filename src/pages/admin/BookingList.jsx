import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  alpha,
  styled,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Tooltip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import EditIcon from "@mui/icons-material/Edit";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

// Custom styled components to match the gradient theme
const StyledContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "90%",
  margin: "0 auto",
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
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

const StyledTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  margin: theme.spacing(2, 0, 4, 0),
  fontWeight: 600,
  textAlign: "center",
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
}));

const StyledStatusChip = styled(Chip)(({ status, theme }) => {
  let color = "#757575"; // Default gray

  switch (status) {
    case "Pending":
      color = "#f57c00"; // Orange
      break;
    case "Confirmed":
      color = "#0288d1"; // Blue
      break;
    case "Completed":
      color = "#388e3c"; // Green
      break;
    case "Cancelled":
      color = "#d32f2f"; // Red
      break;
    default:
      break;
  }

  return {
    backgroundColor: alpha(color, 0.1),
    color: color,
    borderColor: alpha(color, 0.25),
    fontWeight: 500,
  };
});

const BookingList = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in local storage");
        setLoading(false);
        return;
      }
      const { data } = await axios.get(
        "http://localhost:8080/api/bookings/view",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(data);
      setBookings(data || []);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteBooking = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/bookings/delete/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBookings(bookings.filter((booking) => booking.id !== id));
    } catch (error) {
      console.error("Failed to delete booking", error);
    }
  };

  const openStatusDialog = (booking) => {
    setSelectedBooking(booking);
    setNewStatus(booking.Status);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedBooking(null);
  };

  const handleStatusChange = async () => {
    if (!selectedBooking) return;

    try {
      const token = localStorage.getItem("accessToken");
      await axios.put(
        `http://localhost:8080/api/bookings/update/${selectedBooking.id}`,
        { Status: newStatus },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setBookings(
        bookings.map((booking) =>
          booking.id === selectedBooking.id
            ? { ...booking, Status: newStatus }
            : booking
        )
      );
      closeDialog();
    } catch (error) {
      console.error("Failed to update booking status", error);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Pending":
        return <CalendarTodayIcon fontSize="small" />;
      case "Confirmed":
        return <CheckCircleIcon fontSize="small" />;
      case "Completed":
        return <CheckCircleIcon fontSize="small" />;
      case "Cancelled":
        return <DeleteIcon fontSize="small" />;
      default:
        return null;
    }
  };

  // Format date and time from separate fields
  const formatDateTime = (date, time) => {
    if (!date) return "N/A";

    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString();

    // If time is available, include it
    if (time) {
      return `${formattedDate} ${time}`;
    }

    return formattedDate;
  };

  return (
    <StyledContainer>
      <StyledTitle variant="h4">
        <BookOnlineIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        Booking Management
      </StyledTitle>

      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>User</TableCell>
                <TableCell>Service</TableCell>
                <TableCell>Date & Time</TableCell>
                <TableCell>Day</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {bookings.map((booking) => (
                <TableRow
                  key={booking.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha("#fd746c", 0.05),
                    },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={booking.id}
                      size="small"
                      sx={{
                        bgcolor: alpha("#2c3e50", 0.1),
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{booking.User?.name || "N/A"}</TableCell>
                  <TableCell>
                    {booking.ServicesModel?.Servicename || "N/A"}
                  </TableCell>
                  <TableCell>
                    {formatDateTime(booking.Date, booking.Time)}
                  </TableCell>
                  <TableCell>{booking.Day || "N/A"}</TableCell>
                  <TableCell>
                    <StyledStatusChip
                      icon={getStatusIcon(booking.Status)}
                      label={booking.Status}
                      status={booking.Status}
                      variant="outlined"
                      size="small"
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Box sx={{ display: "flex", justifyContent: "center" }}>
                      <Tooltip title="Change Status">
                        <IconButton
                          color="primary"
                          onClick={() => openStatusDialog(booking)}
                          sx={{
                            "&:hover": {
                              backgroundColor: alpha("#2c3e50", 0.1),
                              transform: "scale(1.1)",
                            },
                            transition: "all 0.2s",
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Delete Booking">
                        <IconButton
                          color="error"
                          onClick={() => deleteBooking(booking.id)}
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
                      </Tooltip>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
              {bookings.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No bookings found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>

      {/* Status Change Dialog */}
      <Dialog open={dialogOpen} onClose={closeDialog}>
        <DialogTitle
          sx={{
            background: "linear-gradient(to right, #2c3e50, #fd746c)",
            color: "white",
          }}
        >
          Change Booking Status
        </DialogTitle>
        <DialogContent sx={{ pt: 2, minWidth: 300 }}>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Update status for booking #{selectedBooking?.id}
          </Typography>
          <Select
            fullWidth
            value={newStatus}
            onChange={(e) => setNewStatus(e.target.value)}
          >
            <MenuItem value="Pending">Pending</MenuItem>
            <MenuItem value="Confirmed">Confirmed</MenuItem>
            <MenuItem value="Completed">Completed</MenuItem>
            <MenuItem value="Cancelled">Cancelled</MenuItem>
          </Select>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog}>Cancel</Button>
          <Button
            onClick={handleStatusChange}
            variant="contained"
            sx={{
              background: "linear-gradient(to right, #2c3e50, #fd746c)",
              "&:hover": {
                background: "linear-gradient(to right, #1a2a38, #e76058)",
              },
            }}
          >
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </StyledContainer>
  );
};

export default BookingList;
