import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Stack,
  Card,
  CardContent,
  Typography,
  Box,
  Button,
  Paper,
} from '@mui/material';
import {
  People as PeopleIcon,
  Receipt as ReceiptIcon,
  CloudUpload as UploadIcon,
  TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';
import { usersApi, transactionsApi } from '../services/api';
import { User, Transaction } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTransactions: 0,
    totalAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [usersResponse, transactionsResponse] = await Promise.all([
          usersApi.getAll(),
          transactionsApi.getAll(),
        ]);

        const users = usersResponse.data || [];
        const transactions = transactionsResponse.data || [];
        const totalAmount = transactions.reduce((sum, t) => sum + t.amount, 0);

        setStats({
          totalUsers: users.length,
          totalTransactions: transactions.length,
          totalAmount,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics');
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const dashboardCards = [
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 40, color: 'primary.main' }} />,
      color: '#e3f2fd',
      path: '/users',
    },
    {
      title: 'Total Transactions',
      value: stats.totalTransactions,
      icon: <ReceiptIcon sx={{ fontSize: 40, color: 'secondary.main' }} />,
      color: '#fce4ec',
      path: '/transactions',
    },
    {
      title: 'Total Amount',
      value: `$${stats.totalAmount.toLocaleString()}`,
      icon: <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main' }} />,
      color: '#e8f5e8',
      path: '/transactions',
    },
  ];

  const quickActions = [
    {
      title: 'View Users',
      description: 'Browse and manage user data',
      icon: <PeopleIcon />,
      path: '/users',
      color: 'primary',
    },
    {
      title: 'View Transactions',
      description: 'Monitor transaction history',
      icon: <ReceiptIcon />,
      path: '/transactions',
      color: 'secondary',
    },
    {
      title: 'Upload ZIP',
      description: 'Import new data from ZIP files',
      icon: <UploadIcon />,
      path: '/upload',
      color: 'success',
    },
  ];

  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6">Loading dashboard...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography variant="h6" color="error" gutterBottom>
          {error}
        </Typography>
        <Button variant="contained" onClick={() => window.location.reload()}>
          Retry
        </Button>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Stats Cards */}
      <Stack direction="row" spacing={3} sx={{ mb: 4, flexWrap: 'wrap' }}>
        {dashboardCards.map((card, index) => (
          <Box key={index} sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Card 
              sx={{ 
                height: '100%',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
              }}
              onClick={() => navigate(card.path)}
            >
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                  {card.icon}
                  <Box sx={{ ml: 2 }}>
                    <Typography variant="h4" component="div" fontWeight="bold">
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Stack>

      {/* Quick Actions */}
      <Typography variant="h5" component="h2" gutterBottom sx={{ mt: 4 }}>
        Quick Actions
      </Typography>
      
      <Stack direction="row" spacing={3} sx={{ flexWrap: 'wrap' }}>
        {quickActions.map((action, index) => (
          <Box key={index} sx={{ minWidth: { xs: '100%', sm: 'calc(50% - 12px)', md: 'calc(33.33% - 16px)' } }}>
            <Paper 
              sx={{ 
                p: 3, 
                textAlign: 'center',
                cursor: 'pointer',
                '&:hover': { transform: 'translateY(-2px)', transition: 'transform 0.2s' }
              }}
              onClick={() => navigate(action.path)}
            >
              <Box sx={{ mb: 2 }}>
                {React.cloneElement(action.icon, { 
                  sx: { fontSize: 48, color: `${action.color}.main` } 
                })}
              </Box>
              <Typography variant="h6" component="h3" gutterBottom>
                {action.title}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {action.description}
              </Typography>
            </Paper>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default Dashboard;
