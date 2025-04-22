import {useState, FormEvent} from 'react'
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {auth} from '../config/firebase';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    if(currentUser){
        alert("Already logged in"); 
        return;
    }
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch(error: unknown) {
            setError("Invalid email or password");
            console.log(error)
        } 
    }

    return (
        <div>
            <h1>Login Page</h1>
            <form onSubmit={handleLogin}>
                <input type="email" 
                    placeholder="Email" 
                    value={email}
                    onChange={(e => setEmail(e.target.value))}
                />
                <input type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e => setPassword(e.target.value))}
                    />
                <button type="submit">Login</button>

            </form>
            <p>Don't have an account? <a href="/register">Register</a></p>
            <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
        </div>

    )
}

export default LoginPage;