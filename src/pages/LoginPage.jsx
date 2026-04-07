import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  TextField,
  Button,
  Typography,
  IconButton,
  InputAdornment,
  Alert,
  CircularProgress,
} from '@mui/material';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import { loginUser, clearError } from '../store/slices/authSlice';

export default function LoginPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, token } = useSelector((s) => s.auth);

  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: '', password: '' });
  const [localError, setLocalError] = useState('');

  // Redirect if already logged in
  useEffect(() => {
    if (token) navigate('/dashboard', { replace: true });
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError('');
    if (!form.email || !form.password) {
      setLocalError('Please fill in all fields.');
      return;
    }
    const result = await dispatch(loginUser(form));
    if (loginUser.fulfilled.match(result)) {
      navigate('/dashboard', { replace: true });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8fafc] p-4">
      <Box
        sx={{
          width: '100%',
          maxWidth: 440,
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
          p: 4,
          borderRadius: 4,
          boxShadow:
            '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
          border: '1px solid #e2e8f0',
        }}
      >
        {/* Header */}
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-3xl font-bold text-[#1e293b]">Inventory</h1>
          <p className="text-[#64748b]">
            Securely access your system insights.
          </p>
        </div>

        {/* Error Display */}
        {(localError || error) && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
            {localError || error}
          </Alert>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#475569', ml: 0.5 }}
            >
              User Name
            </Typography>
            <TextField
              fullWidth
              placeholder="Enter your User Name"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              sx={inputStyles}
            />
          </div>

          <div className="space-y-1.5">
            <Typography
              variant="body2"
              sx={{ fontWeight: 600, color: '#475569', ml: 0.5 }}
            >
              Password
            </Typography>
            <TextField
              fullWidth
              type={showPass ? 'text' : 'password'}
              placeholder="Enter your password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={() => setShowPass(!showPass)}
                      edge="end"
                    >
                      {showPass ? (
                        <VisibilityOffIcon fontSize="small" />
                      ) : (
                        <VisibilityIcon fontSize="small" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={inputStyles}
            />
          </div>

          <div className="text-right">
            <button
              type="button"
              className="text-sm text-blue-600 hover:underline font-medium"
            >
              Forgot Password?
            </button>
          </div>

          <Button
            fullWidth
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              fontSize: '1rem',
              backgroundColor: '#1e293b',
              '&:hover': { backgroundColor: '#0f172a' },
              boxShadow: 'none',
            }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Login'}
          </Button>
        </form>

        <p className="text-center text-sm text-[#64748b] mt-8">
          Don't have an account?{' '}
          <button className="text-blue-600 hover:underline font-semibold ml-1">
            Sign Up
          </button>
        </p>
      </Box>
    </div>
  );
}

const inputStyles = {
  '& .MuiOutlinedInput-root': {
    borderRadius: 2,
    backgroundColor: '#fff',
    '& fieldset': { borderColor: '#e2e8f0' },
    '&:hover fieldset': { borderColor: '#cbd5e1' },
    '&.Mui-focused fieldset': { borderColor: '#1e293b' },
  },
};
