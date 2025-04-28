import {useState, FormEvent, useEffect} from 'react'
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {auth} from '../config/firebase';
import {AuthProvider, SignInPage} from "@toolpad/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {Paper, Box, Container} from "@mui/material";
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


  const providers = [
    {id: "google", name: "Google"},
    { id: 'credentials', name: 'Email and Password' }
  ]

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        // optional: give a background if needed
        // background: '#f5f5f5'
      }}
    >

    <SignInPage
      providers={providers}
      className="login-box"
      sx={{
        width: '100%', // Or any max width you want
        maxWidth: '800px',
        height: '100%',
        maxHeight: '600px',
        padding: '2rem',
        borderRadius: '1rem',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}

      signIn={async (
        provider: AuthProvider,
        formData: FormData,
        callbackUrl?: string
      ) => {
        try {
          if (provider.id === 'credentials') {
            const emailInput = formData.get('email')?.toString() || '';
            const passwordInput = formData.get('password')?.toString() || '';
            await signInWithEmailAndPassword(auth, emailInput, passwordInput);
          } else if (provider.id === 'google') {
            const googleProvider = new GoogleAuthProvider();
            await signInWithPopup(auth, googleProvider);
          }

          navigate(callbackUrl || "/");
          return { success: "true" }; // Adjusted to match `AuthResponse`
        } catch (error: unknown) {
          console.error("Error signing in:", error);
          return { success: "false", error: 'Authentication failed' }; // Adjusted to match `AuthResponse`
        }
      }}
    />
    </Box>
  );
}

/*
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
 */
export default LoginPage;