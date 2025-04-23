import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import {User} from '../common/interfaces';
export const findUserByEmail = async (email: string) => {
  try{
    const userRef = collection(firestore, "users");
    const q = query(userRef, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
      console.log("No matching documents.");
      return null;
    } else {
      const userData = querySnapshot.docs[0].data();
      const user: User = {
        uid: userData.uid,
        email: userData.email,
        displayName: userData.displayName || '',
        photoURL: userData.photoURL || '',
        description: userData.description || '',
        friends: userData.friends || [],
        chatrooms: userData.chatrooms || [],
        // Add any other fields from your User interface
      };
        console.log("User found:", user);
        return user;
    }
  } catch (error) {
    console.error("Error finding user by email:", error);
  }
}