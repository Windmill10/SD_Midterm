import React from 'react';
import {createRoom, Room} from "../services/roomService.tsx";
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.tsx';
const MessagePage = () => {
  const {currentUser} = useAuth();
  const testRoom: Room = {
    name: "Test Room",
    description: "This is a test room",
    createdAt: Timestamp.now(),
    createdBy: "testUser",
    isPrivate: false,
};

  return(
    <div>
      <h1>This is message Page</h1>
      <button onClick={() => createRoom(testRoom, currentUser)}>Create Room</button>
    </div>
  )
}
export default MessagePage;

// consisting components of
// Chat history
// Chat input 
// Other info about the chat