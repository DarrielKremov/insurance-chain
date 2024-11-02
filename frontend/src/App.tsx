import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Web3Provider } from './context/Web3Context';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import SubmitClaim from './pages/SubmitClaim';
import ViewClaims from './pages/ViewClaims';
import AdminDashboard from './pages/Admin';
import ProtectedRoute from './components/ProtectedRoute';

export default function App() {
  return (
    <Web3Provider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/submit" element={
              <ProtectedRoute>
                <SubmitClaim />
              </ProtectedRoute>
            }
          />
          <Route 
            path="/claims" 
            element={
              <ProtectedRoute>
                <ViewClaims />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/claims/:claimId" 
            element={
              <ProtectedRoute>
                <ViewClaims />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute>
                <AdminDashboard />
              </ProtectedRoute>
            } 
          />
          {/* Workaround for issue with GitHub Pages */}
          <Route path="/insurance-chain" element={<Navigate to="/" />} />
        </Routes>
      </BrowserRouter>
    </Web3Provider>
  );
}