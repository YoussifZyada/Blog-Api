import { useDispatch, useSelector } from 'react-redux';
import { AppBar, Toolbar, Typography, Button, Box, Avatar } from '@mui/material';
import { logout } from '../store/authSlice';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <AppBar position="sticky" elevation={0} sx={{ background: '#0a0a0a', borderBottom: '1px solid #2a2a2a' }}>
      <Toolbar sx={{ maxWidth: 1200, width: '100%', mx: 'auto' }}>
        <Typography
          variant="h5"
          component={Link}
          to="/"
          sx={{ flexGrow: 1, textDecoration: 'none', color: '#ff6b00', fontWeight: 'bold', letterSpacing: 1 }}
        >
          BlogApp
        </Typography>
        {user ? (
          <Box display="flex" gap={2} alignItems="center">
            <Button
              component={Link}
              to={`/profile/${user._id}`}
              sx={{ color: 'white', textTransform: 'none' }}
            >
              <Avatar sx={{ width: 32, height: 32, mr: 1, bgcolor: '#ff6b00', color: 'black', fontSize: '0.9rem', fontWeight: 'bold' }}>
                {user.username[0].toUpperCase()}
              </Avatar>
              <Typography variant="body2" sx={{ color: 'white' }}>@{user.username}</Typography>
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleLogout}
              sx={{ borderColor: '#ff6b00', color: '#ff6b00', '&:hover': { borderColor: '#ff8c33', bgcolor: 'rgba(255,107,0,0.1)' } }}
            >
              Logout
            </Button>
          </Box>
        ) : (
          <Box display="flex" gap={1}>
            <Button
              component={Link}
              to="/login"
              variant="outlined"
              sx={{ borderColor: '#ff6b00', color: '#ff6b00', '&:hover': { borderColor: '#ff8c33', bgcolor: 'rgba(255,107,0,0.1)' } }}
            >
              Login
            </Button>
            <Button
              component={Link}
              to="/register"
              variant="contained"
              sx={{ bgcolor: '#ff6b00', color: 'black', '&:hover': { bgcolor: '#ff8c33' } }}
            >
              Register
            </Button>
          </Box>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
