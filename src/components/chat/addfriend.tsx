import { FormEvent, useState } from "react";
import { findUserByEmail } from "../../common/findUser";

export const AddFriend = () => {
    const [email, setEmail] = useState("");
    const handleAddFriend = async (e: FormEvent) => {
        e.preventDefault();
        const user = await findUserByEmail(email);
        if (user) {
        console.log("User found:", user);
        } else {
        console.log("User not found");
        }
    };
    
    return (
        <div>
        <h1>Add Friend</h1>
        <form onSubmit={handleAddFriend}> 
        <input type="text" placeholder="Enter email" value={email} onChange={(e => setEmail(e.target.value))}/>
        <button type="submit">Add Friend</button>
        </form>
        </div>
    );

}