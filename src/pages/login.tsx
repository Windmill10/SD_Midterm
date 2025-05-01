import { useEffect } from 'react'; // Removed FormEvent
import { signInWithEmailAndPassword } from "firebase/auth";
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom'; // Import Link
import { auth, firestore } from '../config/firebase'; // Import firestore
import { AuthProvider, SignInPage } from "@toolpad/core";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { Box, Typography, Paper } from "@mui/material"; // Import Paper
import { doc, setDoc, getDoc } from 'firebase/firestore'; // Import Firestore functions
import { User } from '../common/interfaces'; // Import User interface
import theme from '../theme'; // Import theme for consistent styling

const LoginPage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    if (currentUser) {
      console.log("User is already logged in");
      navigate("/");
    }
  }, [currentUser, navigate]);

  const providers = [
    { id: "google", name: "Google" },
    { id: 'credentials', name: 'Email and Password' }
  ];

  return (
    <Box
      sx={{
        minHeight: 'calc(100vh - 60px)', // Adjust for navbar height
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        pt: '60px', // Add padding top equal to navbar height
        bgcolor: 'background.default', // Use theme background
        maxHeight: '10%', // Prevent overflow
      }}
    >
      <Paper
        elevation={3}
        sx={{
          p: { xs: 2, sm: 4 }, // Responsive padding
          borderRadius: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          width: '40vw', 
          maxWidth: '80vw', // Constrain width
          height: '60vh',
          mx: 'auto', // Center horizontally
        }}
      >
        <SignInPage
          providers={providers}
          sx={{
            width: '100%', // Take full width of Paper
            p: 0,
            border: 'none',
            boxShadow: 'none',
            '& .MuiTextField-root': { mb: 2 }, // Add margin bottom to text fields if needed
            '& .MuiButton-root': { mt: 1, py: 1.2 }, // Style buttons within SignInPage
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
                const userCredential = await signInWithPopup(auth, googleProvider);
                const user = userCredential.user;

                const userRef = doc(firestore, "users", user.uid);
                const userSnap = await getDoc(userRef);

                if (!userSnap.exists()) {
                  console.log(`User ${user.uid} not found in Firestore. Creating...`);
                  const newUser: User = {
                    uid: user.uid,
                    displayName: user.displayName || '',
                    description: '',
                    email: user.email || '',
                    photoURL: user.photoURL || '',
                    friends: [],
                    chatrooms: [],
                    phoneNumber: "", // Initialize phone number
                    address: "",     // Initialize address
                  };
                  await setDoc(userRef, newUser);
                  console.log(`User ${user.uid} created in Firestore.`);
                } else {
                  console.log(`User ${user.uid} already exists in Firestore.`);
                }
              }

              navigate(callbackUrl || "/");
              return { success: "true" }; // Adjusted to match `AuthResponse`
            } catch (error: unknown) {
              console.error("Error signing in:", error);
              let errorMessage = 'Authentication failed';
              if (typeof error === 'object' && error !== null && 'code' in error) {
                const errorCode = (error as { code: string }).code;
                if (errorCode === 'auth/user-not-found' || errorCode === 'auth/wrong-password') {
                  errorMessage = 'Invalid email or password.';
                } else if (errorCode === 'auth/popup-closed-by-user') {
                  errorMessage = 'Google Sign-in cancelled.';
                }
              }
              return { success: "false", error: errorMessage }; // Adjusted to match `AuthResponse`
            }
          }}
        />
      </Paper>
      <Typography align="center" sx={{ my: 3, width: '100%' }}>
          Don't have an account?{' '}
          <Link to="/register" style={{ textDecoration: 'none', color: theme.palette.primary.main, fontWeight: 500 }}>
            Register here
          </Link>
        </Typography>
    </Box>
  );
}

export default LoginPage;