// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/**
 * @title InsuranceClaims
 * @dev A contract to manage insurance claims submission and status updates.
 */
contract InsuranceClaims is Ownable, ReentrancyGuard {
    constructor(address owner) Ownable(owner) {}

    // Events
    event ClaimSubmitted(bytes32 indexed claimId, address indexed customer, uint256 amount, uint256 date);
    event ClaimStatusUpdated(bytes32 indexed claimId, string status);

    // Struct to hold claim information
    struct Claim {
        bytes32 customerId;
        uint256 amount;
        uint256 date;
        string status;
    }

    // Mappings to store claims
    mapping(bytes32 => Claim) private claims;

    modifier claimExists(bytes32 claimId) {
        require(claims[claimId].date != 0, "Claim does not exist");
        _;
    }

    /**
     * @dev Submit a new claim.
     * @param customerId Hashed customer ID.
     * @param claimId Unique claim ID.
     * @param amount Amount for the claim.
     */
    function submitClaim(
        bytes32 customerId,
        bytes32 claimId,
        uint256 amount
    ) external nonReentrant {
        require(claims[claimId].date == 0, "Claim already exists");
        require(amount > 0, "Claim amount must be greater than 0");

        claims[claimId] = Claim({
            customerId: customerId,
            amount: amount,
            date: block.timestamp,
            status: "Submitted"
        });

        emit ClaimSubmitted(claimId, msg.sender, amount, block.timestamp);
    }

    /**
     * @dev Update the status of an existing claim.
     * @param claimId The unique claim ID.
     * @param newStatus The new status of the claim.
     */
    function updateClaimStatus(
        bytes32 claimId,
        string memory newStatus
    ) external onlyOwner claimExists(claimId) {
        claims[claimId].status = newStatus;

        emit ClaimStatusUpdated(claimId, newStatus);
    }

    /**
     * @dev Retrieve the details of a claim.
     * @param claimId The unique claim ID.
     * @return customerId The hashed customer ID.
     * @return amount The amount for the claim.
     * @return date The timestamp when the claim was submitted.
     * @return status The current status of the claim.
     */
    function getClaim(bytes32 claimId)
        external
        view
        claimExists(claimId)
        returns (bytes32 customerId, uint256 amount, uint256 date, string memory status)
    {
        Claim memory claim = claims[claimId];
        return (claim.customerId, claim.amount, claim.date, claim.status);
    }
}
