import React from 'react';
import {useState, useEffect} from 'react';
import {createRoom} from "../services/roomService.tsx";
import { Timestamp } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext.tsx';
import {Room, User} from '../common/interfaces.tsx';
import { AddFriend } from '../components/chat/addfriend.tsx';
import {Chatrooms} from "../components/chat/chatrooms.tsx";
import { findUserByEmail, useUserMetadata } from '../common/findUser.tsx';
import './chat.css';
const MessagePage = () => {
  const [isCreatingRoom, setIsCreatingRoom] = useState(false);
  //const {currentUser} = useAuth();
  const [roomName, setRoomName] = useState("");
  const [roomDescription, setRoomDescription] = useState("");
  const {userMetadata, loading, refetch} = useUserMetadata();


  const handleCreateRoom = async () => {
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
      await refetch();
    } catch (error) {
      console.error("Error creating room:", error);
    } finally {
      setIsCreatingRoom(false);
    }
  }


  return (
    <div className="chat-page">
      <h1>Chat Rooms</h1>
      {userMetadata && <p>Welcome, {userMetadata.email}</p>}

      {/* Use a container with fixed height for the action area */}
      <div className="action-container">
        <input
          type="text"
          placeholder="Room Name"
          value={roomName}
          onChange={(e) => setRoomName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="Room Description"
          value={roomDescription}
          onChange={(e) => setRoomDescription(e.target.value)}
          className="input-field"
        />
        <button
          onClick={handleCreateRoom}
          disabled={isCreatingRoom}
          className="create-button"
        >
          {isCreatingRoom ? 'Creating...' : 'Create Room'}
        </button>
        <AddFriend />
      </div>

      {/* Fixed height container for chatrooms */}
      <div className="rooms-container">
        {userMetadata && <Chatrooms {...userMetadata} />}
      </div>
    </div>
  );
}
export default MessagePage;

