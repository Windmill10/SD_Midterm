import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from "../config/firebase";
import { Room } from "../common/interfaces";
import { addMemberToRoomByEmail } from "../services/roomService";
import MessageInput from "../components/chat/messageinput";
import { useUserMetadata } from "../common/findUser";
import MessageHistory from "../components/chat/messageHistory.tsx";
import { Chatrooms } from "../components/chat/chatrooms.tsx";
import { Box, Paper, Typography, IconButton, InputBase, Button, Divider, Alert, AlertColor, Icon } from "@mui/material"; // Added Alert, AlertColor
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';
import Snackbar from "@mui/material/Snackbar";
import SearchIcon from '@mui/icons-material/Search';
import { Search } from "@mui/icons-material";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const { userMetadata, loading, refetch } = useUserMetadata();

  // Snackbar state
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState<AlertColor>("success");

  //serach message states
  const [targetMessage, setTargetMessage] = useState<string>("");
  const [searching, setSearching] = useState(false);

  const handleSearchMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetMessage.trim()) return;
    setSearching(true);
    setTargetMessage(targetMessage);
  }
  useEffect(() => {
    const fetchRoom = async () => {
      if (!roomId) return;
      try {
        const roomDoc = await getDoc(doc(firestore, "rooms", roomId));
        if (roomDoc.exists()) {
          const data = roomDoc.data();
          setRoom({
            roomId: roomDoc.id,
            name: data.name || "Unnamed Room",
            description: data.description || "",
            createdAt: data.createdAt,
            createdBy: data.createdBy,
            isPrivate: data.isPrivate || false
          });
        }
      } catch (error) {
        console.error("Error fetching room:", error);
      } finally {
        setLoadingRooms(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleAddMember = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!room || !newMemberEmail.trim()) return;
    try {
      const addedUser = await addMemberToRoomByEmail(room, newMemberEmail);
      if (!addedUser) {
        setSnackbarMessage("User not found");
        setSnackbarSeverity("warning");
      } else {
        setSnackbarMessage(`${addedUser.displayName || addedUser.email} has been added to ${room.name}`);
        setSnackbarSeverity("success");
        setNewMemberEmail(""); // Clear input on success
      }
    } catch (error) {
      console.error("Error adding member:", error);
      setSnackbarMessage("Failed to add member to room");
      setSnackbarSeverity("error");
    } finally {
      setSnackbarOpen(true); // Open snackbar regardless of outcome
    }
  };

  // Function to close the snackbar
  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };

  if (loadingRooms || loading) {
    return <div>Loading...</div>; // Consider using MUI Skeleton or CircularProgress here
  }
  if (!room) {
    return <div>Room not found</div>;
  }
  if (!userMetadata) {
    return <div>User not authenticated</div>;
  }

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 64px)',
        display: 'flex',
        bgcolor: 'background.default',
        overflow: 'hidden',
        pt: '35px',
        mt: '2px'
      }}
    >

      {/* Chatrooms sidebar */}
      <Paper
        elevation={3}
        sx={{
          width: { xs: 200, sm: 300 },
          minWidth: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          height: '100%', // Adjusted for consistency
          mx: 2,
          // pl: 1, // Removed padding left for centering
          borderRadius: 2,
          overflowY: 'auto',
          minHeight: 200, // Consider removing if height: 100% is used
          maxHeight: 865, // Consider removing if height: 100% is used
        }}
        square
      >
        <Typography variant="h6" p={2} sx={{ textAlign: 'center', width: '100%' }}>
          Chatrooms
        </Typography>
        <Divider sx={{ width: '100%' }} />
        <Box sx={{ flex: 1, overflowY: 'auto', width: '90%' }}> {/* Centered content */}
          <Chatrooms {...userMetadata} />
        </Box>

      </Paper>

      {/* Main chat area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: 'calc(100vh - 64px - 35px - 2px)', // Calculate height based on parent Box padding/margin
          width: { xs: 'calc(100vw - 200px - 32px)', sm: 'calc(100vw - 300px - 32px)' }, // Adjusted width calculation
          borderRadius: 2,
        }}
      >
        {/* Room info and add member */}
        <Box
          sx={{
            px: 3,
            pt: 3,
            pb: 2,
            bgcolor: 'background.paper',
            borderBottom: '1px solid',
            borderColor: 'divider',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }}
        >
          {/* First row: Room name and description */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            <Typography variant="h5" fontWeight={600}>
              {room.name}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ gap: 2, alignSelf: 'center', maxWidth: "100%", overflowWrap: 'break-word' }}>
              {room.description}
            </Typography>
          </Box>

          {/* Second row: Add member and search functions */}
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
            <Box
              component="form"
              onSubmit={handleAddMember}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: '1 1 250px',
                minWidth: '250px'
              }}
            >
              <InputBase
                placeholder="Enter email to add"
                type="email"
                size="small"
                value={newMemberEmail}
                onChange={(e) => setNewMemberEmail(e.target.value)}
                sx={{
                  bgcolor: 'background.default',
                  px: 2,
                  py: 0.5,
                  flex: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
              />
              <IconButton
                color="primary"
                type="submit"
                sx={{ p: 1.2 }}
                disabled={!newMemberEmail.trim()}
              >
                <PersonAddAlt1Icon />
              </IconButton>
            </Box>

            <Box
              component="form"
              onSubmit={handleSearchMessage}
              sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flex: '1 1 250px',
                minWidth: '250px'
              }}
            >
              <InputBase
                placeholder="Search message"
                sx={{
                  bgcolor: 'background.default',
                  px: 2,
                  py: 0.5,
                  flex: 1,
                  borderRadius: 2,
                  border: '1px solid',
                  borderColor: 'divider'
                }}
                value={targetMessage}
                onChange={(e => setTargetMessage(e.target.value))}
              />
              <IconButton
                color="primary"
                type="submit"
                sx={{ p: 1.2 }}
                disabled={!targetMessage}
              >
                <SearchIcon />
              </IconButton>
            </Box>
          </Box>
        </Box>
        {/* Message history */}
        <Box
          sx={{
            flex: 1, // Takes remaining space
            px: { xs: 0.5, sm: 3 },
            py: 2,
            overflowY: 'auto',
            bgcolor: 'background.default',
            minHeight: 0, // Important for flexbox scrolling
          }}
        >
          <MessageHistory roomId={room.roomId} currentUserId={userMetadata.uid} targetMessage={targetMessage} />
        </Box>
        {/* Message input at bottom */}
        <Box
          sx={{
            px: { xs: 1, sm: 3 },
            py: 2,
            bgcolor: 'background.paper',
            borderTop: '1px solid',
            borderColor: 'divider',
          }}
        >
          <MessageInput roomId={room.roomId} user={userMetadata} />
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} // Position snackbar
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
    </Box>
  );
};

export default RoomPage;