import { useEffect} from 'react'; // Removed FormEvent
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../context/AuthContext';
import {useNavigate} from 'react-router-dom';
import {auth} from '../config/firebase';
import {AuthProvider, SignInPage} from "@toolpad/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import {Box} from "@mui/material"; // Removed Paper, Container

const LoginPage = () => {
  const {currentUser} = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if(currentUser){
      console.log("User is already logged in");
      navigate("/");
    }
  }, [currentUser, navigate]);

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
        width: 'auto',
        padding: '2rem',
        // optional: give a background if needed
        // background: '#f5f5f5'
      }}
    >

    <SignInPage
      providers={providers}
      sx={{
        width: '90vw',
        maxWidth: 600,
        minWidth: 320,
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

export default LoginPage;