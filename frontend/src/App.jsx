import './App.css';
import HomePage from './HomePage';
import UploadPage from './UploadPage';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app-container">
        <nav className="navbar">
          <a href="/">Home</a>
          <a href="/upload">Upload</a>
        </nav>
        <div className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/upload" element={<UploadPage />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
