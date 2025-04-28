import React, { useState } from 'react';
import { createRoom } from "../services/roomService.tsx";
import { Timestamp } from 'firebase/firestore';
import { Room } from '../common/interfaces.tsx';
import { AddFriend } from '../components/chat/addfriend.tsx';
import { Chatrooms } from "../components/chat/chatrooms.tsx";
import { useUserMetadata } from '../common/findUser.tsx';
import { 
  Button, 
  TextField, 
  Typography, 
  Container, 
  Grid, 
  Paper, 
  Box,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Avatar,
  CircularProgress
} from '@mui/material';
import { 
  CreateNewFolder as CreateIcon, 
  Person as PersonIcon,
  Description as DescriptionIcon
} from '@mui/icons-material';
import './chat.css';

const MessagePage = () => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const { userMetadata, loading, refetch } = useUserMetadata();

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    
    const testRoom: Room = {
      roomId: "",
      name: roomName,
      description: roomDescription,
      createdAt: Timestamp.now(),
      createdBy: userMetadata?.email || "",
      isPrivate: false,
    };
    
    try {
      if(!userMetadata) {
        throw new Error("User metadata is not available");
      }
      setIsCreatingRoom(true);
      await createRoom(testRoom, userMetadata);
      setRoomName("");
      setRoomDescription("");
      await refetch();
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setIsCreatingRoom(false);
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom sx={{ 
        fontWeight: 600, 
        color: 'primary.main',
        mb: 3 
      }}>
        Chat Rooms
      </Typography>
      
      {userMetadata && (
        <Paper 
          elevation={0}
          sx={{
            p: 2, 
            mb: 4, 
            bgcolor: 'primary.main',
            color: 'primary.contrastText',
            borderRadius: 2,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
            fontfamily: "Inter",
          }}
        >
          <Avatar
            src={userMetadata.photoURL}
            alt={userMetadata.displayName || userMetadata.email}
          >
            {userMetadata.displayName?.[0] || userMetadata.email?.[0]}
          </Avatar>
          <Typography>Welcome, {userMetadata.displayName || userMetadata.email}</Typography>
        </Paper>
      )}

      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Card elevation={3}>
            <CardHeader 
              title="Create New Room" 
              titleTypographyProps={{ variant: 'h5', fontWeight: 'medium' }}
              avatar={<CreateIcon color="primary" />}
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />
            <CardContent>
              <Box component="form" sx={{ '& .MuiTextField-root': { mb: 3 } }}>
                <TextField
                  fullWidth
                  required
                  label="Room Name"
                  placeholder="Enter a name for your room"
                  value={roomName}
                  onChange={(e) => setRoomName(e.target.value)}
                  variant="outlined"
                  InputProps={{
                    startAdornment: (
                      <PersonIcon color="action" sx={{ mr: 1 }} />
                    ),
                  }}
                />
                
                <TextField
                  fullWidth
                  label="Room Description"
                  placeholder="Describe what this room is about"
                  value={roomDescription}
                  onChange={(e) => setRoomDescription(e.target.value)}
                  variant="outlined"
                  multiline
                  rows={3}
                  InputProps={{
                    startAdornment: (
                      <DescriptionIcon color="action" sx={{ mr: 1, alignSelf: 'flex-start', mt: 1 }} />
                    ),
                  }}
                />
                
                <Button
                  variant="contained"
                  //color="success"
                  fullWidth
                  onClick={handleCreateRoom}
                  disabled={isCreatingRoom || !roomName.trim()}
                  startIcon={isCreatingRoom ? <CircularProgress size={20} color="inherit" /> : <CreateIcon />}
                  sx={{ py: 1, mt: 1,  bgcolor: 'extraColors.success', color: "white", "&:hover": { bgcolor: 'extraColors.successDark' }}}
                >
                  {isCreatingRoom ? 'Creating...' : 'Create Room'}
                </Button>
              </Box>
              
              <Divider sx={{ my: 4 }} />
              
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1 }} /> Add Friends
              </Typography>
              <AddFriend />
            </CardContent>
          </Card>
        </Grid>
        
        <Grid item xs={12} md={6}>
          <Card elevation={3} sx={{ height: '100%' }}>
            <CardHeader 
              title="Your Chat Rooms" 
              titleTypographyProps={{ variant: 'h5', fontWeight: 'medium' }}
              sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
            />
            <CardContent sx={{ 
              overflow: 'auto', 
              maxHeight: { xs: '400px', md: '600px' }
            }}>
              {userMetadata ? (
                <Chatrooms {...userMetadata} />
              ) : (
                <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                  Log in to view your chat rooms
                </Typography>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default MessagePage;