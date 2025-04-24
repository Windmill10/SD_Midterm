import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { User } from "../../common/interfaces";

interface RoomData {
  id: string;
  name: string;
  description: string;
}

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
}