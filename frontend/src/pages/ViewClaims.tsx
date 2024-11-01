import React, { useEffect, useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import { useParams } from 'react-router-dom';
import api from '../services/api';
import ClaimDetails from '../components/ClaimDetails';

interface Claim {
  claimId: string;
  customerId: string;
  amount: string;
  date: string;
  status: string;
}

const ViewClaims = () => {
  const { account } = useWeb3();
  const { claimId: paramClaimId } = useParams<{ claimId: string }>();
  const [claimId, setClaimId] = useState(paramClaimId || '');
  const [claim, setClaim] = useState<Claim | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchClaim = async (id: string) => {
    if (!account) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      console.log('Fetching claim with ID:', id); // Log the claim ID
      const response = await api.get(`/claims/${id}`);
      setClaim(response.data);
    } catch (error) {
      setError('Failed to fetch claim');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (paramClaimId) {
      fetchClaim(paramClaimId);
    }
  }, [account, paramClaimId]);

  const handleFetchClaim = async () => {
    fetchClaim(claimId);
  };

  return (
    <div className="container">
      <h2>View Claim</h2>
      <div className="mb-3">
        <label htmlFor="claimId" className="form-label">Claim ID</label>
        <input
          type="text"
          className="form-control"
          id="claimId"
          value={claimId}
          onChange={(e) => setClaimId(e.target.value)}
          required
        />
      </div>
      <button 
        className="btn btn-primary"
        onClick={handleFetchClaim}
        disabled={loading}
      >
        {loading ? 'Fetching...' : 'Fetch Claim'}
      </button>
      {error && <div className="alert alert-danger mt-3">{error}</div>}
      {claim && <ClaimDetails claim={claim} />}
    </div>
  );
};

export default ViewClaims;