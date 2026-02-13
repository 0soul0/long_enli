import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Scan from './pages/Scan.tsx';
import Generate from './pages/Generate.tsx';
import QRResult from './pages/QRResult.tsx';
import './index.css';

function App() {
  return (
    <Router>
      <div className="app-container">
        <Navbar />
        <main className="container">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/scan" element={<Scan />} />
            <Route path="/generate" element={<Generate />} />
            <Route path="/qr-result" element={<QRResult />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
