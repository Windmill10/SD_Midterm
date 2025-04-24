import { collection, query, where, getDocs } from 'firebase/firestore';
import { firestore } from '../config/firebase';
import {User} from '../common/interfaces';
import { useAuth } from '../context/AuthContext';
import { useEffect, useState, useCallback } from 'react';
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

export const useUserMetadata = () => {
    const [userMetadata, setUserMetadata] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const { currentUser } = useAuth();
    
    const fetchUserMetadata = useCallback(async () => {
      if (!currentUser?.email) {
        setUserMetadata(null);
        setLoading(false);
        return;
      }
      
      setLoading(true);
      try {
        const userData = await findUserByEmail(currentUser.email);
        if(!userData) {
            alert("User not found");
            setUserMetadata(null);
            return;
        }
        setUserMetadata(userData);
      } catch (error) {
        console.error("Error fetching user metadata:", error);
      } finally {
        setLoading(false);
      }
    }, [currentUser]);
    
    useEffect(() => {
      fetchUserMetadata();
    }, [fetchUserMetadata]);
    return { 
      userMetadata, 
      loading, 
      refetch: fetchUserMetadata 
    };
  };