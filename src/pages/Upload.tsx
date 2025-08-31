import React, { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import {
  Box,
  Typography,
  Paper,
  Button,
  Alert,
  CircularProgress,
  Card,
  CardContent,
  Stack,
} from '@mui/material';
import {
  CloudUpload as UploadIcon,
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
} from '@mui/icons-material';
import { uploadApi } from '../services/api';
import { UploadResponse } from '../types';

const Upload: React.FC = () => {
  const [uploading, setUploading] = useState(false);
  const [uploadResult, setUploadResult] = useState<UploadResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      if (file.type === 'application/zip' || file.name.endsWith('.zip')) {
        setSelectedFile(file);
        setError(null);
        setUploadResult(null);
      } else {
        setError('Please select a valid ZIP file');
        setSelectedFile(null);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/zip': ['.zip'],
      'application/x-zip-compressed': ['.zip'],
    },
    multiple: false,
  });

  const handleUpload = async () => {
    if (!selectedFile) return;

    try {
      setUploading(true);
      setError(null);
      
      const response = await uploadApi.uploadZip(selectedFile);
      setUploadResult(response.data);
      setSelectedFile(null);
    } catch (err: any) {
      setError(err.response?.data?.error || 'Upload failed. Please try again.');
      console.error('Upload error:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setUploadResult(null);
    setError(null);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" gutterBottom>
        Upload ZIP File
      </Typography>
      
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Upload a ZIP file containing userData.json, transactions.json, and optionally avatar.png
      </Typography>

      {/* File Upload Area */}
      <Paper
        {...getRootProps()}
        sx={{
          p: 4,
          textAlign: 'center',
          border: '2px dashed',
          borderColor: isDragActive ? 'primary.main' : 'grey.300',
          backgroundColor: isDragActive ? 'primary.50' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s',
          '&:hover': {
            borderColor: 'primary.main',
            backgroundColor: 'primary.50',
          },
        }}
      >
        <input {...getInputProps()} />
        <UploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
        
        {isDragActive ? (
          <Typography variant="h6" color="primary">
            Drop the ZIP file here...
          </Typography>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom>
              Drag & drop a ZIP file here, or click to select
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Supported format: .zip files containing userData.json, transactions.json, and avatar.png
            </Typography>
          </Box>
        )}
      </Paper>

      {/* Selected File Display */}
      {selectedFile && (
        <Card sx={{ mt: 3 }}>
          <CardContent>
            <Stack direction="row" alignItems="center" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ flex: 1, minWidth: 200 }}>
                <Typography variant="h6" gutterBottom>
                  Selected File
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                </Typography>
              </Box>
              <Box>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={handleUpload}
                  disabled={uploading}
                  startIcon={uploading ? <CircularProgress size={20} /> : <UploadIcon />}
                >
                  {uploading ? 'Uploading...' : 'Upload File'}
                </Button>
              </Box>
              <Box>
                <Button variant="outlined" onClick={handleClear}>
                  Clear
                </Button>
              </Box>
            </Stack>
          </CardContent>
        </Card>
      )}

      {/* Error Display */}
      {error && (
        <Alert severity="error" sx={{ mt: 3 }}>
          {error}
        </Alert>
      )}

      {/* Success Result */}
      {uploadResult && (
        <Card sx={{ mt: 3, backgroundColor: 'success.50' }}>
          <CardContent>
            <Box display="flex" alignItems="center" mb={2}>
              <SuccessIcon sx={{ color: 'success.main', mr: 1 }} />
              <Typography variant="h6" color="success.main">
                Upload Successful!
              </Typography>
            </Box>
            
            <Stack direction="row" spacing={2} sx={{ flexWrap: 'wrap' }}>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(33.33% - 16px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  User Processed
                </Typography>
                <Typography variant="h6" color="success.main">
                  {uploadResult.userProcessed ? 'Yes' : 'No'}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(33.33% - 16px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Transactions Processed
                </Typography>
                <Typography variant="h6" color="success.main">
                  {uploadResult.transactionsProcessed}
                </Typography>
              </Box>
              <Box sx={{ minWidth: { xs: '100%', sm: 'calc(33.33% - 16px)' } }}>
                <Typography variant="body2" color="text.secondary">
                  Avatar Processed
                </Typography>
                <Typography variant="h6" color="success.main">
                  {uploadResult.avatarProcessed ? 'Yes' : 'No'}
                </Typography>
              </Box>
            </Stack>
            
            <Typography variant="body2" sx={{ mt: 2 }}>
              {uploadResult.message}
            </Typography>
          </CardContent>
        </Card>
      )}

      {/* Instructions */}
      <Card sx={{ mt: 4 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            ZIP File Requirements
          </Typography>
          <Typography variant="body2" color="text.secondary" paragraph>
            Your ZIP file must contain the following files:
          </Typography>
          <Box component="ul" sx={{ pl: 2 }}>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>userData.json</strong> - Single user object with firstName, lastName, birthday, country, and phone
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>transactions.json</strong> - Array of transaction objects with reference, amount, currency, message, and timestamp
            </Typography>
            <Typography component="li" variant="body2" color="text.secondary">
              <strong>avatar.png</strong> - User avatar image (optional)
            </Typography>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};

export default Upload;
