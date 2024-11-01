import React from 'react';

interface Claim {
  claimId: string;
  customerId: string;
  amount: string;
  date: string;
  status: string;
}

interface ClaimDetailsProps {
  claim: Claim;
}

const ClaimDetails: React.FC<ClaimDetailsProps> = ({ claim }) => {
  return (
    <div className="card mt-3">
      <div className="card-body">
        <h5 className="card-title">Claim ID: {claim.claimId}</h5>
        <p className="card-text">Customer ID: {claim.customerId}</p>
        <p className="card-text">Amount: {claim.amount}</p>
        <p className="card-text">Date: {new Date(parseInt(claim.date) * 1000).toLocaleString()}</p>
        <p className="card-text">
          Status: 
          <span className={`badge ${claim.status === 'Approved' ? 'bg-success' : claim.status === 'Rejected' ? 'bg-danger' : 'bg-secondary'}`}>
            {claim.status}
          </span>
        </p>
      </div>
    </div>
  );
};

export default ClaimDetails;