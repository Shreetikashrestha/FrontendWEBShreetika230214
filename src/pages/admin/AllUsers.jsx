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
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import PersonIcon from "@mui/icons-material/Person";

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

const AllUser = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("accessToken");
      if (!token) {
        console.error("No token found in local storage");
        setLoading(false);
        return;
      }
      const { data } = await axios.get("http://localhost:8080/api/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(data.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (id) => {
    try {
      const token = localStorage.getItem("accessToken");
      await axios.delete(`http://localhost:8080/api/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(users.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Failed to delete user", error);
    }
  };

  return (
    <StyledContainer>
      <StyledTitle variant="h4">
        <PersonIcon sx={{ mr: 1, verticalAlign: "middle" }} />
        User Management
      </StyledTitle>

      <StyledPaper>
        <StyledTableContainer>
          <Table>
            <StyledTableHead>
              <TableRow>
                <TableCell>ID</TableCell>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </StyledTableHead>
            <TableBody>
              {users.map((user) => (
                <TableRow
                  key={user.id}
                  sx={{
                    "&:hover": {
                      backgroundColor: alpha("#fd746c", 0.05),
                    },
                  }}
                >
                  <TableCell>
                    <Chip
                      label={user.id}
                      size="small"
                      sx={{
                        bgcolor: alpha("#2c3e50", 0.1),
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell align="center">
                    <IconButton
                      color="error"
                      onClick={() => deleteUser(user.id)}
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
              {users.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={4} align="center" sx={{ py: 3 }}>
                    <Typography variant="body1" color="textSecondary">
                      No users found
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </StyledTableContainer>
      </StyledPaper>
    </StyledContainer>
  );
};

export default AllUser;
