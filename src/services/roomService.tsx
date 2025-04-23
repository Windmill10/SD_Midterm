import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs, arrayUnion, Timestamp, setDoc } from 'firebase/firestore';
import { db } from '../config/firebase';
import {firestore} from '../config/firebase';
import { useAuth } from '../context/AuthContext';
import { User } from 'firebase/auth';
export interface Message {
    id: string,
    text: string,
    senderId: string,
    createdAt: Timestamp,
}
export interface Room {
    name: string, 
    description: string,
    createdAt: Timestamp,
    createdBy: string,
    isPrivate: boolean,
    messages?: Message[],
}

export const createRoom = async (room: Room, currentUser: User | null) => {
    try {
        if (currentUser && currentUser) {
            const roomRef = await addDoc(collection(firestore, 'rooms'), room);
            const memberRef = doc(firestore, 'rooms', roomRef.id, "members", currentUser.uid);
            await setDoc(memberRef, {
                uid: currentUser.uid,
                role: "admin",
                joinedAt: Timestamp.now(),
        
        });
            return roomRef.id;
        }

    } catch(error) {
        console.error("Error creating room:", error);
        throw error;
    }
}

