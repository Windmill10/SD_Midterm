import { FormEvent, useState } from 'react';
import {useNavigate} from "react-router-dom";
import {createUserWithEmailAndPassword} from "firebase/auth";
import {setDoc, doc} from "firebase/firestore";
import {firestore} from "../config/firebase";
import {auth} from "../config/firebase";
import {User} from "../common/interfaces.tsx";
import {Avatar, Container} from "@mui/material";
import LockIcon from '@mui/icons-material/Lock';
import {Typography, Box, TextField, Button} from "@mui/material";
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
              phoneNumber: "", // Initialize phone number
              address: "",     // Initialize address
            }
            await setDoc(doc(firestore, "users", user.uid), user);
            navigate("/");
        } catch (error) {
            console.error("Error registering user:", error);
            alert(error);
        }
    }
  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
          <LockIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" onSubmit={handleRegister} sx={{ mt: 3, width: '100%' }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            id="username"
            label="Username"
            name="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Register
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default RegisterPage;