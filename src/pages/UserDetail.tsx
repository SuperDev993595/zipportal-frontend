import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Paper,
  Stack,
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
} from '@mui/icons-material';
import { usersApi } from '../services/api';
import { User } from '../types';

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
        <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
          {/* Avatar Section */}
          <Box sx={{ minWidth: { xs: '100%', md: 'calc(25% - 18px)' } }}>
            <Box display="flex" flexDirection="column" alignItems="center">
              {user.avatar ? (
                <Avatar
                  src={`${process.env.REACT_APP_UPLOAD_URL || 'http://31.97.183.104:5000/uploads'}/${user.avatar}`}
                  sx={{ width: 120, height: 120, mb: 2 }}
                />
              ) : (
                <Avatar sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}>
                  {user.firstName.charAt(0).toUpperCase()}
                </Avatar>
              )}
              
            </Box>
          </Box>

          {/* User Details */}
          <Box sx={{ minWidth: { xs: '100%', md: 'calc(75% - 18px)' } }}>
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  User ID
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.userId}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  First Name
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.firstName}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Last Name
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.lastName}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Birthday
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.birthday ? (() => {
                    try {
                      const date = new Date(user.birthday);
                      if (isNaN(date.getTime())) return 'Invalid Date';
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    } catch (error) {
                      return 'Invalid Date';
                    }
                  })() : 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Country
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.country || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Phone
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {user.phone || 'N/A'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 8px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Created
                </Typography>
                <Typography variant="h6" gutterBottom>
                  {(() => {
                    try {
                      const date = new Date(user.createdAt);
                      if (isNaN(date.getTime())) return 'Invalid Date';
                      return date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      });
                    } catch (error) {
                      return 'Invalid Date';
                    }
                  })()}
                </Typography>
              </Box>
            </Stack>
          </Box>
        </Stack>
      </Paper>

      {/* Note about Transactions */}
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Transactions
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Transactions are now stored independently and can be viewed on the Transactions page.
        </Typography>
        <Button
          variant="outlined"
          onClick={() => navigate('/transactions')}
          sx={{ mt: 2 }}
        >
          View All Transactions
        </Button>
      </Paper>
    </Box>
  );
};

export default UserDetail;
