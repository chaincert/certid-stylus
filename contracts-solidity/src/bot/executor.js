const { ethers } = require("ethers");
const addr = require("../config/addresses");

// Minimal ABI for the FlashLoanArbitrage contract
const ARB_ABI = [
    "function executeArbitrage(address asset, uint256 amount, bytes calldata params) external",
    "event ArbitrageExecuted(address indexed asset, uint256 borrowed, uint256 profit, uint256 gasUsed)",
];

/**
 * Build and submit the flash loan arbitrage transaction
 * @param {ethers.Wallet} wallet - Funded wallet for gas
 * @param {string} contractAddress - Deployed FlashLoanArbitrage address
 * @param {Object} pair - pair config from pairs.js
 * @param {Object} profitData - from simulateArbitrage
 * @param {boolean} dryRun - if true, only estimate gas
 * @returns {Object} { success, txHash, profit, gasCost }
 */
async function executeArbitrage(wallet, contractAddress, pair, profitData, dryRun = false) {
    const contract = new ethers.Contract(contractAddress, ARB_ABI, wallet);

    const amountIn = ethers.parseUnits(pair.borrowAmount, pair.borrowDecimals);

    // Apply slippage to each step's amountOutMin (configurable, default 1%)
    const slippageBps = parseInt(process.env.SLIPPAGE_BPS || "50"); // 0.5%

    // Build SwapStep[] for the ABI encoding
    const steps = pair.steps.map((step, i) => {
        // For intermediate steps, we use 0 as amountOutMin (the contract checks final profit)
        // For the last step, we enforce minimum output
        const isLast = i === pair.steps.length - 1;
        const amountOutMin = isLast
            ? amountIn + (amountIn * 5n / 10000n) // Must cover at least loan + fee
            : 0n;

        return {
            dexType: step.dexType,
            router: step.router,
            tokenIn: step.tokenIn,
            tokenOut: step.tokenOut,
            fee: step.fee || 0,
            amountOutMin: amountOutMin,
            aeroStable: step.aeroStable || false,
            aeroFactory: step.aeroFactory || ethers.ZeroAddress,
        };
    });

    // Encode ArbParams struct
    const abiCoder = ethers.AbiCoder.defaultAbiCoder();
    const params = abiCoder.encode(
        ["tuple(tuple(uint8 dexType, address router, address tokenIn, address tokenOut, uint24 fee, uint256 amountOutMin, bool aeroStable, address aeroFactory)[] steps, uint256 minProfit)"],
        [{ steps, minProfit: profitData.profit / 2n }] // Accept at least half estimated profit
    );

    // Estimate gas
    let gasEstimate;
    try {
        gasEstimate = await contract.executeArbitrage.estimateGas(
            pair.borrowToken,
            amountIn,
            params
        );
    } catch (err) {
        return {
            success: false,
            error: `Gas estimation failed: ${err.reason || err.message}`,
        };
    }

    // Get gas price
    const feeData = await wallet.provider.getFeeData();
    const gasPrice = feeData.maxFeePerGas || feeData.gasPrice;
    const gasCost = gasEstimate * gasPrice;

    if (dryRun) {
        return {
            success: true,
            dryRun: true,
            gasEstimate: gasEstimate.toString(),
            gasCostETH: ethers.formatEther(gasCost),
            estimatedProfit: ethers.formatUnits(profitData.profit, pair.borrowDecimals),
        };
    }

    // Check max gas price
    const maxGasGwei = parseFloat(process.env.MAX_GAS_PRICE_GWEI || "0.5");
    const maxGasWei = ethers.parseUnits(maxGasGwei.toString(), "gwei");
    if (gasPrice > maxGasWei) {
        return {
            success: false,
            error: `Gas price ${ethers.formatUnits(gasPrice, "gwei")} gwei exceeds max ${maxGasGwei} gwei`,
        };
    }

    // Execute
    try {
        const tx = await contract.executeArbitrage(
            pair.borrowToken,
            amountIn,
            params,
            {
                gasLimit: gasEstimate * 120n / 100n, // 20% buffer
                maxFeePerGas: gasPrice,
            }
        );

        const receipt = await tx.wait();

        // Parse ArbitrageExecuted event
        const event = receipt.logs
            .map(log => { try { return contract.interface.parseLog(log); } catch { return null; } })
            .find(e => e && e.name === "ArbitrageExecuted");

        return {
            success: receipt.status === 1,
            txHash: receipt.hash,
            blockNumber: receipt.blockNumber,
            gasUsed: receipt.gasUsed.toString(),
            gasCostETH: ethers.formatEther(receipt.gasUsed * receipt.gasPrice),
            profit: event ? ethers.formatUnits(event.args.profit, pair.borrowDecimals) : "unknown",
        };
    } catch (err) {
        return {
            success: false,
            error: `TX failed: ${err.reason || err.message}`,
        };
    }
}

module.exports = { executeArbitrage };
