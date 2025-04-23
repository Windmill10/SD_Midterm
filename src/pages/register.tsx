import { FormEvent, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {setDoc, doc} from "firebase/firestore";
import {firestore} from "../config/firebase";
import {auth} from "../config/firebase";
import {User} from "../common/interfaces.tsx";
const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const navigate = useNavigate();
    const handleRegister = async (e: FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            // Registration logic here
            console.log("Registering user with email:", email);
            const userCredential =  await createUserWithEmailAndPassword(auth, email, password);
            const user: User = {
              uid: userCredential.user.uid,
              displayName: username,
              description: "",
              email: userCredential.user.email || "",
              photoURL: "",
              friends: [],
              chatrooms: [],
            }
            await setDoc(doc(firestore, "users", user.uid), user);
            navigate("/");
        } catch (error) {
            console.error("Error registering user:", error);
            alert(error);
        }
    }
    return (
      <div>
          <h1>Register Page</h1>
          <form onSubmit={handleRegister}>
              <input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={(e=> setEmail(e.target.value))}
                  required
              />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e => setPassword(e.target.value))}
                    required
                />
                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e => setConfirmPassword(e.target.value))}
                    required
                />
              <input
                type="username"
                placeholder="Username"
                value={username}
                onChange={(e => setUsername(e.target.value))}
                required
              />
                <button type="submit">Register</button>
          </form>
      </div>
    )
}

export default RegisterPage;