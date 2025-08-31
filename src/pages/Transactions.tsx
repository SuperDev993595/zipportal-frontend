import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Paper,
  Alert,
  CircularProgress,
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
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

  const columns: GridColDef[] = [
    {
      field: 'reference',
      headerName: 'Reference',
      width: 250,
      sortable: true,
    },
    {
      field: 'amount',
      headerName: 'Amount',
      width: 120,
      sortable: true,
      renderCell: (params) => (
        <Typography
          variant="body2"
          sx={{
            fontWeight: 'bold',
            color: (parseFloat(params.value) || 0) >= 0 ? 'success.main' : 'error.main',
          }}
        >
          {(() => {
            const numValue = parseFloat(params.value);
            return !isNaN(numValue) ? numValue.toFixed(2) : '0.00';
          })()}
        </Typography>
      ),
    },
    {
      field: 'currency',
      headerName: 'Currency',
      width: 100,
      sortable: true,
    },
    {
      field: 'message',
      headerName: 'Message',
      width: 300,
      sortable: false,
    },
    {
      field: 'timestamp',
      headerName: 'Timestamp',
      width: 180,
      sortable: true,
      valueFormatter: (params: any) => new Date(params.value).toLocaleString(),
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
      <Typography variant="h4" component="h1" gutterBottom>
        Transactions
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        View all transaction records
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ height: 600, width: '100%' }}>
        <DataGrid
          rows={transactions}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 10 },
            },
          }}
          pageSizeOptions={[10, 25, 50]}
          getRowId={(row) => row.reference}
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
