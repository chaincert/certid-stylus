const hre = require("hardhat");

async function main() {
    console.log("Preparing deployment of the Monetized CertID Manager Contract...");

    // Get the deployer's wallet (This pays the gas for the deployment)
    const [deployer] = await hre.ethers.getSigners();
    console.log(`Deploying contracts with the account: ${deployer.address}`);

    // 1. Constructor Arguments
    const STYLUS_ENGINE_ADDRESS = "0xea3b41aff7fdfb6b2c967b0aac4f639696bcb540"; // The Rust WASM Engine
    const TREASURY_ADDRESS = "0xc68a92163f496ADCc7A8502fB2fdc7341fFdF589"; // Your Specified Treasury Wallet
    const INITIAL_FEE = 0; // Registration Fee (Set to 0 as requested)

    // 2. Grab the Contract Factory
    // Note: The secure contract remains named "CertIDManager" in CertID_Secure.sol
    const CertIDManager = await hre.ethers.getContractFactory("CertIDManager");

    // 3. Deploy the contract, passing the three arguments into the constructor
    console.log(`\nDeploying CertIDManager...`);
    console.log(` - Linking to Stylus Engine: ${STYLUS_ENGINE_ADDRESS}`);
    console.log(` - Routing fees to Treasury: ${TREASURY_ADDRESS}`);
    console.log(` - Initial Registration Fee: 0 ETH`);

    const certIdContract = await CertIDManager.deploy(
        STYLUS_ENGINE_ADDRESS,
        TREASURY_ADDRESS,
        INITIAL_FEE
    );

    // 4. Wait for the transaction to be mined
    await certIdContract.waitForDeployment();

    const deployedAddress = await certIdContract.getAddress();

    console.log("\n=================================================");
    console.log("✅ CertID Solidity Manager Deployed!");
    console.log("🔗 Contract Address:", deployedAddress);
    console.log("🛠️  Network: Arbitrum Sepolia");
    console.log("=================================================");

    // Quick verification command for Arbiscan
    console.log(`\nTo verify the contract source code on Arbiscan, run:`);
    console.log(`npx hardhat verify --network arbitrumSepolia ${deployedAddress} "${STYLUS_ENGINE_ADDRESS}" "${TREASURY_ADDRESS}" "${INITIAL_FEE}"`);
}

// Execute the deployment
main().catch((error) => {
    console.error("Deployment Failed:", error);
    process.exitCode = 1;
});
