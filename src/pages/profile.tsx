import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Avatar, Box, CircularProgress, Typography, Button, TextField, Paper, Stack, IconButton, Snackbar, Alert, AlertColor, Divider, Chip, Container } from '@mui/material';
import { Grid } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import PeopleIcon from '@mui/icons-material/People';
import { useUserMetadata } from '../common/findUser';
import { updateUserProfile, uploadProfilePhoto } from '../services/userService';
import { User } from '../common/interfaces';
import { findUserById } from '../common/findUser';

const ProfilePage = () => {
  const { userMetadata, loading, refetch } = useUserMetadata();
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');
  const [description, setDescription] = useState('');
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [friends, setFriends] = useState<User[]>([]);
  const [loadingFriends, setLoadingFriends] = useState(false);

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");

  // Function to fetch friends data
  const fetchFriends = useCallback(async () => {
    if (userMetadata?.friends && userMetadata.friends.length > 0) {
      setLoadingFriends(true);
      try {
        const friendPromises = userMetadata.friends.map(friendId => findUserById(friendId));
        const friendData = await Promise.all(friendPromises);
        setFriends(friendData.filter((friend): friend is User => friend !== null));
      } catch (error) {
        console.error("Error fetching friends:", error);
        setSnackbarMessage('Error fetching friends list.');
        setSnackbarSeverity('error');
        setSnackbarOpen(true);
      } finally {
        setLoadingFriends(false);
      }
    } else {
      setFriends([]);
    }
  }, [userMetadata?.friends]);

  // Populate state when userMetadata loads or changes
  useEffect(() => {
    if (userMetadata) {
      setDisplayName(userMetadata.displayName || '');
      setDescription(userMetadata.description || '');
      fetchFriends();
    }
  }, [userMetadata, fetchFriends]);

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

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || !event.target.files[0] || !userMetadata) {
      return;
    }

    const file = event.target.files[0];

    try {
      setUploadingPhoto(true);
      // Upload the photo and get the URL
      const photoURL = await uploadProfilePhoto(file, userMetadata.uid);

      // Update the user's profile with the new photo URL
      await updateUserProfile(userMetadata.uid, { photoURL });

      // Show success message
      setSnackbarMessage("Profile photo updated successfully!");
      setSnackbarSeverity("success");
      setSnackbarOpen(true);

      // Refresh user data
      await refetch();
    } catch (error) {
      console.error("Failed to upload profile photo:", error);
      setSnackbarMessage("Failed to upload profile photo.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    } finally {
      setUploadingPhoto(false);

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
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

  const handleSnackbarClose = (_event?: React.SyntheticEvent | Event, reason?: string) => {
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
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Flex container for side-by-side layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 3,
        }}
      >
        {/* Profile card - Left side */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, md: 4 }, 
            flex: { xs: '1 1 100%', md: '3 1 60%' },
            mb: { xs: 3, md: 0 },
            display: 'flex',
            justifyContent: 'center', // Center content horizontally
            alignItems: 'center' // Center content vertically
          }}
        >
          <Stack 
            direction={{ xs: 'column', sm: 'row' }} 
            spacing={4} 
            alignItems="center"
            sx={{ maxWidth: '90%' }} // Limit width for better centering
          >
            {/* Avatar Section */}
            <Box sx={{ position: 'relative' }}>
              <Avatar
                sx={{
                  width: 120,
                  height: 120,
                  mb: { xs: 2, sm: 0 },
                  border: '4px solid',
                  borderColor: 'background.paper'
                }}
                src={userMetadata?.photoURL || undefined}
                alt={userMetadata?.displayName || userMetadata?.email || ''}
              >
                {!userMetadata?.photoURL ? (userMetadata?.displayName?.[0] || userMetadata?.email?.[0])?.toUpperCase() : null}
              </Avatar>

              {/* Hidden file input for photo upload */}
              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                style={{ display: 'none' }}
                onChange={handlePhotoUpload}
              />

              {/* Photo Upload Button */}
              {isEditing && (
                <IconButton
                  size="small"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingPhoto}
                  sx={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    bgcolor: 'background.paper',
                    boxShadow: 1,
                    '&:hover': {
                      bgcolor: 'primary.light',
                      color: 'white'
                    }
                  }}
                >
                  {uploadingPhoto ? (
                    <CircularProgress size={24} />
                  ) : (
                    <PhotoCameraIcon fontSize="small" />
                  )}
                </IconButton>
              )}
            </Box>

            {/* Details Section */}
            <Stack spacing={2} sx={{ flexGrow: 1, width: '100%', alignItems: 'center' }}>
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
                    Email: {userMetadata?.email} (cannot be changed)
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
                  <Typography variant="h4" component="h1" fontWeight={600} textAlign="center">
                    {userMetadata?.displayName || 'No Name Set'}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" textAlign="center">
                    {userMetadata?.email}
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      minHeight: '3em', 
                      fontStyle: description ? 'normal' : 'italic', 
                      color: description ? 'text.primary' : 'text.secondary',
                      textAlign: 'center'
                    }}
                  >
                    {description || 'No description provided.'}
                  </Typography>
                </>
              )}

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 1, pt: 1 }}>
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
        
        {/* Friends Section - Right side */}
        <Paper 
          elevation={3} 
          sx={{ 
            p: { xs: 2, md: 2 }, // Reduced padding
            flex: { xs: '1 1 100%', md: '2 1 40%' },
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <PeopleIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h5" fontWeight={600}>Friends</Typography>
            <Chip 
              label={friends.length} 
              size="small" 
              color="primary" 
              sx={{ ml: 2 }} 
            />
          </Box>
          
          <Divider sx={{ mb: 1 }} />
          
          <Box sx={{ 
            flexGrow: 1, 
            overflow: 'auto',
            maxHeight: { md: friends.length > 4 ? '300px' : 'none' } // Only add scrollbar if > 4 friends
          }}>
            {loadingFriends ? (
              <Box display="flex" justifyContent="center" p={2}>
                <CircularProgress size={30} />
              </Box>
            ) : friends.length === 0 ? (
              <Box py={3} textAlign="center">
                <Typography color="text.secondary" variant="body1">
                  You haven't added any friends yet.
                </Typography>
                <Button 
                  variant="outlined" 
                  component="a" 
                  href="/messages"
                  sx={{ mt: 2 }}
                >
                  Go to chat to add friends
                </Button>
              </Box>
            ) : (
              <Grid container spacing={2}>
                {friends.map((friend) => (
                  <Grid key={friend.uid}>
                    <Paper 
                      elevation={1}
                      sx={{
                        p: 1.5, // Smaller padding
                        display: 'flex',
                        alignItems: 'center',
                        gap: 1.5, // Reduced gap
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        mb: 0.5,
                        '&:hover': {
                          transform: 'translateY(-2px)',
                          boxShadow: 2
                        }
                      }}
                    >
                      <Avatar 
                        src={friend.photoURL || undefined}
                        alt={friend.displayName || friend.email || ''}
                        sx={{ width: 40, height: 40 }} // Smaller avatar
                      >
                        {!friend.photoURL ? (friend.displayName?.[0] || friend.email?.[0])?.toUpperCase() : null}
                      </Avatar>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="body2" fontWeight={500} noWrap> {/* Smaller text */}
                          {friend.displayName || 'Unnamed User'}
                        </Typography>
                        <Typography variant="caption" color="text.secondary" noWrap> {/* Smaller email text */}
                          {friend.email}
                        </Typography>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Paper>
      </Box>
      
      {/* Snackbar for notifications - unchanged */}
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

export default ProfilePage;