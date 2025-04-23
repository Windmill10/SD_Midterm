import {useState, FormEvent, useEffect} from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {auth} from '../config/firebase';

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {currentUser} = useAuth();
    const navigate = useNavigate();
    useEffect(() => {
        if(currentUser){
            console.log("User is already logged in");
            navigate("/");
        }
    }, [currentUser, navigate]);
    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        try{
            await signInWithEmailAndPassword(auth, email, password);
            navigate("/");
        } catch(error: unknown) {
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
            <p>Don't have an account? <a href="/register" onClick={() => navigate("/register")}>Register</a></p>
            <p>Forgot password? <a href="/forgot-password">Reset Password</a></p>
        </div>

    )
}

export default LoginPage;