import React, { useState, useEffect } from 'react';
import { Avatar, Box, CircularProgress, Typography, Button, TextField, Paper, Stack, IconButton, Snackbar, Alert, AlertColor } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useUserMetadata } from '../common/findUser';
import { updateUserProfile } from '../services/userService'; // Import the update function

const ProfilePage = () => {
  const { userMetadata, loading, refetch } = useUserMetadata();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");

  // Populate state when userMetadata loads or changes
  useEffect(() => {
    if (userMetadata) {
      setDisplayName(userMetadata.displayName || '');
      setDescription(userMetadata.description || '');
    }
  }, [userMetadata]);

  const handleEditToggle = () => {
    if (isEditing) {
      // If cancelling, reset fields to original values
      if (userMetadata) {
        setDisplayName(userMetadata.displayName || '');
        setDescription(userMetadata.description || '');
      }
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    if (!userMetadata) return;

    const updatedData: Partial<Pick<User, 'displayName' | 'description'>> = {};
    if (displayName !== userMetadata.displayName) {
      updatedData.displayName = displayName;
    }
    if (description !== userMetadata.description) {
      updatedData.description = description;
    }

    if (Object.keys(updatedData).length === 0) {
      setIsEditing(false); // No changes, just exit edit mode
      return;
    }

    try {
      await updateUserProfile(userMetadata.uid, updatedData);
      setSnackbarMessage("Profile updated successfully!");
      setSnackbarSeverity("success");
      await refetch(); // Refetch data to show updated info
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Failed to update profile:", error);
      setSnackbarMessage("Failed to update profile.");
      setSnackbarSeverity("error");
    } finally {
        setSnackbarOpen(true);
    }
  };

   const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!userMetadata) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <Typography variant="h6" color="text.secondary">Please log in to view your profile.</Typography>
      </Box>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: { xs: 2, md: 4 } }}>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={4} alignItems="center">
          {/* Avatar Section */}
          <Box sx={{ position: 'relative' }}>
            <Avatar
              sx={{ width: 120, height: 120, mb: { xs: 2, sm: 0 } }}
              src={userMetadata.photoURL || undefined}
              alt={userMetadata.displayName || userMetadata.email}
            >
              {!userMetadata.photoURL ? (userMetadata.displayName?.[0] || userMetadata.email?.[0])?.toUpperCase() : null}
            </Avatar>
            {/* Add Photo Upload Button (Optional Feature) */}
            
            {isEditing && (
              <IconButton size="small" sx={{ position: 'absolute', bottom: 0, right: 0, bgcolor: 'background.paper' }}>
                <EditIcon fontSize="small" />
              </IconButton>
            )}
            
          </Box>

          {/* Details Section */}
          <Stack spacing={2} sx={{ flexGrow: 1, width: '100%' }}>
            {isEditing ? (
              <>
                <TextField
                  label="Display Name"
                  variant="outlined"
                  fullWidth
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                />
                <Typography variant="body1" color="text.secondary">
                  Email: {userMetadata.email} (cannot be changed)
                </Typography>
                <TextField
                  label="About Me"
                  variant="outlined"
                  fullWidth
                  multiline
                  rows={3}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us a little about yourself..."
                />
              </>
            ) : (
              <>
                <Typography variant="h4" component="h1" fontWeight={600}>
                  {userMetadata.displayName || 'No Name Set'}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  {userMetadata.email}
                </Typography>
                <Typography variant="body1" sx={{ minHeight: '3em', fontStyle: description ? 'normal' : 'italic', color: description ? 'text.primary' : 'text.secondary' }}>
                  {description || 'No description provided.'}
                </Typography>
              </>
            )}

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, pt: 1 }}>
              {isEditing ? (
                <>
                  <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleEditToggle}>
                    Cancel
                  </Button>
                  <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                    Save Changes
                  </Button>
                </>
              ) : (
                <Button variant="contained" startIcon={<EditIcon />} onClick={handleEditToggle}>
                  Edit Profile
                </Button>
              )}
            </Box>
          </Stack>
        </Stack>
      </Paper>

       {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert
          onClose={handleSnackbarClose}
          severity={snackbarSeverity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Container>
  );
};

// Need to import Container if not already imported
import { Container } from '@mui/material';

export default ProfilePage;