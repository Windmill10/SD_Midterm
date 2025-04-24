import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs, arrayUnion, Timestamp, setDoc } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import { User } from '../common/interfaces';
import { Room, Message } from '../common/interfaces';
import { findUserByEmail } from '../common/findUser';
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
    console.log("Message added to room:", roomId, message);
  } catch (error) {
    console.error("Error adding message to room:", error);
    throw error;
  }
}