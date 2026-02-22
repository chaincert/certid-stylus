const hre = require("hardhat");

async function main() {
    console.log("Preparing deployment of CertID Manager Contract...");

    // 1. The address of your perfectly functioning Rust Stylus Engine
    const STYLUS_ENGINE_ADDRESS = "0xea3b41aff7fdfb6b2c967b0aac4f639696bcb540";
    const TREASURY_ADDRESS = "0xc68a92163f496ADCc7A8502fB2fdc7341fFdF589";
    const INITIAL_FEE = hre.ethers.parseEther("0.0005");

    // 2. Grab the Contract Factory - the contract is CertIDManager in CertID.sol
    const CertIDManager = await hre.ethers.getContractFactory("CertIDManager");

    // 3. Deploy the contract, passing the Stylus address into the constructor
    console.log(`Deploying CertIDManager and linking to Stylus Engine at: ${STYLUS_ENGINE_ADDRESS}`);
    const certIdContract = await CertIDManager.deploy(STYLUS_ENGINE_ADDRESS, TREASURY_ADDRESS, INITIAL_FEE);

    // Wait for the transaction to be mined
    await certIdContract.waitForDeployment();

    const deployedAddress = await certIdContract.getAddress();

    console.log("=================================================");
    console.log("✅ CertID Solidity Contract Deployed!");
    console.log("🔗 Contract Address:", deployedAddress);
    console.log("🛠️  Network: Arbitrum Sepolia");
    console.log("=================================================");

    // Quick verification command for Arbiscan
    console.log(`\nTo verify on Arbiscan, run:`);
    console.log(`npx hardhat verify --network arbitrumSepolia ${deployedAddress} "${STYLUS_ENGINE_ADDRESS}" "${TREASURY_ADDRESS}" "${INITIAL_FEE}"`);
}

// Execute the deployment
main().catch((error) => {
    console.error("Deployment Failed:", error);
    process.exitCode = 1;
});
