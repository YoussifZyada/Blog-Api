import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Button, CircularProgress, Avatar, Paper, Chip } from '@mui/material';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PersonRemoveIcon from '@mui/icons-material/PersonRemove';
import useUserStore from '../zustand/useUserStore';
import { userAPI } from '../api/api';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const ProfilePage = () => {
  const { id } = useParams();
  const { profile, loading, setProfile, setLoading } = useUserStore();
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const data = await userAPI.getProfile(id);
        setProfile(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id, setProfile, setLoading]);

  const handleFollow = async () => {
    if (!user) return alert('Please login');
    try {
      await userAPI.follow(id);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleUnfollow = async () => {
    try {
      await userAPI.unfollow(id);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
        <CircularProgress sx={{ color: '#ff6b00' }} />
      </Box>
    );
  }

  if (!profile) return <Typography sx={{ color: '#fff' }}>User not found</Typography>;

  const isFollowing = user && profile.following?.some(f => f._id === user._id);
  const isSelf = user && user._id === id;

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', py: 4 }}>
      <Container maxWidth="md">
        <Paper elevation={2} sx={{ p: 4, borderRadius: 2, background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <Box display="flex" alignItems="center" gap={3} mb={3}>
            <Avatar sx={{ width: 90, height: 90, bgcolor: '#ff6b00', color: 'black', fontSize: '2.5rem', fontWeight: 'bold' }}>
              {profile.username?.[0]?.toUpperCase()}
            </Avatar>
            <Box flex={1}>
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#fff' }}>@{profile.username}</Typography>
              <Typography variant="body1" sx={{ color: '#b0b0b0' }}>{profile.email}</Typography>
            </Box>
            {!isSelf && user && (
              isFollowing ? (
                <Button
                  variant="outlined"
                  startIcon={<PersonRemoveIcon />}
                  onClick={handleUnfollow}
                  sx={{ borderColor: '#ff6b00', color: '#ff6b00', borderRadius: 2, '&:hover': { borderColor: '#ff8c33', bgcolor: 'rgba(255,107,0,0.1)' } }}
                >
                  Unfollow
                </Button>
              ) : (
                <Button
                  variant="contained"
                  startIcon={<PersonAddIcon />}
                  onClick={handleFollow}
                  sx={{ borderRadius: 2, bgcolor: '#ff6b00', color: 'black', '&:hover': { bgcolor: '#ff8c33' } }}
                >
                  Follow
                </Button>
              )
            )}
          </Box>

          <Box display="flex" gap={4} sx={{ borderTop: '1px solid #2a2a2a', pt: 2 }}>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff6b00' }}>{profile.followers?.length || 0}</Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Followers</Typography>
            </Box>
            <Box textAlign="center">
              <Typography variant="h4" fontWeight="bold" sx={{ color: '#ff6b00' }}>{profile.following?.length || 0}</Typography>
              <Typography variant="body2" sx={{ color: '#b0b0b0' }}>Following</Typography>
            </Box>
          </Box>
        </Paper>

        <Typography variant="h6" mt={4} mb={2} fontWeight="bold" sx={{ color: '#ff6b00' }}>Followers</Typography>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {profile.followers?.map((f) => (
              <Chip
                key={f._id}
                component={Link}
                to={`/profile/${f._id}`}
                label={`@${f.username}`}
                clickable
                sx={{ bgcolor: '#2a2a2a', color: '#ff6b00', '&:hover': { bgcolor: 'rgba(255,107,0,0.2)' } }}
              />
            ))}
            {(!profile.followers || profile.followers.length === 0) && (
              <Typography sx={{ color: '#b0b0b0' }}>No followers yet</Typography>
            )}
          </Box>
        </Paper>

        <Typography variant="h6" mt={3} mb={2} fontWeight="bold" sx={{ color: '#ff6b00' }}>Following</Typography>
        <Paper elevation={1} sx={{ p: 2, borderRadius: 2, background: '#1a1a1a', border: '1px solid #2a2a2a' }}>
          <Box display="flex" flexWrap="wrap" gap={1}>
            {profile.following?.map((f) => (
              <Chip
                key={f._id}
                component={Link}
                to={`/profile/${f._id}`}
                label={`@${f.username}`}
                clickable
                sx={{ bgcolor: '#2a2a2a', color: '#ff8c33', '&:hover': { bgcolor: 'rgba(255,140,51,0.2)' } }}
              />
            ))}
            {(!profile.following || profile.following.length === 0) && (
              <Typography sx={{ color: '#b0b0b0' }}>Not following anyone</Typography>
            )}
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default ProfilePage;
