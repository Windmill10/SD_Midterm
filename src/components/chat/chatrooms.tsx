import { useState, useEffect } from 'react';
import { doc, getDoc } from 'firebase/firestore';
import { firestore } from '../../config/firebase';
import { User, Room } from "../../common/interfaces";
import { useNavigate } from 'react-router-dom';
import { List, ListItem, ListItemText } from '@mui/material';

export function Chatrooms(props: User) {
  const { chatrooms } = props;
  const [roomsData, setRoomsData] = useState<Room[]>([]);
  const navigate = useNavigate();
  const handleRoomClick = (roomId: string) => {
    navigate(`/room/${roomId}`);
  };

  useEffect(() => {
    const fetchRoomData = async () => {
      if (!chatrooms || chatrooms.length === 0) {
        setRoomsData([]);
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
              isPrivate: data?.isPrivate || false,
            };
          }
          return null;
        });
        const results = await Promise.all(chatroomPromises);
        setRoomsData(results.filter(Boolean) as Room[]);
      } catch (error) {
        console.error("Error fetching room data:", error);
      }
    };
    fetchRoomData();
  }, [chatrooms]);

  return (
      <List
        sx={{
          display: 'flex',
          flexDirection: 'column',
          width: 'max-content',
          minWidth: '80%',
          maxWidth: '90%',
          bgcolor: 'background.paper',
          //boxShadow: 3,

          overflow: 'visible'
        }}
      >
        {roomsData.map((room: Room) => (
          <ListItem
            key={room.roomId}
            onClick={() => handleRoomClick(room.roomId)}
            sx={{
              minWidth: 220,
              maxWidth: 320,
              flex: '0 0 auto',
              cursor: 'pointer',
              display: 'flex',
              mr: 2,
              bgcolor: 'grey.100',
              borderRadius: 1,
              boxShadow: 1,
              '&:hover': { bgcolor: 'grey.200' },
              transition: 'background 0.2s',
              my: 0.5,
              overflowX: 'hidden',
              wordWrap: 'break-word',
              whiteSpace: 'normal',
              px: 2,
            }}
          >
            <ListItemText
              primary={room.name}
              secondary={room.description}

            />
          </ListItem>
        ))}
      </List>
  );
}