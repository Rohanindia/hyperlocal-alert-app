import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import BottomNav from './components/BottomNav';
import AlertFeed from './pages/AlertFeed';
import MapView from './pages/MapView';
import ReportAlert from './pages/ReportAlert';
import ErrorBoundary from './components/ErrorBoundary';
import { signInAnonymously_user } from './firebase';
import './index.css';

function App() {
  useEffect(() => { signInAnonymously_user(); }, []);

  return (
    <ErrorBoundary>
      <Router>
        <div className="app-container">
          <header className="app-header">
            <h1>Hyperlocal Alerts</h1>
          </header>

          <main className="main-content">
            <Routes>
              <Route path="/" element={<Navigate to="/feed" />} />
              <Route path="/feed" element={<AlertFeed />} />
              <Route path="/map" element={<MapView />} />
              <Route path="/report" element={<ReportAlert />} />
            </Routes>
          </main>
          
          <BottomNav />
        </div>
      </Router>
    </ErrorBoundary>
  );
}

export default App;
