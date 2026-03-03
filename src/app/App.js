import './App.css';
import Reviews from './review/Review';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from '../NavBar/NavBar';

export default function MyApp() {
  return (
    <Router>
      <NavBar />
      <div style={{ padding: '2rem' }}>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} />
          <Route path="/reviews" element={<Reviews /> } />
          <Route path="/about" element={<h2>About Page</h2>} />
        </Routes>
      </div>
    </Router>
  );
}





