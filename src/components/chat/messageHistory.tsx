import React, { useState, useEffect, useRef } from 'react';
import { Box, Paper, Typography, Avatar, Stack, CircularProgress } from '@mui/material'; // Removed Divider
import { requestNotificationPermission, showMessageNotification, subscribeToMessages } from '../../services/roomService';
import { Message, User } from '../../common/interfaces';
import { findUserById } from '../../common/findUser'; // Assuming this function returns Promise<User | null>
import {IconButton} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { removeMessageFromRoom } from '../../services/roomService';

// Define props to include the current user's ID
interface MessageHistoryProps {
  roomId: string;
  currentUserId: string; // Added prop
  targetMessage: string; // Search term
  roomName?: string
}

const MessageHistory: React.FC<MessageHistoryProps> = ({ roomId, currentUserId, targetMessage, roomName="Chat" }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [messageUsers, setMessageUsers] = useState<{ [senderId: string]: User | null }>({});
  const messagesEndRef = useRef<HTMLDivElement>(null); // For scrolling to bottom
  const [hoveredMessageId, setHoveredMessageId] = useState<string | null>(null); // State to track hovered message
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const previousMessagesLengthRef = useRef(0);
  
  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    }
    setupNotifications();
  }, [])
  // Filter messages based on targetMessage
  const filteredMessages = targetMessage
    ? messages.filter(message =>
      message.type === 'text' && // Only search text messages
      message.text.toLowerCase().includes(targetMessage.toLowerCase())
    )
    : messages;

  const isSearching = targetMessage.length > 0;

  // Effect to scroll down when new messages arrive, ONLY if not searching
  useEffect(() => {
    if (!isSearching) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isSearching]); // Depend on isSearching

  useEffect(() => {
    const setupNotifications = async () => {
      const granted = await requestNotificationPermission();
      setNotificationsEnabled(granted);
    };
    
    setupNotifications(); // Actually call the function
  }, []);
  
  // Then, update the message subscription useEffect:
  useEffect(() => {
    setLoading(true);
    setMessageUsers({});
    
    const unsubscribe = subscribeToMessages(
      roomId,
      (newMessages) => {
        // Only show notification if there are new messages and window not focused
        if (newMessages.length > previousMessagesLengthRef.current && previousMessagesLengthRef.current > 0 && document.visibilityState !== 'visible') {
          // Get only the new messages
          const newestMessages = newMessages.slice(previousMessagesLengthRef.current);
          
          // For each new message not from current user, show notification
          newestMessages.forEach(async (message) => {
            if (message.senderId !== currentUserId && notificationsEnabled) {
              const sender = await findUserById(message.senderId);
              showMessageNotification(
                sender?.displayName || "Unknown", 
                message.text, 
                sender?.photoURL, 
                roomName,
                message.type // Pass the message type
              );
            }
          });
        }
        
        // Update message length reference for next time
        previousMessagesLengthRef.current = newMessages.length;
        setMessages(newMessages);
        setLoading(false);
      },
      (error) => {
        console.error("Error fetching messages:", error);
        setLoading(false);
      }
    );
    
    return () => unsubscribe();
  }, [roomId, roomName, currentUserId, notificationsEnabled]);

  // Effect to fetch user data for senders
  useEffect(() => {
    // Fetch users for currently displayed messages (could be all or filtered)
    const senderIds = [...new Set(filteredMessages.map((message) => message.senderId))];
    senderIds.forEach(async (senderId) => {
      if (!(senderId in messageUsers)) {
        setMessageUsers((prev) => ({
          ...prev,
          [senderId]: prev[senderId] || null // Mark as loading initially with null
        }));
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
  }, [filteredMessages, messageUsers]); // Re-run when filteredMessages update

  return (
    // Use MUI Stack for vertical spacing between message rows
    <Stack spacing={2} sx={{ width: '100%', p: 1 }}>
      {loading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      )}

      {/* Search Results Indicator */}
      {!loading && isSearching && (
        <Paper elevation={1} sx={{ p: 1, mb: 1, textAlign: 'center', backgroundColor: 'action.selected' }}>
          <Typography variant="body2" color="text.secondary">
            Showing search results for "{targetMessage}" ({filteredMessages.length} found)
          </Typography>
        </Paper>
      )}

      {/* Message List */}
      {!loading && filteredMessages.length === 0 && !isSearching && (
        <Typography variant="body2" color="text.secondary" sx={{ textAlign: 'center', p: 2 }}>
          No messages yet. Start the conversation!
        </Typography>
      )}

      {/* Map over filteredMessages instead of messages */}
      {!loading && filteredMessages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        const sender = messageUsers[message.senderId]; // Get sender data (might be User, null, or undefined if still loading)
        const messageid = message.id;
        // Rest of the message rendering logic remains the same...
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
              alignItems: 'flex-end', // Align items to bottom for consistency
            }}
          >
            {/* Unsend Button */}
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
                width: 28,
                height: 28,
                alignSelf: 'center',
                mb: '20px', // Adjust margin to align better with bubble center
              }}
              aria-label="unsend message"
            >
              <DeleteIcon fontSize="small" />
            </IconButton>)
            }

            {/* Avatar */}
            {!isCurrentUser && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: sender?.photoURL ? undefined : 'secondary.main',
                  fontSize: '0.875rem',
                  order: -1, // Ensure avatar is on the left for others
                }}
                src={sender?.photoURL || undefined}
                alt={sender?.displayName ? `${sender.displayName}'s avatar` : 'User avatar'}
              >
                {!sender?.photoURL ? sender?.displayName?.charAt(0).toUpperCase() : null}
              </Avatar>
            )}

            {/* Message Bubble */}
            <Paper
              elevation={1}
              sx={{
                p: message.type === 'gif' ? 0.5 : 1.5, // Less padding for GIFs
                borderRadius: isCurrentUser ? '20px 20px 5px 20px' : '20px 20px 20px 5px',
                bgcolor: isCurrentUser ? 'primary.light' : 'background.paper',
                color: isCurrentUser ? 'primary.contrastText' : 'text.primary',
                wordBreak: 'break-word',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'start',
                maxWidth: '75%', // Limit bubble width
              }}
            >
              {/* Sender Name */}
              {!isCurrentUser && sender?.displayName && (
                <Typography
                  variant="caption"
                  display="block"
                  sx={{ mb: 0.5, fontWeight: 'bold', color: isCurrentUser ? 'inherit' : 'text.secondary' }}
                >
                  {sender.displayName}
                </Typography>
              )}
              {/* Message Content */}
              {message.type === 'gif' ? (
                <img
                  src={message.text}
                  alt="GIF"
                  style={{
                    maxWidth: '250px', // Limit GIF width
                    maxHeight: '200px', // Limit GIF height
                    borderRadius: '16px', // Match bubble radius slightly
                    display: 'block', // Ensure it behaves like a block element
                  }}
                />
              ) : (
                <Typography variant="body1">{message.text}</Typography>
              )}
              {/* Timestamp */}
              <Typography
                variant="caption"
                display="block"
                sx={{ mt: 0.5, textAlign: 'right', opacity: 0.8, fontSize: '0.7rem' }}
              >
                {message.createdAt?.toDate().toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
              </Typography>
            </Paper>

            {/* Avatar */}
            {isCurrentUser && (
              <Avatar
                sx={{
                  width: 32,
                  height: 32,
                  bgcolor: sender?.photoURL ? undefined : 'primary.main',
                  fontSize: '0.875rem',
                  order: 1, // Ensure avatar is on the right for current user
                }}
                src={sender?.photoURL || undefined}
                alt={sender?.displayName ? `${sender.displayName}'s avatar` : 'User avatar'}
              >
                {!sender?.photoURL ? sender?.displayName?.charAt(0).toUpperCase() : null}
              </Avatar>
            )}
          </Box>
        );
      })}
      {/* Invisible div at the end for auto-scrolling (only works when not searching) */}
      {!isSearching && <div ref={messagesEndRef} />}
    </Stack>
  );
};

export default MessageHistory;