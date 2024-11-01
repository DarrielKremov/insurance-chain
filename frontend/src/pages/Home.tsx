// src/pages/Home.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useWeb3 } from '../context/Web3Context';

const Home = () => {
  const navigate = useNavigate();
  const { isConnected } = useWeb3();

  const handleAdminClick = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    navigate('/admin');
  };

  const handleSubmitClaimClick = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    navigate('/submit');
  };

  const handleViewClaimClick = () => {
    if (!isConnected) {
      alert('Please connect your wallet first');
      return;
    }
    navigate('/claims');
  };

  return (
    <div className="container">
      <h1>Welcome to InsureChain</h1>
      <p>
        To use this application, you need to have MetaMask installed and be connected to the Sepolia testnet.
      </p>
      <p>
        Please connect your MetaMask wallet using the button in the top right corner.
      </p>
      <div className="mt-4">
        <button 
          className="btn btn-primary me-3"
          onClick={handleSubmitClaimClick}
        >
          Submit Claim
        </button>
        <button 
          className="btn btn-secondary me-3"
          onClick={handleViewClaimClick}
        >
          View Claim
        </button>
        <button 
          className="btn btn-secondary"
          onClick={handleAdminClick}
        >
          Admin
        </button>
      </div>
    </div>
  );
};

export default Home;