import { FormEvent, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {auth} from '../config/firebase';
const RegisterPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
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
            await createUserWithEmailAndPassword(auth, email, password);
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
                <button type="submit">Register</button>
          </form>
      </div>
    )
}

export default RegisterPage;