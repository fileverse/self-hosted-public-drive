# Self-Hosted Public Drive

A decentralized file management system that gives you full control over your content through peer-to-peer networks, decentralized ID, and public blockchains.

## Overview

This project provides a self-hosted approach to non-encrypted file management, offering users complete control over their infrastructure:
- Where you store your content
- How you host your static drive
- How you deploy your onchain smart account

## Features

- **Decentralized Storage**: Uses IPFS for content storage
- **Blockchain Integration**: Smart contracts on Gnosis Chain
- **Account Abstraction**: Utilizes Pimlico paymasters
- **File Management**:
  - Upload and organize files
  - Create sections for better content organization
  - Preview supported file types
  - Public sharing capabilities
- **Portal System**:
  - Create and manage your own portal
  - Proof of publishing verification
  - Owner address verification
  - Content hash tracking
  - Onchain record verification

## Technical Stack

- Frontend: React with TypeScript
- Storage: IPFS
- Blockchain: Gnosis Chain
- Account Abstraction: Pimlico
- Styling: Tailwind CSS

## Getting Started

1. Clone the repository
2. Install dependencies:
```bash
npm install
```
3. Set up environment variables:
```env
VITE_ACCESS_CODE=your_access_code

VITE_RPC_URL=your_rpc_endpoint
```
4. Run the development server:
```bash
npm run dev
```

## Usage

### Creating a Portal
1. Access the application
2. Choose "Create New"
3. Fill in portal details:
   - Portal Name
   - Portal Description
   - Pinata Keys (for IPFS)
   - RPC Endpoint

### Managing Files
- Upload files through the intuitive interface
- Organize content into sections
- Preview files directly in the application
- Share content publicly

### Verification
Each portal provides proof of publishing with:
- Owner address (verified on Gnosisscan)
- Onchain record (verified on Gnosisscan)

## Architecture

The application follows a decentralized architecture:
- Frontend serves as a static interface
- IPFS handles content storage
- Smart contracts manage ownership and access
- Account abstraction provides seamless blockchain interactions

## Security

- Non-encrypted file management
- Public blockchain verification
- Decentralized identity management
- Smart contract-based access control

## License

GNU GPL v3

## Important Notes

This repository is experimental and its authors:
- Are not responsible for any warranties regarding the software
- Are not obligated to provide guarantees or support
- Cannot be held liable for damages caused by the software

## Customization

You can customize your public drive by:
- Using different networks
- Implementing alternative middleware
- Modifying storage solutions
- Adjusting smart contract interactions

## Support

While this is an experimental project with no official support, you can:
- Open issues for bugs
- Suggest improvements through pull requests

---

Built with ❤️ for decentralized content management