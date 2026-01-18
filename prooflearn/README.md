# ProofLearn – On-Chain Skill Proof & Certificate Platform

ProofLearn is a Web3-native platform where users prove their skills through real tasks and receive NFT certificates as immutable proof of expertise.

## Getting Started

### 1. Smart Contracts (Hardhat)
1. Navigate to the `prooflearn/` directory.
2. Install dependencies: `npm install`
3. Compile contracts: `npx hardhat compile`
4. Deploy to testnet: `npx hardhat run scripts/deploy.js --network mantleTestnet`

### 2. Backend (Express)
1. Navigate to the `backend/` directory.
2. Create a `.env` file (see `.env.example`).
3. Install dependencies: `npm install`
4. Start the server: `node server.js`

### 3. Frontend (React + Vite)
1. Navigate to the `frontend/` directory.
2. Install dependencies: `npm install`
3. Start the dev server: `npm run dev`

## Tech Stack
- **Smart Contracts**: Solidity, OpenZeppelin, Hardhat
- **Backend**: Node.js, Express, MongoDB, Ethers.js
- **Frontend**: React, Tailwind CSS, Framer Motion, Lucide React
- **Identity**: MetaMask / Web3 Wallet

## Project Structure
```text
prooflearn/
├── contracts/          # SkillCertificate (NFT) & TaskRegistry
├── scripts/            # Deployment logic
├── backend/            # API & Admin Minting Bot
└── frontend/           # Marketplace & Profile UI
```

## How it Works
1. **Explore**: Users browse the skill marketplace for tasks.
2. **Submit**: Users complete a task (e.g., code a feature) and submit the URL.
3. **Verify**: Admin reviews the submission on the dashboard.
4. **Mint**: Upon approval, the backend automatically mints an NFT certificate to the user's wallet.
5. **Portfolio**: Users showcase their on-chain certificates on their profile.
