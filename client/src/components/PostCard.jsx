import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Card, CardContent, Typography, IconButton, Box, TextField, Button, Avatar, Chip, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import ShareIcon from '@mui/icons-material/Share';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { postAPI } from '../api/api';
import { updatePost, removePost } from '../store/postsSlice';
import { Link } from 'react-router-dom';

const PostCard = ({ post }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(post.content);
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [shareDialog, setShareDialog] = useState(false);

  const isOwner = user && post.user && post.user._id === user._id;
  const isLiked = user && post.likes?.includes(user._id);

  const handleLike = async () => {
    if (!user) return;
    try {
      await postAPI.like(post._id);
      window.location.reload();
    } catch (err) {
      alert(err.message);
    }
  };

  const handleShare = async () => {
    if (!user) return;
    setShareDialog(true);
  };

  const confirmShare = async () => {
    try {
      await postAPI.share(post._id);
      setShareDialog(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleEdit = async () => {
    try {
      const updated = await postAPI.update(post._id, { content: editContent });
      dispatch(updatePost(updated));
      setEditing(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async () => {
    setDeleteDialog(true);
  };

  const confirmDelete = async () => {
    try {
      await postAPI.delete(post._id);
      dispatch(removePost(post._id));
      setDeleteDialog(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const timeAgo = (date) => {
    const now = new Date();
    const created = new Date(date);
    const diff = Math.floor((now - created) / 1000);
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  return (
    <>
      <Card sx={{ mb: 2.5, borderRadius: 2, boxShadow: '0 2px 8px rgba(255,107,0,0.1)', bgcolor: '#1a1a1a', border: '1px solid #2a2a2a' }}>
        <CardContent sx={{ pb: '16px !important' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1.5}>
            <Box display="flex" alignItems="center" gap={1.5}>
              <Avatar
                component={Link}
                to={`/profile/${post.user?._id}`}
                sx={{ width: 44, height: 44, bgcolor: '#ff6b00', color: 'black', cursor: 'pointer', textDecoration: 'none', fontWeight: 'bold' }}
              >
                {post.user?.username?.[0]?.toUpperCase() || '?'}
              </Avatar>
              <Box>
                <Typography
                  component={Link}
                  to={`/profile/${post.user?._id}`}
                  variant="subtitle1"
                  fontWeight="bold"
                  sx={{ color: '#ffffff', textDecoration: 'none', '&:hover': { color: '#ff6b00' } }}
                >
                  @{post.user?.username || 'Unknown'}
                </Typography>
                <Typography variant="caption" sx={{ color: '#666' }}>
                  {timeAgo(post.createdAt)}
                </Typography>
              </Box>
            </Box>
            {isOwner && (
              <Box>
                <IconButton size="small" onClick={() => setEditing(true)} sx={{ color: '#ff6b00' }}>
                  <EditIcon fontSize="small" />
                </IconButton>
                <IconButton size="small" onClick={handleDelete} sx={{ color: '#f44336' }}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            )}
          </Box>

          {editing ? (
            <Box mb={2}>
              <TextField
                fullWidth
                multiline
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                sx={{
                  mb: 1,
                  '& .MuiOutlinedInput-root': {
                    '& fieldset': { borderColor: '#333' },
                  },
                }}
              />
              <Box display="flex" gap={1}>
                <Button size="small" variant="contained" onClick={handleEdit} sx={{ bgcolor: '#ff6b00', color: 'black' }}>Save</Button>
                <Button size="small" onClick={() => setEditing(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
              </Box>
            </Box>
          ) : (
            <Typography variant="body1" mb={2} sx={{ lineHeight: 1.7, color: '#e0e0e0' }}>
              {post.content}
            </Typography>
          )}

          <Box display="flex" alignItems="center" gap={0.5} sx={{ borderTop: '1px solid #2a2a2a', pt: 1.5 }}>
            <IconButton
              size="small"
              onClick={handleLike}
              sx={{
                color: isLiked ? '#ff6b00' : '#666',
                '&:hover': { color: '#ff6b00', bgcolor: 'rgba(255,107,0,0.1)' }
              }}
            >
              <ThumbUpIcon fontSize="small" />
            </IconButton>
            <Chip
              label={post.likes?.length || 0}
              size="small"
              sx={{ height: 24, fontSize: '0.75rem', bgcolor: isLiked ? 'rgba(255,107,0,0.2)' : '#2a2a2a', color: isLiked ? '#ff6b00' : '#b0b0b0' }}
            />
            <IconButton
              size="small"
              onClick={handleShare}
              sx={{ ml: 1, color: '#666', '&:hover': { color: '#ff6b00', bgcolor: 'rgba(255,107,0,0.1)' } }}
            >
              <ShareIcon fontSize="small" />
            </IconButton>
            <Chip
              label={post.shares?.length || 0}
              size="small"
              sx={{ height: 24, fontSize: '0.75rem', bgcolor: '#2a2a2a', color: '#b0b0b0' }}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialog} onClose={() => setDeleteDialog(false)} PaperProps={{ sx: { bgcolor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 2 } }}>
        <DialogTitle sx={{ color: '#f44336' }}>Delete Post</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#b0b0b0' }}>Are you sure you want to delete this post? This action cannot be undone.</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialog(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
          <Button onClick={confirmDelete} sx={{ bgcolor: '#f44336', color: 'white', '&:hover': { bgcolor: '#d32f2f' } }}>Delete</Button>
        </DialogActions>
      </Dialog>

      {/* Share Confirmation Dialog */}
      <Dialog open={shareDialog} onClose={() => setShareDialog(false)} PaperProps={{ sx: { bgcolor: '#1a1a1a', border: '1px solid #2a2a2a', borderRadius: 2 } }}>
        <DialogTitle sx={{ color: '#ff6b00' }}>Share Post</DialogTitle>
        <DialogContent>
          <Typography sx={{ color: '#b0b0b0' }}>Do you want to share this post?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShareDialog(false)} sx={{ color: '#b0b0b0' }}>Cancel</Button>
          <Button onClick={confirmShare} sx={{ bgcolor: '#ff6b00', color: 'black', '&:hover': { bgcolor: '#ff8c33' } }}>Share</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PostCard;
