import { Timestamp } from "firebase/firestore";
import { addMessageToRoom } from "../../services/roomService.tsx";
import { useState } from "react";
import { User } from "../../common/interfaces.tsx";
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
    <div>
      <form onSubmit={handleMessageSubmit}>
        <input type="text"
          placeholder="Type a message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button type="submit">Send</button>
      </form>
    </div>
  )
}

export default MessageInput;