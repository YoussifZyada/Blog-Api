import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Box, TextField, Button, Typography, Paper, Alert, CircularProgress } from '@mui/material';
import { setCredentials } from '../store/authSlice';
import { authAPI } from '../api/api';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const data = await authAPI.register(form);
      dispatch(setCredentials({ user: { _id: data._id, username: data.username, email: data.email, avatar: data.avatar }, token: data.token }));
      navigate('/');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 50%, #0a0a0a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Paper
        elevation={8}
        sx={{
          p: 5,
          maxWidth: 420,
          width: '100%',
          borderRadius: 3,
          background: '#1a1a1a',
          border: '1px solid #2a2a2a',
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          textAlign="center"
          mb={1}
          sx={{ color: '#ff6b00' }}
        >
          Create Account
        </Typography>
        <Typography variant="body2" textAlign="center" mb={3} sx={{ color: '#b0b0b0' }}>
          Join our blog community today
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2, bgcolor: '#2a1a1a', border: '1px solid #f44336' }}>{error}</Alert>}

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            name="username"
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#ff6b00' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Email"
            name="email"
            type="email"
            onChange={handleChange}
            margin="normal"
            required
            sx={{
              mb: 1,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#ff6b00' },
              },
            }}
          />
          <TextField
            fullWidth
            label="Password"
            name="password"
            type="password"
            onChange={handleChange}
            margin="normal"
            required
            helperText="At least 6 characters"
            sx={{
              mb: 2,
              '& .MuiOutlinedInput-root': {
                '& fieldset': { borderColor: '#333' },
                '&:hover fieldset': { borderColor: '#ff6b00' },
              },
            }}
          />
          <Button
            fullWidth
            variant="contained"
            type="submit"
            disabled={loading}
            size="large"
            sx={{ mt: 1, py: 1.5, borderRadius: 2, fontSize: '1rem', bgcolor: '#ff6b00', color: 'black', '&:hover': { bgcolor: '#ff8c33' } }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : 'Sign Up'}
          </Button>
        </form>

        <Typography variant="body2" textAlign="center" mt={3} sx={{ color: '#b0b0b0' }}>
          Already have an account?{' '}
          <a href="/login" style={{ color: '#ff6b00', textDecoration: 'none', fontWeight: 'bold' }}>Sign In</a>
        </Typography>
      </Paper>
    </Box>
  );
};

export default RegisterPage;
