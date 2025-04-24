import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from "../config/firebase";
import { Room } from "../common/interfaces";
import { findUserByEmail } from "../common/findUser";
import { addMemberToRoom } from "../services/roomService";
import "./chat.css";

const RoomPage = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const [newMemberEmail, setNewMemberEmail] = useState("");
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);

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
        setLoading(false);
      }
    };
    
    fetchRoom();
  }, [roomId]);

  const handleAddMember = async () => {
    if (!room) return;
    
    try {
      const user = await findUserByEmail(newMemberEmail);
      if (!user) {
        alert("User not found");
        return;
      }
      await addMemberToRoom(room, user);
      alert(`${user.displayName || user.email} has been added to ${room.name}`);
      setNewMemberEmail("");
    } catch (error) {
      console.error("Error adding member:", error);
    }
  };

  if (loading) {
    return <div>Loading room...</div>;
  }

  if (!room) {
    return <div>Room not found</div>;
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
    </div>
  );
};

export default RoomPage;