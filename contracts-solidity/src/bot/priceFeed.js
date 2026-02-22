const { ethers } = require("ethers");
const addr = require("../config/addresses");

// ═══════════════════════════════════════════════════════════════
//                      ABIs (minimal)
// ═══════════════════════════════════════════════════════════════

const QUOTER_ABI = [
    "function quoteExactInputSingle((address tokenIn, address tokenOut, uint256 amountIn, uint24 fee, uint160 sqrtPriceLimitX96)) external returns (uint256 amountOut, uint160 sqrtPriceX96After, uint32 initializedTicksCrossed, uint256 gasEstimate)",
];

const V2_ROUTER_ABI = [
    "function getAmountsOut(uint256 amountIn, address[] calldata path) external view returns (uint256[] memory amounts)",
];

const AERO_ROUTER_ABI = [
    "function getAmountsOut(uint256 amountIn, (address from, address to, bool stable, address factory)[] calldata routes) external view returns (uint256[] memory amounts)",
];

/**
 * Get a price quote from a specific DEX
 * @param {ethers.Provider} provider
 * @param {Object} step - swap step from pairs config
 * @param {bigint} amountIn - amount in smallest units
 * @returns {Promise<bigint>} expected output amount
 */
async function getQuote(provider, step, amountIn) {
    try {
        if (step.dexType === addr.DEX_UNISWAP_V3) {
            return await getV3Quote(provider, step, amountIn);
        } else if (step.dexType === addr.DEX_UNISWAP_V2) {
            return await getV2Quote(provider, step, amountIn);
        } else if (step.dexType === addr.DEX_AERODROME) {
            return await getAeroQuote(provider, step, amountIn);
        }
    } catch (err) {
        // Pool might not exist or have insufficient liquidity
        return 0n;
    }
}

async function getV3Quote(provider, step, amountIn) {
    const quoter = new ethers.Contract(addr.UNISWAP_V3_QUOTER, QUOTER_ABI, provider);
    const result = await quoter.quoteExactInputSingle.staticCall({
        tokenIn: step.tokenIn,
        tokenOut: step.tokenOut,
        amountIn: amountIn,
        fee: step.fee,
        sqrtPriceLimitX96: 0,
    });
    return result.amountOut;
}

async function getV2Quote(provider, step, amountIn) {
    const router = new ethers.Contract(step.router, V2_ROUTER_ABI, provider);
    const amounts = await router.getAmountsOut(amountIn, [step.tokenIn, step.tokenOut]);
    return amounts[1];
}

async function getAeroQuote(provider, step, amountIn) {
    const router = new ethers.Contract(step.router, AERO_ROUTER_ABI, provider);
    const routes = [{
        from: step.tokenIn,
        to: step.tokenOut,
        stable: step.aeroStable,
        factory: step.aeroFactory,
    }];
    const amounts = await router.getAmountsOut(amountIn, routes);
    return amounts[1];
}

/**
 * Simulate the full multi-step swap and return final output
 */
async function simulateArbitrage(provider, pair) {
    const amountIn = ethers.parseUnits(pair.borrowAmount, pair.borrowDecimals);
    let current = amountIn;

    for (const step of pair.steps) {
        current = await getQuote(provider, step, current);
        if (current === 0n) return { profit: 0n, output: 0n, input: amountIn };
    }

    // Flash loan fee: 0.05% (5 bps)
    const flashFee = amountIn * 5n / 10000n;
    const totalOwed = amountIn + flashFee;
    const profit = current > totalOwed ? current - totalOwed : 0n;

    return { profit, output: current, input: amountIn, flashFee };
}

module.exports = { getQuote, simulateArbitrage };
