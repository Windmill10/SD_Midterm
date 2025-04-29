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
import { Box, Paper, Typography, IconButton, InputBase, Button, Divider } from "@mui/material";
import PersonAddAlt1Icon from '@mui/icons-material/PersonAddAlt1';

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const { userMetadata, loading, refetch } = useUserMetadata();


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
        alert("User not found");
        return;
      }
      alert(`${addedUser.displayName || addedUser.email} has been added to ${room.name}`);
      setNewMemberEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Failed to add member to room");
    }
  };

  if (loadingRooms || loading) {
    return <div>Loading...</div>;
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
        minHeight: 'calc(100vh - 64px)',   // Only as tall as needed, but never less
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
          height: '100%',
          mx: 2,
          pl: 1,
          overflowY: 'auto',
          minHeight: 200,
          maxHeight: 865,
        }}
        square
      >
        <Typography variant="h6" p={2} sx={{ textAlign: 'center' }}>
          Chatrooms
        </Typography>
        <Divider />
        <Box sx={{ flex: 1, overflowY: 'auto' }} width='90%' alignContent={'center'}>
          <Chatrooms {...userMetadata} />
        </Box>
        <Box p={2}>
          {/* Optional: add create room button here */}
        </Box>
      </Paper>

      {/* Main chat area */}
      <Box
        sx={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '90vh',
          width: { xs: 'calc(100vw - 90px)', sm: 'calc(100vw - 240px)' }
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
            borderColor: 'divider'
          }}
        >
          <Typography variant="h5" fontWeight={600}>
            {room.name}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {room.description}
          </Typography>
          <Box
            component="form"
            onSubmit={handleAddMember}
            sx={{ display: 'flex', alignItems: 'center', gap: 1, maxWidth: 400 }}
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
        </Box>
        {/* Message history */}
        <Box
          sx={{
            flex: 1,
            px: { xs: 0.5, sm: 3 },
            py: 2,
            overflowY: 'auto',
            bgcolor: 'background.default',
            minHeight: 0,
          }}
        >
          <MessageHistory roomId={room.roomId} currentUserId={userMetadata.uid} />
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
    </Box>
  );
};

export default RoomPage;