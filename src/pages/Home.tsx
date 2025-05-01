import { Container, Typography, Button, Paper, Stack } from '@mui/material';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Import useAuth to check login status
import ChatIcon from '@mui/icons-material/Chat';
import PersonIcon from '@mui/icons-material/Person';
import LoginIcon from '@mui/icons-material/Login';

const HomePage = () => {
    const { currentUser } = useAuth(); // Get current user status

    return (
        <Container maxWidth="md" sx={{ mt: 8, mb: 4 }}>
            <Paper
                elevation={3}
                sx={{
                    p: { xs: 3, md: 6 },
                    textAlign: 'center',
                    borderRadius: 2,
                    bgcolor: 'background.paper',
                }}
            >
                <Typography
                    variant="h2"
                    component="h1"
                    gutterBottom
                    fontWeight={700}
                    color="primary.main"
                >
                    Welcome to FireChat!
                </Typography>
                <Typography variant="h5" color="text.secondary" paragraph sx={{ mb: 4 }}>
                    Connect, chat, and share moments instantly with friends and colleagues.
                </Typography>

                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                >
                    {currentUser ? (
                        <>
                            <Button
                                component={Link}
                                to="/messages"
                                variant="contained"
                                size="large"
                                startIcon={<ChatIcon />}
                                sx={{ py: 1.5 }}
                            >
                                Go to Chat
                            </Button>
                            <Button
                                component={Link}
                                to="/profile"
                                variant="outlined"
                                size="large"
                                startIcon={<PersonIcon />}
                                sx={{ py: 1.5 }}
                            >
                                View Profile
                            </Button>
                        </>
                    ) : (
                        <Button
                            component={Link}
                            to="/login"
                            variant="contained"
                            size="large"
                            startIcon={<LoginIcon />}
                            sx={{ py: 1.5 }}
                        >
                            Login / Register
                        </Button>
                    )}
                </Stack>
            </Paper>

            {/* Optional: Add more sections below */}
            {/*
            <Box sx={{ mt: 6 }}>
                <Typography variant="h4" gutterBottom align="center">Features</Typography>
                // Add feature descriptions or icons here
            </Box>
            */}
        </Container>
    );
}
export default HomePage;