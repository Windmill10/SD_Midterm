import { Timestamp } from "firebase/firestore";
import { addMessageToRoom } from "../../services/roomService.tsx";
import { useState } from "react";
import { User } from "../../common/interfaces.tsx";
import {TextField} from "@mui/material";
import {Button, Box} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
interface MessageInputProps {
  roomId: string;
  user: User
}

const MessageInput: React.FC<MessageInputProps> = (props) => {
  const { roomId, user } = props;
  const [message, setMessage] = useState("");
  const handleMessageSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    try {
      await addMessageToRoom(roomId, {
        id: crypto.randomUUID(), // Generate a unique ID for the message
        text: message,
        createdAt: Timestamp.now(),
        senderId: user.uid,
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }
  return (
    // Wrap input and button in a form element and attach onSubmit here
    <Box display={"flex"} alignItems={"center"} justifyContent={"center"}>
      <form
        onSubmit={handleMessageSubmit}
        style={{ width: '100%', display: 'flex', alignItems: 'center' }}
      >
        <TextField type="text"
                   placeholder="Type a message..."
                   value={message}
                   onChange={(e) => setMessage(e.target.value)}
                   sx={{maxWidth: "100%", mr: 2,}}
                   fullWidth
        />
        <Button type="submit" variant={"contained"} endIcon={<SendIcon/>} sx={{pt: 1}}>Send</Button>
      </form>
    </Box>
  )

}

export default MessageInput;