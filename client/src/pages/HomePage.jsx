import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Container, Typography, Box, TextField, Button, CircularProgress, Paper } from '@mui/material';
import { setPosts, addPost } from '../store/postsSlice';
import { postAPI } from '../api/api';
import PostCard from '../components/PostCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const { posts } = useSelector((state) => state.posts);
  const { user } = useSelector((state) => state.auth);
  const [newPost, setNewPost] = useState('');
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const data = await postAPI.getAll();
        dispatch(setPosts(data));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [dispatch]);

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    setPosting(true);
    try {
      const post = await postAPI.create({ content: newPost });
      dispatch(addPost(post));
      setNewPost('');
    } catch (err) {
      alert(err.message);
    } finally {
      setPosting(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#0a0a0a', py: 4 }}>
      <Container maxWidth="md">
        {user && (
          <Paper
            elevation={3}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              background: '#1a1a1a',
              border: '1px solid #2a2a2a',
            }}
          >
            <Typography variant="h6" mb={2} sx={{ color: '#ff6b00' }}>
              Create Post
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="What's on your mind?"
              value={newPost}
              onChange={(e) => setNewPost(e.target.value)}
              sx={{
                mb: 2,
                '& .MuiOutlinedInput-root': {
                  '& fieldset': { borderColor: '#333' },
                  '&:hover fieldset': { borderColor: '#ff6b00' },
                },
              }}
            />
            <Button
              variant="contained"
              onClick={handleCreatePost}
              disabled={posting || !newPost.trim()}
              sx={{ borderRadius: 2, bgcolor: '#ff6b00', color: 'black', '&:hover': { bgcolor: '#ff8c33' } }}
            >
              {posting ? <CircularProgress size={24} color="inherit" /> : 'Post'}
            </Button>
          </Paper>
        )}

        {!user && (
          <Paper
            elevation={1}
            sx={{
              p: 3,
              mb: 4,
              borderRadius: 2,
              textAlign: 'center',
              bgcolor: '#1a1a1a',
              border: '1px solid #2a2a2a',
            }}
          >
            <Typography variant="h6" sx={{ color: '#b0b0b0' }}>
              Welcome to BlogApp! Please{' '}
              <a href="/login" style={{ color: '#ff6b00' }}>login</a> or{' '}
              <a href="/register" style={{ color: '#ff6b00' }}>register</a> to create posts.
            </Typography>
          </Paper>
        )}

        <Typography variant="h5" mb={3} fontWeight="bold" sx={{ color: '#ff6b00' }}>
          Latest Posts
        </Typography>

        {loading ? (
          <Box display="flex" justifyContent="center" py={8}>
            <CircularProgress sx={{ color: '#ff6b00' }} />
          </Box>
        ) : posts.length === 0 ? (
          <Paper elevation={1} sx={{ p: 4, textAlign: 'center', borderRadius: 2, bgcolor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
            <Typography sx={{ color: '#b0b0b0' }}>No posts yet. Be the first to post!</Typography>
          </Paper>
        ) : (
          posts.map((post) => <PostCard key={post._id} post={post} />)
        )}
      </Container>
    </Box>
  );
};

export default HomePage;
