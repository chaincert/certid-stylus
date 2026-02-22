const hre = require("hardhat");

async function main() {
    console.log("Deploying FlashLoanArbitrage to", hre.network.name);

    // Aave V3 Pool address on Base mainnet
    // Source: https://docs.aave.com/developers/deployed-contracts/v3-mainnet/base
    const AAVE_POOL = "0xA238Dd80C259a72e81d7e4664a9801593F98d1c5";

    // DEX Router addresses on Base
    const UNISWAP_V3_ROUTER = "0x2626664c2603336E57B271c5C0b26F421741e481"; // SwapRouter02
    const SUSHISWAP_ROUTER = "0x6BDED42c6DA8FBf0d2bA55B2fa120C5e0c8D7891";
    const AERODROME_ROUTER = "0xcF77a3Ba9A5CA399B7c97c74d54e5b1Beb874E43";

    const FlashLoanArbitrage = await hre.ethers.getContractFactory("FlashLoanArbitrage");
    const arb = await FlashLoanArbitrage.deploy(AAVE_POOL);
    await arb.waitForDeployment();

    const arbAddress = await arb.getAddress();
    console.log("FlashLoanArbitrage deployed to:", arbAddress);

    // Approve DEX routers
    console.log("Approving DEX routers...");
    const tx = await arb.setRouters(
        [UNISWAP_V3_ROUTER, SUSHISWAP_ROUTER, AERODROME_ROUTER],
        [true, true, true]
    );
    await tx.wait();
    console.log("Routers approved!");

    console.log("\n═══════════════════════════════════════════");
    console.log("  Deployment Summary");
    console.log("═══════════════════════════════════════════");
    console.log("  Network:        ", hre.network.name);
    console.log("  Contract:       ", arbAddress);
    console.log("  Aave Pool:      ", AAVE_POOL);
    console.log("  Uniswap V3:     ", UNISWAP_V3_ROUTER);
    console.log("  SushiSwap:      ", SUSHISWAP_ROUTER);
    console.log("  Aerodrome:      ", AERODROME_ROUTER);
    console.log("═══════════════════════════════════════════");
    console.log("\nUpdate your .env file:");
    console.log(`  FLASH_LOAN_CONTRACT=${arbAddress}`);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });
