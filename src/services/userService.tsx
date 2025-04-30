import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { firestore, storage } from '../config/firebase';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { User } from '../common/interfaces';
import { arrayUnion } from 'firebase/firestore';

export const updateUserProfile = async (userId: string, data: Partial<Pick<User, 'displayName' | 'description' | 'photoURL'>>): Promise<void> => {
  if (!userId) {
    throw new Error("User ID is required to update profile.");
  }
  try {
    const userRef = doc(firestore, 'users', userId);
    // Ensure the document exists before trying to update
    const userSnap = await getDoc(userRef);
    if (!userSnap.exists()) {
        console.warn(`User document ${userId} not found, cannot update.`);
        throw new Error(`User profile for ${userId} not found.`);
    }
    await updateDoc(userRef, data);
    console.log(`User profile ${userId} updated successfully.`);
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error; // Re-throw the error for the component to handle
  }
};

export const addFriendToUser = async (userId: string, friendId: string): Promise<void> => {
    if (!userId || !friendId) {
        throw new Error("User ID and friend ID are required to add a friend.");
    }
    try {
        const userRef = doc(firestore, 'users', userId);
        await updateDoc(userRef, {
        friends: arrayUnion(friendId),
        });
        console.log(`Friend ${friendId} added to user ${userId}.`);
        const friendRef = doc(firestore, 'users', friendId);
        await updateDoc(friendRef, {
        friends: arrayUnion(userId),
        });
        console.log(`User ${userId} added friend ${friendId} successfully.`);
        
    } catch (error) {
        console.error("Error adding friend:", error);
        throw error; // Re-throw the error for the component to handle
    }
}

export const uploadProfilePhoto = async (file: File, userId: string): Promise<string> => {
    if(!userId || !file){
        throw new Error("User ID and file are required to upload profile photo.");
    }

    if(!file.type.startsWith("image/")){
        throw new Error("File is not an image.");
    }

    const maxSize = 5 *1024 * 1024; // 5MB
    if(file.size > maxSize){
        throw new Error("File size exceeds the maximum limit of 5MB.");
    }
    try {
        const fileExt = file.name.split('.').pop();
        const storageRef = ref(storage, `user/${userId}/profile-${Date.now()}.${fileExt}`);

        const snapshot = await uploadBytes(storageRef, file);
        const downloadURL = await getDownloadURL(snapshot.ref);
        console.log("File uploaded successfully:", downloadURL);
        return downloadURL;
    }catch (error) {
        console.error("Error uploading file:", error);
        throw new Error("Error uploading file.");
    }
}