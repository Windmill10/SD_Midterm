import { collection, addDoc, doc, updateDoc, orderBy, onSnapshot, query, getDocs, arrayUnion, Timestamp, setDoc } from 'firebase/firestore'; // Removed getDoc, where
import { firestore } from '../config/firebase';
import { User } from '../common/interfaces';
import { Room, Message } from '../common/interfaces';
import { findUserByEmail } from '../common/findUser';
import { deleteDoc } from 'firebase/firestore';


export const createRoom = async (room: Room, userMetadata: User) => {
  try {
    if (userMetadata) {
      const roomRef = await addDoc(collection(firestore, 'rooms'), room);
      const memberRef = doc(firestore, 'rooms', roomRef.id, "members", userMetadata.uid);
      await setDoc(memberRef, {
        uid: userMetadata.uid,
        role: "admin",
        joinedAt: Timestamp.now(),

      });


      const userRef = doc(firestore, 'users', userMetadata.uid);
      //check if user already exists

      await updateDoc(userRef, {
        chatrooms: arrayUnion(roomRef.id),
      });
      room.roomId = roomRef.id
      return roomRef.id;
    }

  } catch (error) {
    console.error("Error creating room:", error);
    throw error;
  }
}

export const addMemberToRoom = async (room: Room, user: User) => {
  console.log("Adding member to room:", room, user);
  try {
    if (!room || !user) {
      throw new Error("Room or user is not defined");
    }
    const memberRef = doc(firestore, 'rooms', room.roomId, "members", user.uid);
    const userRef = doc(firestore, 'users', user.uid);
    await updateDoc(userRef, {
      chatrooms: arrayUnion(room.roomId),
    });
    await setDoc(memberRef, {
      uid: user.uid,
      role: "member",
      joinedAt: Timestamp.now(),
    });
  } catch (error) {
    console.error("Error adding member to room:", error);
    throw error;
  }
}

export const addMemberToRoomByEmail = async (room: Room, email: string): Promise<User | null> => {
  try {
    if (!room || !email) {
      throw new Error("Room or email is not defined");
    }

    // Find the user
    const user = await findUserByEmail(email);
    if (!user) {
      return null; // User not found
    }

    await addMemberToRoom(room, user);
    return user;
  } catch (error) {
    console.error("Error adding member by email:", error);
    throw error;
  }
}

export const addMessageToRoom = async (roomId: string, message: Message) => {
  try {
    const roomRef = doc(firestore, 'rooms', roomId);
    const messageRef = collection(roomRef, 'messages');
    await addDoc(messageRef, message);
    //console.log("Message added to room:", roomId, message);
  } catch (error) {
    console.error("Error adding message to room:", error);
    throw error;
  }
}

// but this is only usefor for one time fetching
export const getMessagesFromRoom = async (roomId: string): Promise<Message[]> => {
  const messageRef = collection(doc(firestore, 'rooms', roomId), 'messages');
  const q = query(messageRef, orderBy("createdAt", "asc"));
  try {
    const querySnapshot = await getDocs(q);
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        text: data.text,
        senderId: data.senderId,
        createdAt: data.createdAt,
      });
    }
    );
    return messages;
  } catch (error) {
    console.error("Error getting messages from room:", error);
    throw error;
  }
}

export const subscribeToMessages = (
  roomId: string,
  callback: (messages: Message[]) => void,
  errorCallback?: (error: Error) => void
) => {
  const messageRef = collection(doc(firestore, 'rooms', roomId), 'messages');
  const q = query(messageRef, orderBy("createdAt", "asc"));
  return onSnapshot(q, (querySnapshot) => {
    const messages: Message[] = [];
    querySnapshot.forEach((doc) => {
      const data = doc.data();
      messages.push({
        id: doc.id,
        text: data.text,
        senderId: data.senderId,
        createdAt: data.createdAt,
      });
    });
    callback(messages);
  }, 
  (error) => {
    console.error("Error subscribing to messages:", error);
    if (errorCallback) {
      errorCallback(error);
    }
  }
  );
}

export const removeMessageFromRoom = async (roomId: string, messageId: string) => {
  try {
    console.log("hi");
    const messageRef = doc(firestore, 'rooms', roomId, 'messages', messageId);
    await deleteDoc(messageRef);
    console.log("Message removed from room");
  } catch (error) {
    console.error("Error removing message from room:", error);
    throw error;
  }
}

export const requestNotificationPermission = async (): Promise<boolean> => {
  if(!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
    return false;
  }
  // If permission is already granted, return true
  if (Notification.permission === "granted") {
    console.log("Notification permission already granted");
    return true; // <-- Changed from false to true
  }
  // If permission is not denied, request it
  if (Notification.permission !== "denied") {
    const permission = await Notification.requestPermission();
    return permission === "granted";
  }
  // If permission is denied, return false
  return false;
}  

export const showMessageNotification = (
  senderName: string,
  message: string,
  avatar?: string,
  roomName?: string,
  onClick?: () => void
) => {
  // Check if we can show notifications
  if (
    !('Notification' in window) ||
    Notification.permission !== 'granted' ||
    document.visibilityState === 'visible'
  ) {
    return;
  }

  // Create notification
  const title = `${senderName} ${roomName ? `in ${roomName}` : ''}`;
  const options: NotificationOptions = {
    body: message,
    icon: avatar,
    //badge: '/favicon.ico',
    data: { timestamp: Date.now() },
  };

  const notification = new Notification(title, options);
  
  if (onClick) {
    notification.onclick = () => {
      window.focus();
      onClick();
      notification.close();
    };
  }

  // Auto close after 5 seconds
  setTimeout(() => notification.close(), 5000);
};