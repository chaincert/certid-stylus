# ⚡ Flash Loan Arbitrage Bot — Base Chain

Zero-capital arbitrage bot using **Aave V3 flash loans** on **Base** (Coinbase L2).  
The only cost is gas (~$0.01-0.05 per transaction). All trading capital comes from flash loans.

## Architecture

```
Scanner → Price Feed → Profit Calculator → Executor → FlashLoanArbitrage.sol
   ↓           ↓              ↓               ↓              ↓
  Loop    On-chain         Is spread      Build TX       Aave V3 → DEX A → DEX B → Repay
  ~3s     quotes           > gas+fee?     + submit       All in one atomic transaction
```

## Supported DEXes

| DEX | Type | Router |
|-----|------|--------|
| Uniswap V3 | Concentrated | SwapRouter02 |
| Aerodrome | ve(3,3) AMM | Aerodrome Router |
| SushiSwap | V2 Fork | SushiSwap Router |

## Arbitrage Routes

- **Cross-DEX**: WETH/USDC across Uniswap V3 ↔ Aerodrome ↔ SushiSwap
- **Stablecoin**: USDC ↔ USDbC via stable+volatile pools
- **LST**: cbETH/WETH cross-DEX spread
- **Triangular**: WETH → USDC → DAI → WETH across 3 DEXes

## Quick Start

```bash
# 1. Install dependencies
cd /opt/arb && npm install

# 2. Copy env template
cp .env.example .env
# Edit .env with your private key

# 3. Compile contracts
npx hardhat compile

# 4. Deploy contract (testnet first!)
npx hardhat run scripts/deploy.js --network baseSepolia

# 5. Run bot in dry-run mode (no real trades)
npm run bot:dry

# 6. Run bot live
npm run bot
```

## Configuration

| Variable | Default | Description |
|----------|---------|-------------|
| `PRIVATE_KEY` | - | Bot wallet private key (for gas) |
| `BASE_RPC_URL` | `https://mainnet.base.org` | Base RPC endpoint |
| `FLASH_LOAN_CONTRACT` | - | Deployed contract address |
| `MIN_PROFIT_USD` | `0.50` | Minimum profit to execute |
| `SCAN_INTERVAL_MS` | `3000` | Scan frequency in ms |
| `MAX_GAS_PRICE_GWEI` | `0.5` | Max gas price limit |
| `SLIPPAGE_BPS` | `50` | Slippage tolerance (basis points) |

## Cost Analysis

| Item | Cost |
|------|------|
| Flash loan fee | 0.05% of borrowed amount |
| Gas per trade | ~$0.01-0.05 on Base |
| Required capital | Only gas ETH (~$5-10 to start) |

## ⚠️ Risks

- Failed transactions still cost gas
- MEV bots may front-run profitable opportunities
- Market conditions change between quote and execution (slippage)
- Smart contract risk — always test on Base Sepolia first
- Start with small amounts and monitor closely

## Project Structure

```
arb/
├── contracts/
│   ├── FlashLoanArbitrage.sol    # Core arbitrage contract
│   └── interfaces/
│       ├── IPool.sol             # Aave V3
│       ├── ISwapRouter.sol       # Uniswap V3
│       └── IUniswapV2Router.sol  # V2 + Aerodrome
├── scripts/
│   └── deploy.js                 # Deployment script
├── src/
│   ├── bot/
│   │   ├── scanner.js            # Main entry point
│   │   ├── executor.js           # TX builder
│   │   ├── priceFeed.js          # On-chain price quotes
│   │   └── logger.js             # Console dashboard
│   └── config/
│       ├── addresses.js          # Contract addresses
│       └── pairs.js              # Monitored pairs
├── hardhat.config.js
├── package.json
└── .env.example
```
