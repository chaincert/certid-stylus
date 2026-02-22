#!/usr/bin/env node
/**
 * Flash Loan Arbitrage Bot — Scanner
 *
 * Main entry point. Continuously monitors configured pairs for price
 * discrepancies across DEXes and triggers flash loan arbitrage when profitable.
 *
 * Usage:
 *   node src/bot/scanner.js             # Live mode
 *   node src/bot/scanner.js --dry-run   # Simulate only (no txs)
 */

require("dotenv").config();
const { ethers } = require("ethers");
const pairs = require("../config/pairs");
const { simulateArbitrage } = require("./priceFeed");
const { executeArbitrage } = require("./executor");
const logger = require("./logger");

// ═══════════════════════════════════════════════════════════════
//                        CONFIG
// ═══════════════════════════════════════════════════════════════

const RPC_URL = process.env.BASE_RPC_URL || "https://mainnet.base.org";
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const CONTRACT_ADDRESS = process.env.FLASH_LOAN_CONTRACT;
const MIN_PROFIT_USD = parseFloat(process.env.MIN_PROFIT_USD || "0.50");
const SCAN_INTERVAL = parseInt(process.env.SCAN_INTERVAL_MS || "3000");
const DRY_RUN = process.argv.includes("--dry-run");

// Rough ETH price for USD profit estimation (updated periodically)
let ethPriceUsd = 2500;

// ═══════════════════════════════════════════════════════════════
//                        MAIN
// ═══════════════════════════════════════════════════════════════

async function main() {
    logger.banner();

    // Validate config
    if (!PRIVATE_KEY && !DRY_RUN) {
        logger.error("PRIVATE_KEY not set in .env — use --dry-run for simulation mode");
        process.exit(1);
    }

    // Setup provider + wallet
    const provider = new ethers.JsonRpcProvider(RPC_URL);
    const network = await provider.getNetwork();
    logger.info(`Connected to ${network.name} (chain ${network.chainId})`);

    let wallet = null;
    if (PRIVATE_KEY) {
        wallet = new ethers.Wallet(PRIVATE_KEY, provider);
        const balance = await provider.getBalance(wallet.address);
        logger.info(`Wallet: ${wallet.address}`);
        logger.info(`Balance: ${ethers.formatEther(balance)} ETH`);

        if (balance === 0n) {
            logger.error("Wallet has 0 ETH — need gas funds to operate!");
            if (!DRY_RUN) process.exit(1);
        }
    }

    if (DRY_RUN) {
        logger.info("🏜️  DRY RUN MODE — no transactions will be submitted");
    }

    if (!CONTRACT_ADDRESS && !DRY_RUN) {
        logger.error("FLASH_LOAN_CONTRACT not set — deploy the contract first");
        process.exit(1);
    }

    logger.info(`Monitoring ${pairs.length} pairs every ${SCAN_INTERVAL}ms`);
    logger.info(`Min profit threshold: $${MIN_PROFIT_USD}`);
    logger.info("─".repeat(55));

    // Update ETH price periodically
    updateEthPrice(provider);
    setInterval(() => updateEthPrice(provider), 60000);

    // Main scan loop
    while (true) {
        try {
            await scanAllPairs(provider, wallet);
        } catch (err) {
            logger.error("Scan cycle error", err);
        }
        await sleep(SCAN_INTERVAL);
    }
}

// ═══════════════════════════════════════════════════════════════
//                       SCAN LOGIC
// ═══════════════════════════════════════════════════════════════

async function scanAllPairs(provider, wallet) {
    logger.scan(pairs.length);

    // Scan all pairs concurrently
    const results = await Promise.allSettled(
        pairs.map(pair => scanPair(provider, wallet, pair))
    );

    // Log any rejected promises
    results.forEach((r, i) => {
        if (r.status === "rejected") {
            logger.error(`Pair ${pairs[i].name} scan failed`, r.reason);
        }
    });
}

async function scanPair(provider, wallet, pair) {
    const result = await simulateArbitrage(provider, pair);

    if (result.profit === 0n) {
        logger.noOpportunity(pair.name);
        return;
    }

    // Estimate USD profit
    const profitFormatted = ethers.formatUnits(result.profit, pair.borrowDecimals);
    let profitUsd;
    if (pair.borrowSymbol === "WETH") {
        profitUsd = (parseFloat(profitFormatted) * ethPriceUsd).toFixed(2);
    } else {
        profitUsd = parseFloat(profitFormatted).toFixed(2); // USDC/DAI ≈ $1
    }

    // Check minimum profit threshold
    if (parseFloat(profitUsd) < MIN_PROFIT_USD) {
        logger.noOpportunity(pair.name);
        return;
    }

    // Opportunity found!
    logger.opportunity(pair.name, profitFormatted, profitUsd);

    if (DRY_RUN) {
        if (wallet && CONTRACT_ADDRESS) {
            const dryResult = await executeArbitrage(wallet, CONTRACT_ADDRESS, pair, result, true);
            logger.dryRun(pair.name, dryResult);
        }
        return;
    }

    // Execute the arbitrage!
    if (wallet && CONTRACT_ADDRESS) {
        const execResult = await executeArbitrage(wallet, CONTRACT_ADDRESS, pair, result, false);
        logger.executed(pair.name, execResult);
    }
}

// ═══════════════════════════════════════════════════════════════
//                        HELPERS
// ═══════════════════════════════════════════════════════════════

async function updateEthPrice(provider) {
    try {
        // Quick price check via Uniswap V3 WETH/USDC pool
        const addr = require("../config/addresses");
        const { getQuote } = require("./priceFeed");
        const oneEth = ethers.parseEther("1");
        const usdcOut = await getQuote(provider, {
            dexType: addr.DEX_UNISWAP_V3,
            router: addr.UNISWAP_V3_ROUTER,
            tokenIn: addr.WETH,
            tokenOut: addr.USDC,
            fee: addr.FEE_LOW,
        }, oneEth);

        if (usdcOut > 0n) {
            ethPriceUsd = parseFloat(ethers.formatUnits(usdcOut, 6));
            logger.info(`ETH price: $${ethPriceUsd.toFixed(2)}`);
        }
    } catch (err) {
        // Silently keep the old price
    }
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// ═══════════════════════════════════════════════════════════════
//                        RUN
// ═══════════════════════════════════════════════════════════════

main().catch(err => {
    console.error("Fatal error:", err);
    process.exit(1);
});
