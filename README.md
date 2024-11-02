# InsureChain

This sample project allows users to submit insurance claims, view claim statuses, and for admin (contract owner address) to update claim statuses.
It uses Typescript on frontend (React+Bootstrap) and backend (Express) to keep it simple, Solidity for the smart contract, using Hardhat for local contract development and testing. Ethers for dealing with the blockchain from our typescript apps.

As the Ethereum Goerli testnet is now deprecated, we use the recommended replacement Sepolia instead for the deployed sample.

It was decided to design the project for use with MetaMask - attempting to access any of the frontend pages will prompt the user to connect wallet through MetaMask. Any write actions will be sent to the backend for simple validation, preparation, and encryption, then the user will be prompted to sign the transaction and it goes to the blockchain. The usecase is simple enough that the smart contract does not need to do any super advanced security checks, but with usual security patterns in mind we use OpenZeppelin's implementations for ownership and reentrancy guard. 

## Prerequisites

- [Node.js (v14 or later)](https://nodejs.org/)
- [npm (v6 or later)](https://www.npmjs.com/get-npm)
- [MetaMask extension](https://metamask.io/download.html) installed in your browser

## Local Setup

### Clone the Repository

```bash
git clone https://github.com/DarrielKremov/insurance-chain.git
cd insurance-chain
```

### Install Dependencies

#### Smart Contract
```bash
cd smart-contract
npm install
```

#### Backend
```bash
cd ../backend
npm install
```

#### Frontend
```bash
cd ../frontend
npm install
```

### Start Local Hardhat Node &  Deploy Smart Contract
```bash
cd ../smart-contract
npx hardhat node
```
Once you start the node, you should see a list of private keys and addresses that are predefined for the network. Copy the first address.

Edit the `parameters.json` file in `smart-contract/ignition` - the `owner` field needs to be the address of the first account, the Hardhat Network uses that by default. You can alternatively play around with the config.

After that you can proceed with the deployment:
```bash
npx hardhat ignition deploy ignition/modules/InsuranceClaims.ts --parameters ignition/parameters.json --network localhost
```

### Setup MetaMask
If you don't already have MetaMask installed, you can get it from https://metamask.io/download/

- From the accounts dropdown of the extension use the `Add account or hardware wallet` button
  <br/><br/>
  ![the button]({86002D36-F83D-403D-AA0A-7C05615E471A}.png)
- Then click  `Import account`:
  <br/><br/>
  ![import account view]({A9037BEC-4CE6-423B-8F67-243A15084233}.png)
- Enter the private key for the first address from the Hardhat Network (the address you used as `owner`). You should now have access to the account.
- Connect to your local network - you might see the option automatically as `Localhost 8545`, but you should double-check the settings by clicking the three dots button on the right side and `Edit` to view the settings. `Chain ID` MUST be `31337` and the `Default RPC URL` should be either `localhost:8545` or `127.0.0.1:8545`. If it is not, you should add a custom network instead. It should look like this:
  <br/><br/>
![Testnet setup]({7F558AD6-D169-40A1-909D-DA871426B36F}.png)

### Update backend `.env` file
Create or update the `.env` file in the `backend` directory with the necessary environment variables. It should be like this, just replace with the address of the deployed contract - the Ignition deployment should print it out in the terminal.
```bash
# Backend Configuration
PORT=3001
CONTRACT_ADDRESS=your_deployed_contract_address_here
PROVIDER_URL=http://127.0.0.1:8545
```

### Start backend & frontend
Finally we can launch the apps as well. You will need multiple terminals or run in the background. Keeping it short here with the basic approach with multiple terminals:
```bash
cd backend
npm run dev
```
```bash
cd frontend
npm start
```

The frontend should launch automatically or you can navigate to it at ```http://localhost:3000```

Connect with your new MetaMask address and play around!

## Potential improvements
For the sake of time this sample is extremely simple, though fairly verbose. 
Some of the features that were considered: 
- Allowing the user to upload files, for example images and documents that would be encrypted and stored in a object-store database (e.g. MinIO) or directly on IPFS. Dropped as setup time was getting too involved for a sample project.
- Allowing the user to request (pull over push) payout of approved claims. Non-trivial implementation as maintaining on-chain privacy (not associating the claim with an identifiable customer/address) would require a ZKP setup.
- Upgradable smart contract implementation. Too many risks associated, though often necessary in real-world cases.
- Add admin roles that can be assigned to other addresses, so the contract owner is not the only one able to perform the admin actions.
- Frontend/backend advance checks of current user role to fail requests and block certain UI pages or buttons. Decided to drop that for easier testing of contract owner check (making sure it fails for non-owners attempting to change status). Ultimately checks in those layers would be mostly for convenience and not for function anyway. Nice to haves, not critical for the sample.
- Off-chain audit trail for all actions/transactions/etc, failed or successful.
- Use the events fired from the smart contract to push notifications and update frontend data.
- (Especially for admin view) Have a list of claims directly instead of having to request by ID. Optimal would be to maintain that list in off-chain database and updating it with the smart contract events
- Better look 😭
