
import {Link} from 'react-router-dom'
import './navbar.css'

const Navbar = () => {
    return (
      <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/">
          <h1>FireChat</h1>
        </Link>
      </div>
      <div className="navbar-menu">
        <Link to="/" className="navbar-item">Home</Link>
        <Link to="/login" className="navbar-item">Login</Link>
      </div>
      </nav>
    )
}

export default Navbar;