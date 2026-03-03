import { Link } from 'react-router-dom';
import './NavBar.css';

function NavBar() {
    return (
        <nav className="nav">
            <h1 className="logo">
                /Ryan's Nook<span className='blinkingCursor'>|</span>
            </h1>
            <ul className="nav-links">
                <li><Link to="/">Home</Link></li>
                <li><Link to="/reviews">Reviews</Link></li>
                <li><Link to="/about">About</Link></li>
            </ul>
        </nav>
    );
}

export default NavBar;