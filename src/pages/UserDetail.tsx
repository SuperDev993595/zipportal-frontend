import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Card,
  CardContent,
  Avatar,
  Chip,
  Button,
  CircularProgress,
  Alert,
  Divider,
} from '@mui/material';
import {
  ArrowBack as BackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { usersApi } from '../services/api';
import { User, Transaction } from '../types';

const UserDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      fetchUser();
    }
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await usersApi.getById(id!);
      setUser(response.data);
      setError(null);
    } catch (err) {
      setError('Failed to fetch user details');
      console.error('Error fetching user:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!user || !window.confirm('Are you sure you want to delete this user?')) return;

    try {
      await usersApi.delete(user.userId);
      navigate('/users');
    } catch (err) {
      setError('Failed to delete user');
      console.error('Error deleting user:', err);
    }
  };

  const transactionColumns: GridColDef[] = [
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      width: 180,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'bold',
            color: params.value >= 0 ? 'success.main' : 'error.main',
          }}
        >
          ${params.value.toFixed(2)}
        </Typography>
      ),
    },
    {
      field: 'type',
      headerName: 'Type',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={params.value === 'credit' ? 'success' : 'error'}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={
            params.value === 'completed' ? 'success' : 
            params.value === 'pending' ? 'warning' : 'error'
          }
          size="small"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error || !user) {
    return (
      <Alert severity="error">
        {error || 'User not found'}
      </Alert>
    );
  }

  return (
    <Box>
      {/* Header */}
      <Box display="flex" alignItems="center" mb={3}>
        <Button
          startIcon={<BackIcon />}
          onClick={() => navigate('/users')}
          sx={{ mr: 2 }}
        >
          Back to Users
        </Button>
        <Typography variant="h4" component="h1">
          User Details
        </Typography>
      </Box>

      {/* User Information */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Grid container spacing={3}>
          {/* Avatar Section */}
          <Grid item xs={12} md={3}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {user.avatar ? (
                <Avatar
                  src={`http://localhost:5000/uploads/${user.avatar}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}>
                  {user.name.charAt(0).toUpperCase()}
                </Avatar>
              )}
              <Box display="flex" gap={1}>
                <Button
                  variant="outlined"
                  startIcon={<EditIcon />}
                  onClick={() => console.log('Edit user:', user.userId)}
                >
                  Edit
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<DeleteIcon />}
                  onClick={handleDeleteUser}
                >
                  Delete
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* User Details */}
          <Grid item xs={12} md={9}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.userId}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Name
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.name}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Email
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.email}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Role
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.role || 'N/A'}
                </Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Status
                </Typography>
                <Chip
                  label={user.status || 'N/A'}
                  color={user.status === 'active' ? 'success' : 'default'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {new Date(user.createdAt).toLocaleDateString()}
                </Typography>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Paper>

      {/* Transactions Section */}
      <Paper sx={{ p: 3 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h5" component="h2">
            Transactions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {user.Transactions?.length || 0} transactions found
          </Typography>
        </Box>

        {user.Transactions && user.Transactions.length > 0 ? (
          <Box sx={{ height: 400, width: '100%' }}>
            <DataGrid
              rows={user.Transactions}
              columns={transactionColumns}
              pageSize={5}
              rowsPerPageOptions={[5, 10, 25]}
              disableSelectionOnClick
              getRowId={(row) => row.transactionId}
              sx={{
                '& .MuiDataGrid-cell:focus': {
                  outline: 'none',
                },
              }}
            />
          </Box>
        ) : (
          <Box textAlign="center" py={4}>
            <Typography variant="body1" color="text.secondary">
              No transactions found for this user.
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserDetail;
