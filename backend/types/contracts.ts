export const InsuranceClaimsABI = [
    "function submitClaim(bytes32 customerId, bytes32 claimId, uint256 amount) external",
    "function updateClaimStatus(bytes32 claimId, string memory newStatus) external",
    "function getClaim(bytes32 claimId) external view returns (bytes32 customerId, uint256 amount, uint256 date, string memory status)"
];