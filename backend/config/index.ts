import dotenv from 'dotenv';

dotenv.config();

export const config = {
    port: process.env.PORT || 3001,
    contractAddress: process.env.CONTRACT_ADDRESS || '',
    providerUrl: process.env.PROVIDER_URL || 'http://localhost:8545',
    privateKey: process.env.PRIVATE_KEY || ''
};