import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Chip,
} from '@mui/material';
import { DataGrid, GridColDef, GridActionsCellItem } from '@mui/x-data-grid';
import { Visibility as ViewIcon, Edit as EditIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { transactionsApi } from '../services/api';
import { Transaction } from '../types';

const Transactions: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const response = await transactionsApi.getAll();
      setTransactions(response.data || []);
      setError(null);
    } catch (err) {
      setError('Failed to fetch transactions');
      console.error('Error fetching transactions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteTransaction = async (transactionId: string) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      try {
        await transactionsApi.delete(transactionId);
        await fetchTransactions(); // Refresh the list
      } catch (err) {
        setError('Failed to delete transaction');
        console.error('Error deleting transaction:', err);
      }
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
        return 'success';
      case 'pending':
        return 'warning';
      case 'failed':
        return 'error';
      default:
        return 'default';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'credit':
        return 'success';
      case 'debit':
        return 'error';
      case 'transfer':
        return 'info';
      default:
        return 'default';
    }
  };

  const columns: GridColDef[] = [
    {
      field: 'transactionId',
      headerName: 'Transaction ID',
      width: 180,
      sortable: true,
    },
    {
      field: 'userId',
      headerName: 'User ID',
      width: 150,
      sortable: true,
    },
    {
      field: 'User.name',
      headerName: 'User Name',
      width: 200,
      sortable: true,
      valueGetter: (params) => params.row.User?.name || 'N/A',
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      sortable: true,
      type: 'number',
      valueFormatter: (params) => `$${params.value.toFixed(2)}`,
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
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getTypeColor(params.value) as any}
          size="small"
          variant="outlined"
        />
      ),
    },
    {
      field: 'status',
      headerName: 'Status',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Chip
          label={params.value}
          color={getStatusColor(params.value) as any}
          size="small"
        />
      ),
    },
    {
      field: 'description',
      headerName: 'Description',
      width: 250,
      sortable: false,
      renderCell: (params) => (
        <Typography variant="body2" noWrap>
          {params.value || 'No description'}
        </Typography>
      ),
    },
    {
      field: 'date',
      headerName: 'Date',
      width: 150,
      sortable: true,
      valueFormatter: (params) => new Date(params.value).toLocaleDateString(),
    },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      getActions: (params) => [
        <GridActionsCellItem
          icon={<ViewIcon />}
          label="View"
          onClick={() => console.log('View transaction:', params.row.transactionId)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Edit"
          onClick={() => console.log('Edit transaction:', params.row.transactionId)}
          color="primary"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => handleDeleteTransaction(params.row.transactionId)}
          color="error"
        />,
      ],
    },
  ];

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h4" component="h1">
          Transactions
        </Typography>
        <Button
          variant="contained"
          color="primary"
          onClick={() => window.location.href = '/upload'}
        >
          Upload New Data
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10, 25, 50]}
          disableSelectionOnClick
          getRowId={(row) => row.transactionId}
          sx={{
            '& .MuiDataGrid-cell:focus': {
              outline: 'none',
            },
          }}
        />
      </Paper>
    </Box>
  );
};

export default Transactions;
