import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { User, Room } from "../../common/interfaces";
import { useNavigate } from 'react-router-dom';
export function Chatrooms(props: User) {
  const { chatrooms, displayName } = props;

  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const navigate = useNavigate();
  const handleRoomClick = (roomId: string) => {
    console.log("Room clicked:", roomId);
    navigate(`/room/${roomId}`);
  }

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!chatrooms || chatrooms.length === 0) {
        return;
      }
      try {
        const chatroomPromises = chatrooms.map(async (roomId) => {
          const roomDoc = await getDoc(doc(firestore, "rooms", roomId));
          const data = roomDoc.data();
          if (roomDoc.exists()) {
            return {
              roomId: roomDoc.id,
              name: data?.name || "Unnamed Room",
              description: data?.description || "",
              createdAt: data?.createdAt || new Date(),
              createdBy: data?.createdBy || "",
              isPrivate: data?.isPrivate || false
            };
          }
          console.log("Room not found:", roomId);
          return null;
        })
        const results = await Promise.all(chatroomPromises);
        setRoomsData(results.filter(Boolean) as Room[]);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    }
    fetchRoomData();
  }, [chatrooms]);
  return (
    <div>
      <ul className="rooms-list">
        {roomsData.map((room: Room) => (
          <li>
            <button onClick={() => handleRoomClick(room.roomId)} key={room.roomId} className="room-item">
              {room.name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  )
}
/*
export function Chatrooms(props: User) {
  const { chatrooms } = props;
  const [roomsData, setRoomsData] = useState<RoomData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!chatrooms || chatrooms.length === 0) {
        setRoomsData([]);
        setLoading(false);
        return;
      }

      try {
        const roomsPromises = chatrooms.map(async (roomId) => {
          const roomDoc = await getDoc(doc(firestore, "rooms", roomId));
          if (roomDoc.exists()) {
            const data = roomDoc.data();
            return {
              id: roomDoc.id,
              name: data.name || "Unnamed Room",
              description: data.description || "",
            };
          }
          return null;
        });

        const results = await Promise.all(roomsPromises);
        setRoomsData(results.filter(Boolean) as RoomData[]);
      } catch (error) {
        console.error("Error fetching room data:", error);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);
    fetchRoomData();
  }, [chatrooms]);

  if (loading) {
    return <div>Loading rooms...</div>;
  }

  return (
    <div className="chatrooms-container">
      <h2>Your Chatrooms</h2>
      {roomsData.length > 0 ? (
        <ul className="room-list">
          {roomsData.map((room) => (
            <li key={room.id} className="room-item">
              <h3>{room.name}</h3>
              <p>{room.description}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No chatrooms available.</p>
      )}
    </div>
  );
}*/