import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from "../config/firebase";
import { Room } from "../common/interfaces";
import { addMemberToRoomByEmail } from "../services/roomService";
import MessageInput from "../components/chat/messageinput";
import { useUserMetadata } from "../common/findUser";
import "./chat.css";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const {userMetadata, loading, refetch} = useUserMetadata();
  // Fetch the room data based on the roomId parameter
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

  const handleAddMember = async () => {
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
    <div className="chatroom">
      <h3>{room.name}</h3>
      <p>{room.description}</p>
      <div className="add-member-form">
        <input
          className="join-button"
          type="email"
          value={newMemberEmail}
          onChange={(e) => setNewMemberEmail(e.target.value)}
          placeholder="Enter email to add"
        />
        <button onClick={handleAddMember}>Add members</button>
      </div>
      <MessageInput roomId={room.roomId} user={userMetadata}/>
    </div>
  );
};

export default RoomPage;


// consisting components of
// Chat history
// Chat input 
// Other info about the chat