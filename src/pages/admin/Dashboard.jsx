import React, { useState, useEffect } from "react";
import {
  Box,
  Grid,
  Typography,
  Card,
  CardContent,
  alpha,
  styled,
  useTheme,
  CircularProgress,
} from "@mui/material";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import axios from "axios";
import PersonIcon from "@mui/icons-material/Person";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MiscellaneousServicesIcon from "@mui/icons-material/MiscellaneousServices";

// Styled components
const DashboardContainer = styled(Box)(({ theme }) => ({
  padding: theme.spacing(3),
  maxWidth: "95%",
  margin: "0 auto",
}));

const DashboardTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  marginBottom: theme.spacing(4),
  fontWeight: 600,
  textShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
}));

const StyledCard = styled(Card)(({ theme, gradientstart, gradientend }) => ({
  borderRadius: theme.spacing(2),
  background: `linear-gradient(135deg, ${gradientstart || "#2c3e50"}, ${
    gradientend || "#fd746c"
  })`,
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.12)",
  height: "100%",
  transition: "transform 0.3s, box-shadow 0.3s",
  "&:hover": {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 28px rgba(0, 0, 0, 0.2)",
  },
}));

const CardHeader = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  marginBottom: theme.spacing(1),
}));

const IconContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  backgroundColor: alpha(theme.palette.common.white, 0.2),
  borderRadius: "50%",
  padding: theme.spacing(1),
  marginRight: theme.spacing(1.5),
}));

const CardValue = styled(Typography)(({ theme }) => ({
  color: theme.palette.common.white,
  fontWeight: 700,
  marginTop: theme.spacing(1),
}));

const CardLabel = styled(Typography)(({ theme }) => ({
  color: alpha(theme.palette.common.white, 0.9),
  fontWeight: 500,
}));

const ChartContainer = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  background: alpha(theme.palette.common.white, 0.9),
  padding: theme.spacing(2),
  boxShadow: "0 8px 24px rgba(0, 0, 0, 0.1)",
  marginTop: theme.spacing(4),
}));

const LoadingContainer = styled(Box)(({ theme }) => ({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  minHeight: "50vh",
}));

const StyledTooltip = styled("div")(({ theme }) => ({
  backgroundColor: alpha("#2c3e50", 0.8),
  color: theme.palette.common.white,
  padding: theme.spacing(1.5),
  borderRadius: theme.spacing(1),
  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.15)",
  border: "none",
}));

const Dashboard = () => {
  const [data, setData] = useState({
    totalUsers: 0,
    totalBookings: 0,
    activeServices: 0,
    monthlyStats: [],
  });
  const [loading, setLoading] = useState(true);
  const theme = useTheme();

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("accessToken");
        if (!token) {
          console.error("No token found in local storage");
          setLoading(false);
          return;
        }

        // Fetch all required data in parallel
        const [usersResponse, bookingsResponse, servicesResponse] =
          await Promise.all([
            axios.get("http://localhost:8080/api/users", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8080/api/bookings/view", {
              headers: { Authorization: `Bearer ${token}` },
            }),
            axios.get("http://localhost:8080/api/services/view_services", {
              headers: { Authorization: `Bearer ${token}` },
            }),
          ]);

        console.log(bookingsResponse);

        const users = usersResponse.data.data || [];
        const bookings = bookingsResponse.data || [];
        const services = servicesResponse.data.data || [];
        console.log(bookings);

        // Process monthly stats from user creation dates
        const monthlyStats = processMonthlyStats(users, bookings);

        setData({
          totalUsers: users.length,
          totalBookings: bookings.length,
          activeServices: services.length,
          monthlyStats: monthlyStats,
        });
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Process user and booking data to generate monthly statistics
  const processMonthlyStats = (users, bookings) => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentYear = new Date().getFullYear();

    // Initialize monthly data with zeros
    const monthlyData = months.map((month) => ({
      month,
      users: 0,
      bookings: 0,
    }));

    // Count users by month of creation
    users.forEach((user) => {
      const createdAt = new Date(user.createdAt);
      // Only count users created in the current year
      if (createdAt.getFullYear() === currentYear) {
        const monthIndex = createdAt.getMonth();
        monthlyData[monthIndex].users += 1;
      }
    });

    // Count bookings by month of creation
    bookings.forEach((booking) => {
      const createdAt = new Date(booking.createdAt);
      // Only count bookings created in the current year
      if (createdAt.getFullYear() === currentYear) {
        const monthIndex = createdAt.getMonth();
        monthlyData[monthIndex].bookings += 1;
      }
    });

    // Calculate cumulative totals
    let cumulativeUsers = 0;
    let cumulativeBookings = 0;

    return monthlyData.map((item) => {
      cumulativeUsers += item.users;
      cumulativeBookings += item.bookings;

      return {
        month: item.month,
        users: cumulativeUsers,
        bookings: cumulativeBookings,
      };
    });
  };

  // Custom tooltip component for the chart
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <StyledTooltip>
          <Typography variant="subtitle2">{label}</Typography>
          {payload.map((entry, index) => (
            <Box
              key={`tooltip-${index}`}
              display="flex"
              alignItems="center"
              mt={0.5}
            >
              <Box
                component="span"
                sx={{
                  width: 12,
                  height: 12,
                  backgroundColor: entry.color,
                  borderRadius: 6,
                  display: "inline-block",
                  marginRight: 1,
                }}
              />
              <span>{`${entry.name}: ${entry.value}`}</span>
            </Box>
          ))}
        </StyledTooltip>
      );
    }
    return null;
  };

  return (
    <DashboardContainer>
      <DashboardTitle variant="h4">Admin Dashboard</DashboardTitle>

      {loading ? (
        <LoadingContainer>
          <CircularProgress sx={{ color: theme.palette.common.white }} />
          <Typography sx={{ color: theme.palette.common.white, mt: 2 }}>
            Loading dashboard data...
          </Typography>
        </LoadingContainer>
      ) : (
        <>
          <Grid container spacing={3} mb={4}>
            <Grid item xs={12} sm={4}>
              <StyledCard gradientstart="#2c3e50" gradientend="#4ca1af">
                <CardContent>
                  <CardHeader>
                    <IconContainer>
                      <PersonIcon sx={{ color: "white" }} />
                    </IconContainer>
                    <CardLabel variant="subtitle1">Total Users</CardLabel>
                  </CardHeader>
                  <CardValue variant="h3">
                    {data.totalUsers.toLocaleString()}
                  </CardValue>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledCard gradientstart="#614385" gradientend="#516395">
                <CardContent>
                  <CardHeader>
                    <IconContainer>
                      <BookOnlineIcon sx={{ color: "white" }} />
                    </IconContainer>
                    <CardLabel variant="subtitle1">Total Bookings</CardLabel>
                  </CardHeader>
                  <CardValue variant="h3">
                    {data.totalBookings.toLocaleString()}
                  </CardValue>
                </CardContent>
              </StyledCard>
            </Grid>
            <Grid item xs={12} sm={4}>
              <StyledCard gradientstart="#2c3e50" gradientend="#fd746c">
                <CardContent>
                  <CardHeader>
                    <IconContainer>
                      <MiscellaneousServicesIcon sx={{ color: "white" }} />
                    </IconContainer>
                    <CardLabel variant="subtitle1">Active Services</CardLabel>
                  </CardHeader>
                  <CardValue variant="h3">
                    {data.activeServices.toLocaleString()}
                  </CardValue>
                </CardContent>
              </StyledCard>
            </Grid>
          </Grid>

          <ChartContainer>
            <Typography
              variant="h6"
              sx={{ mb: 2, fontWeight: 500, color: "#2c3e50" }}
            >
              Monthly Growth
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={data.monthlyStats}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  stroke={alpha("#000", 0.1)}
                />
                <XAxis dataKey="month" stroke="#2c3e50" />
                <YAxis stroke="#2c3e50" />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="users"
                  name="Users"
                  stroke="#4ca1af"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  name="Bookings"
                  stroke="#fd746c"
                  strokeWidth={2}
                  dot={{ r: 4, strokeWidth: 2 }}
                  activeDot={{ r: 6, strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </>
      )}
    </DashboardContainer>
  );
};

export default Dashboard;
