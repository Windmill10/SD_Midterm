import React from 'react';
import {useState, useEffect} from 'react';
import {createRoom} from "../services/roomService.tsx";
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.tsx';
import {Room, User} from '../common/interfaces.tsx';
import { AddFriend } from '../components/chat/addfriend.tsx';
import {Chatrooms} from "../components/chat/chatrooms.tsx";
import { findUserByEmail } from '../common/findUser.tsx';
const MessagePage = () => {
  const [userMetadata, setUserMetadata] = useState<User | null>(null);

  const user = useAuth();
  const currentUser = user.currentUser; //using firebase auth

  useEffect(() => {
    const fetchUserMetadata = async () => {
      if (currentUser?.email) {
        try {
          const userData = await findUserByEmail(currentUser.email);
          setUserMetadata(userData || null);
        } catch (error) {
          console.error("Error fetching user metadata:", error);
        }
      }
    };

    fetchUserMetadata();
  }, [currentUser]);
  console.log("currentUserMetadata", userMetadata);
  if(!currentUser) {
    return <div>Please login to see this page</div>
  }

  const testRoom: Room = {
    name: "Test Room",
    description: "This is a test room",
    createdAt: Timestamp.now(),
    createdBy: userMetadata?.email || "",
    isPrivate: false,
};

  return(
    <div>
      <h1>This is message Page</h1>
      {userMetadata && <p>Welcome, {userMetadata.email}</p>}
      <button onClick={() => currentUser && createRoom(testRoom, userMetadata)}>Create Room</button>
      <AddFriend />

    </div>
  )
}
export default MessagePage;

// consisting components of
// Chat history
// Chat input 
// Other info about the chat