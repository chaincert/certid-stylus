# CertID Stylus — Silicon-to-Chain Identity on Arbitrum

Rust-native NIST P-256 ECDSA verification engine for hardware-anchored identity, built with **Arbitrum Stylus** (Rust → WASM).

## Why Stylus?

| Operation | Solidity (EVM) | Stylus (WASM) |
|-----------|----------------|---------------|
| P-256 Signature Verify | ~5M gas | ~500K gas |
| Storage Mapping Read | ~2.1K gas | ~200 gas |
| Cross-chain Score Update | ~50K gas | ~5K gas |

> Rust WASM is ~10x cheaper than EVM equivalents for cryptographic operations.

## Architecture

```
Hardware (Secure Enclave / FaceID)
    │  NIST P-256 signature
    ▼
Rust Engine (Stylus WASM)           ← src/lib.rs
    │  verify_prehash(msg_hash, sig, pubkey)
    ▼
Arbitrum L2 (on-chain result)
    │  registration + fee
    ▼
CertID Manager (Solidity)           ← contracts-solidity/contracts_certid/CertID.sol
```

## Repository Structure

```
certid-stylus/
├── src/
│   └── lib.rs                      # Rust/WASM P-256 verifier (Stylus entrypoint)
├── contracts-solidity/
│   ├── contracts_certid/
│   │   └── CertID.sol              # Monetized manager contract (Toll Road architecture)
│   ├── scripts/
│   │   ├── deployCertID.js         # Hardhat deployment script (Arbitrum Sepolia)
│   │   ├── deploy_certid.js        # Alternate deploy helper
│   │   └── test_stylus_direct.js   # Off-chain verification test
│   └── hardhat_certid.config.js    # Hardhat config (Arbitrum Sepolia)
├── Cargo.toml
└── Cargo.lock
```

## Deployed Contracts

| Contract | Network | Address |
|----------|---------|---------|
| CertID Manager (Solidity) | Arbitrum Sepolia | `0x3c41b733658ECf278dDF140984279Ea571597167E` |
| CertID Verifier (Stylus/WASM) | Arbitrum Sepolia | `0x67921Ae6eFA1c1Ca024725F425056FFaf7705c1E`|

## Key Implementation Details

- **`verify_prehash()`** — Verifies a pre-hashed `bytes32` message against a NIST P-256 signature, bypassing EVM gas limits via WASM execution
- **SEC1 `0x04` prefix** — Properly stripped before passing raw `(x, y)` coordinates to the verifier
- **Toll Road Registration** — `CertID.sol` enforces a `registrationFee` (ETH) per identity registration, creating a sustainable revenue model

## Quick Start

```bash
# Build the Rust/WASM engine
cargo build --release --target wasm32-unknown-unknown

# Deploy the Solidity manager to Arbitrum Sepolia
cd contracts-solidity
npx hardhat run scripts/deployCertID.js --config hardhat_certid.config.js --network arbitrum-sepolia

# Test the off-chain verifier
node scripts/test_stylus_direct.js
```

## Environment Variables

Copy `.env.example` to `.env` and fill in your values:

```bash
cp contracts-solidity/.env.example contracts-solidity/.env
```

Required variables:
- `ARBITRUM_SEPOLIA_RPC_URL` — RPC endpoint
- `PRIVATE_KEY` — Deployer wallet private key (**never commit this**)
