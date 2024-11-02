import React, { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const SubmitClaim = () => {
  const navigate = useNavigate();
  const { account, provider } = useWeb3();
  const [customerId, setCustomerId] = useState('');
  const [amount, setAmount] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const validateForm = () => {
    if (!customerId || !amount) {
      setError('Customer ID and Amount are required');
      return false;
    }
    if (isNaN(Number(amount)) || Number(amount) <= 0) {
      setError('Amount must be a positive number');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account || !provider) {
      setError('Please connect your wallet');
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.post('/claims', { customerId, amount });
      const { claimId, contractAddress, encodedData } = response.data;

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: contractAddress,
        data: encodedData
      });

      await tx.wait();

      // Navigate to ViewClaims page with the claim ID
      navigate(`/claims/${claimId}`);
    } catch (error) {
      setError('Failed to submit claim');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Submit a New Claim</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="customerId" className="form-label">Customer ID</label>
          <input
            type="text"
            className="form-control"
            id="customerId"
            value={customerId}
            onChange={(e) => setCustomerId(e.target.value)}
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="amount" className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            required
            min="1"
            step="1"
          />
        </div>
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Claim'}
        </button>
        {error && <div className="alert alert-danger mt-3">{error}</div>}
      </form>
    </div>
  );
};

export default SubmitClaim;