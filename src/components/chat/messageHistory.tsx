import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Avatar, Stack, CircularProgress } from '@mui/material'; // Import MUI components
import { subscribeToMessages } from '../../services/roomService';
import { Message, User } from '../../common/interfaces';
import { findUserById } from '../../common/findUser'; // Assuming this function returns Promise<User | null>
import Button  from "@mui/material/Button"
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeMessageFromRoom } from '../../services/roomService';
// Define props to include the current user's ID
interface MessageHistoryProps {
  roomId: string;
  currentUserId: string; // Added prop
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ roomId, currentUserId }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageUsers, setMessageUsers] = useState<{ [senderId: string]: User | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null); // For scrolling to bottom
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null); // State to track hovered message

  // Effect to scroll down when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Effect to subscribe to messages
  useEffect(() => {
    setLoading(true);
    setMessageUsers({}); // Reset users when room changes
    const unsubscribe = subscribeToMessages(
      roomId,
      (newMessages) => {
        setMessages(newMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, [roomId]);

  useEffect(() => {
    const senderIds = [...new Set(messages.map((message) => message.senderId))];
    senderIds.forEach(async (senderId) => {
      if (!(senderId in messageUsers)) {
        try {
          const user = await findUserById(senderId);
          setMessageUsers((prev) => ({
            ...prev,
            [senderId]: user || null // Store user data or null if not found
          }));
        } catch (error) {
          console.error(`Error fetching user ${senderId}:`, error);
          setMessageUsers((prev) => ({
            ...prev,
            [senderId]: null // Mark as failed (null)
          }));
        }
      }
    });
  }, [messages]); // Re-run when messages update

  return (
    // Use MUI Stack for vertical spacing between message rows
    <Stack spacing={2} sx={{ width: '100%', p: 1 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}
      {!loading && messages.length === 0 && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
          No messages yet. Start the conversation!
        </Typography>
      )}
      {!loading && messages.map((message) => {
        // Determine if the message is from the current user
        const isCurrentUser = message.senderId === currentUserId;
        const sender = messageUsers[message.senderId]; // Get sender data (might be User, null, or undefined if still loading)
        const messageid = message.id;
        return (
          <Box
            key={message.id}
            onMouseEnter={() => setHoveredMessageId(message.id)}
            onMouseLeave={() => setHoveredMessageId(null)}
            sx={{
              display: 'flex',
              justifyContent: isCurrentUser ? 'flex-end' : 'flex-start',
              width: '100%',
              position: 'relative',
              gap: 1,
            }}
          >
            {/* Stack to group Avatar and Message Bubble */}
            {isCurrentUser && (<IconButton
                size="small"
                onClick={() => {removeMessageFromRoom(roomId, messageid)}}
                sx={{

                  opacity: hoveredMessageId === message.id ? 0.7 : 0,
                  transition: 'opacity 0.2s ease-in-out',
                  '&:hover': {
                    opacity: 1,
                    bgcolor: 'action.hover' 
                  },
                  // Ensure button size is fixed and small
                  width: 28,
                  height: 28,
                  alignSelf: 'center', 
                }}
                aria-label="unsend message"
              >
                <DeleteIcon fontSize="small" />
              </IconButton>)
              }
            
            <Stack
              // Avatar on left for current user, right for others
              direction={isCurrentUser ? 'row-reverse' : 'row'}
              spacing={1}
              alignItems="flex-end"
              sx={{ maxWidth: '100%' }}
            >
              {/* Avatar */}
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: sender?.photoURL ? undefined : (isCurrentUser ? 'primary.main' : 'secondary.main'),
                  fontSize: '0.875rem',
                }}
                src={sender?.photoURL || undefined}
                alt={sender?.displayName ? `${sender.displayName}'s avatar` : 'User avatar'}
              >
                {!sender?.photoURL ? sender?.displayName?.charAt(0).toUpperCase() : null}

              </Avatar>

              <Paper
                elevation={1}
                sx={{
                  p: 1.5,
                  borderRadius: isCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                  // Different background colors
                  bgcolor: isCurrentUser ? 'primary.light' : 'background.paper',
                  color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                  wordBreak: 'break-word',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'start'
                }}
              >
                {/* Optionally display sender's name for other users' messages */}
                {!isCurrentUser && sender?.displayName && (
                  <Typography
                    variant="caption"
                    display="block"
                    sx={{ mb: 0.5, fontWeight: 'bold', color: isCurrentUser ? 'inherit' : 'text.secondary' }}
                  >
                    {sender.displayName}

                  </Typography>
                )}
                {/* Message Text */}
                <Typography variant="body1">{message.text}</Typography>
                {/* Timestamp */}
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mt: 0.5, textAlign: 'right', opacity: 0.8, fontSize: '0.7rem' }}
                >
                  {/* Format timestamp nicely */}
                  {message.createdAt?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </Typography>
              </Paper>
            </Stack>
          </Box>
        );
      })}
      {/* Invisible div at the end for auto-scrolling */}
      <div ref={messagesEndRef} />
    </Stack>
  );
};

export default MessageHistory;