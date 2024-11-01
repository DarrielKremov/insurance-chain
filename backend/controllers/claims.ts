import { Request, Response } from 'express';
import { ethers } from 'ethers';
import { config } from '../config';
import { InsuranceClaimsABI } from '../types/contracts';
import { ClaimSubmission } from '../types/claims';

// For read-only operations
const provider = new ethers.JsonRpcProvider(config.providerUrl);
const contract = new ethers.Contract(config.contractAddress, InsuranceClaimsABI, provider);

export const submitClaim = async (req: Request, res: Response) => {
    try {
        const { customerId, amount }: ClaimSubmission = req.body;

        // Validate input
        if (!customerId || !amount) {
            res.status(400).json({ error: 'Customer ID and Amount are required' });
        }
        if (isNaN(Number(amount)) || Number(amount) <= 0) {
            res.status(400).json({ error: 'Amount must be a positive number' });
        }

        // Generate claim data
        const claimId = ethers.id(Date.now().toString());
        const hashedCustomerId = ethers.id(customerId);
        const parsedAmount = BigInt(amount); // Use BigInt for simple integer amounts

        // Prepare transaction data for frontend to sign
        const iface = new ethers.Interface(InsuranceClaimsABI);
        const encodedData = iface.encodeFunctionData("submitClaim", [
            hashedCustomerId,
            claimId,
            parsedAmount
        ]);

        res.status(200).json({
            claimId,
            hashedCustomerId,
            amount: parsedAmount.toString(),
            contractAddress: config.contractAddress,
            encodedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to prepare claim submission' });
    }
};

export const getClaim = async (req: Request, res: Response) => {
    try {
        const { claimId } = req.params;
        const claim = await contract.getClaim(claimId);

        // Convert BigInt values to strings
        const claimResponse = {
            customerId: claim.customerId,
            amount: claim.amount.toString(),
            date: claim.date.toString(),
            status: claim.status
        };

        res.json(claimResponse);
    } catch (error) {
        console.error('Error fetching claim:', error);
        res.status(404).json({ error: 'Claim not found' });
    }
};

export const updateClaimStatus = async (req: Request, res: Response) => {
    try {
        const { claimId } = req.params;
        const { status } = req.body;

        // Validate status values
        const validStatuses = ['Submitted', 'Approved', 'Rejected'];
        if (!validStatuses.includes(status)) {
            res.status(400).json({ error: 'Invalid status value' });
            return;
        }

        // Prepare transaction data for frontend to sign
        const iface = new ethers.Interface(InsuranceClaimsABI);
        const encodedData = iface.encodeFunctionData("updateClaimStatus", [
            claimId,
            status
        ]);

        res.status(200).json({
            claimId,
            status,
            contractAddress: config.contractAddress,
            encodedData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to prepare status update' });
    }
};