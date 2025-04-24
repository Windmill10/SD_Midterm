import {Timestamp} from "firebase/firestore";

export interface Message {
  id: string,
  text: string,
  senderId: string,
  createdAt: Timestamp,
}
export interface Room {
  name: string,
  roomId: string,
  description: string,
  createdAt: Timestamp,
  createdBy: string,
  isPrivate: boolean,
  messages?: Message[],
}

export interface User {
  uid: string,
  displayName: string,
  description: string,
  email: string,
  chatrooms: string[],
  photoURL: string,
  friends: string[],
}