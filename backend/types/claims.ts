export interface ClaimSubmission {
    customerId: string;
    amount: string;
    documents?: string[];
}

export interface ClaimResponse {
    claimId: string;
    hashedCustomerId: string;
    amount: string;
    contractAddress: string;
    encodedData: string;
}