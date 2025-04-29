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

const ChatPage = () => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const { userMetadata, loading, refetch } = useUserMetadata();

  const handleCreateRoom = async () => {
    if (!roomName.trim()) return;
    if (!userMetadata) return;

    const newRoom: Room = {
      roomId: '',
      name: roomName,
      description: roomDescription,
      createdAt: Timestamp.now(),
      createdBy: userMetadata.email || '',
      isPrivate: false,
    };

    try {
      setIsCreatingRoom(true);
      await createRoom(newRoom, userMetadata);
      setRoomName('');
      setRoomDescription('');
      await refetch?.();
    } catch (e) {
      console.error(e);
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
    <Box
      sx={{
        width: '100vw',
        maxWidth: { xs: '100%', md: 1100 },
        mx: 'auto',
        px: { xs: 1, md: 5 }
      }}
    >

    <Typography variant="h3" gutterBottom fontWeight={700} color="primary.main">
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
            gap: 2,
            fontFamily: "Inter",
          }}
        >
          <Avatar
            src={userMetadata.photoURL}
            alt={userMetadata.displayName || userMetadata.email}
          >
            {userMetadata.displayName?.[0] || userMetadata.email?.[0]}
          </Avatar>
          <Typography variant="subtitle1">
            Welcome, {userMetadata.displayName || userMetadata.email}
          </Typography>
        </Paper>
      )}

      {/* Main Cards Layout */}
      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          gap: 4,
          alignItems: 'stretch',
          my: 2,
        }}
      >
        {/* Create Room Card */}
        <Card elevation={3} sx={{
          flex: 1,
          minWidth: { xs: '100%', md: 640 },
          maxWidth: { xs: '100%', md: 740 },
          mb: { xs: 4, md: 0 }
        }}>
          <CardHeader
            title="Create New Room"
            titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
            avatar={<CreateIcon color="primary" />}
            sx={{ borderBottom: '1px solid', borderColor: 'divider' }}
          />
          <CardContent>
            <Box
              component="form"
              sx={{ '& .MuiTextField-root': { mb: 2 } }}
              onSubmit={e => { e.preventDefault(); handleCreateRoom(); }}
            >
              <TextField
                fullWidth
                required
                label="Room Name"
                placeholder="Enter a name for your room"
                value={roomName}
                onChange={e => setRoomName(e.target.value)}
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
                onChange={e => setRoomDescription(e.target.value)}
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
                fullWidth
                type="submit"
                onClick={handleCreateRoom}
                disabled={isCreatingRoom || !roomName.trim()}
                startIcon={isCreatingRoom ? <CircularProgress size={20} color="inherit" /> : <CreateIcon />}
                sx={{
                  py: 1, mt: 1,
                  bgcolor: 'success.main',
                  color: "white",
                  '&:hover': { bgcolor: 'success.dark' }
                }}
              >
                {isCreatingRoom ? 'Creating...' : 'Create Room'}
              </Button>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
              <PersonIcon sx={{ mr: 1 }} /> Add Friends
            </Typography>
            <AddFriend />
          </CardContent>
        </Card>

        {/* Chatrooms Card */}
        <Card elevation={3} sx={{
          flex: 2,
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column'
        }}>
          <CardHeader
            title="Your Chat Rooms"
            titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
            sx={{
              borderBottom: '1px solid',
              borderColor: 'divider',
              pb: 1,
            }}
          />
          <CardContent sx={{
            flex: 1,
            px: { xs: 0, md: 2 },
            overflowY: 'auto',
            minHeight: 200,
            maxHeight: 440,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
            {userMetadata ? (
              <Box sx={{
                width: '100%',
                maxWidth: '100%',
                overflowX: 'auto',
              }}>
                <Chatrooms {...userMetadata} />
              </Box>
            ) : (
              <Typography color="text.secondary" align="center" sx={{ py: 8 }}>
                Log in to view your chat rooms
              </Typography>
            )}
          </CardContent>
        </Card>
      </Box>
    </Box>
  );
};

export default ChatPage;