# CertID Stylus Verifier — Arbitrum L2

Hardware attestation verification contract built with **Arbitrum Stylus** (Rust → WASM).

## Why Stylus?

| Operation | Solidity (EVM) | Stylus (WASM) |
|-----------|---------------|---------------|
| TEE Signature Verify | ~5M gas | ~500K gas |
| Storage Mapping Read | ~2.1K gas | ~200 gas |
| Cross-chain Score Update | ~50K gas | ~5K gas |

> "We use Cosmos for Consensus and Stylus for Compute."

## Architecture

```
┌─────────────────────┐     ┌──────────────────────┐
│  Cosmos L1 (certd)  │     │  Arbitrum L2 (Stylus) │
│                     │     │                        │
│  x/hardware module  │────▶│  CertIDVerifier.wasm   │
│  Trust Scoring      │     │  TEE Verification      │
│  Device Registry    │     │  Score Storage          │
└─────────────────────┘     └──────────────────────┘
        ▲                            │
        │     Bridge Relayer         │
        └────────────────────────────┘
```

## Contract API

| Function | Type | Description |
|----------|------|-------------|
| `register_device(bytes32, address)` | Write | Register a device with its owner |
| `update_trust_score(bytes32, u64)` | Write | Relay trust score from Cosmos L1 |
| `verify_tee_attestation(bytes32, bytes)` | Write | Verify TEE proof (WASM-optimized) |
| `get_device_trust(bytes32)` | View | Read device trust score |
| `get_device_owner(bytes32)` | View | Read device owner address |
| `get_total_verifications()` | View | Total successful verifications |

## Build & Deploy

```bash
# Build
cargo build --lib

# Check Stylus compatibility (requires cargo-stylus)
cargo stylus check

# Deploy to Arbitrum Sepolia (when ready)
cargo stylus deploy \
  --private-key $PRIVATE_KEY \
  --endpoint https://sepolia-rollup.arbitrum.io/rpc

# Run tests
cargo test
```

## License

Apache-2.0
