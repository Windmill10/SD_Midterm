import { collection, addDoc, doc, updateDoc, getDoc, query, where, getDocs, arrayUnion, Timestamp, setDoc } from 'firebase/firestore';
import {firestore} from '../config/firebase';
import { User } from '../common/interfaces';
import {Room, Message} from '../common/interfaces';

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
            await updateDoc(userRef, {
                chatrooms: arrayUnion(roomRef.id),
            });

            return roomRef.id;
        }

    } catch(error) {
        console.error("Error creating room:", error);
        throw error;
    }
}

