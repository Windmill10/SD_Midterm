import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './App.css'
import Navbar from './components/navbar'
import HomePage from './pages/home';
import LoginPage from './pages/login';
import RegisterPage from "./pages/register.tsx";
import ProfilePage from './pages/profile';
import MessagePage from "./pages/chat.tsx";
import RoomPage from './pages/room.tsx';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="content">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/messages" element={<MessagePage />} />
            <Route path="/room/:roomId" element={<RoomPage />} />
          </Routes>
        </main>

      </div>
    </Router>

  )
}

export default App
