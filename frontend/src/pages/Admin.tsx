import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';
import api from '../services/api';
import ClaimDetails from '../components/ClaimDetails';

interface Claim {
  claimId: string;
  customerId: string;
  amount: string;
  date: string;
  status: string;
}

const AdminDashboard = () => {
  const { account, provider } = useWeb3();
  const [claimId, setClaimId] = useState('');
  const [claim, setClaim] = useState<Claim | null>(null);
  const [newStatus, setNewStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchClaim = async () => {
    if (!account) {
      setError('Please connect your wallet');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.get(`/claims/${claimId}`);
      setClaim(response.data);
    } catch (error) {
      setError('Failed to fetch claim');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async () => {
    if (!account || !provider || !claimId) {
      setError('Please connect your wallet and fetch a claim');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await api.put(`/claims/${claimId}/status`, { status: newStatus });
      const { contractAddress, encodedData } = response.data;

      const signer = await provider.getSigner();
      const tx = await signer.sendTransaction({
        to: contractAddress,
        data: encodedData
      });

      await tx.wait();
      alert('Claim status updated successfully');

      // Fetch the updated claim details
      await handleFetchClaim();
    } catch (error) {
      setError('Failed to update claim status');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <h2>Admin Dashboard</h2>
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
      {claim && (
        <>
          <ClaimDetails claim={claim} />
          <div className="mb-3">
            <label htmlFor="newStatus" className="form-label">New Status</label>
            <select
              className="form-select"
              id="newStatus"
              value={newStatus}
              onChange={(e) => setNewStatus(e.target.value)}
              required
            >
              <option value="">Select Status</option>
              <option value="Submitted">Submitted</option>
              <option value="Approved">Approved</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          <button 
            className="btn btn-primary"
            onClick={handleUpdateStatus}
            disabled={loading}
          >
            {loading ? 'Updating...' : 'Update Status'}
          </button>
        </>
      )}
    </div>
  );
};

export default AdminDashboard;