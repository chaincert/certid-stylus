const hre = require("hardhat");

async function main() {
    const CONTRACT_ADDRESS = "0xB05dBBAe660C4F2ebD917638760e608b3c263CaA";
    const NEW_FEE = 0;

    const [deployer] = await hre.ethers.getSigners();
    console.log(`Updating fee using account: ${deployer.address}`);

    const CertIDManager = await hre.ethers.getContractAt("CertIDManager", CONTRACT_ADDRESS);

    console.log(`Setting registration fee to ${NEW_FEE}...`);
    const tx = await CertIDManager.setRegistrationFee(NEW_FEE);
    console.log(`Transaction hash: ${tx.hash}`);

    await tx.wait();
    console.log("✅ Registration fee updated successfully!");

    const currentFee = await CertIDManager.registrationFee();
    console.log(`Current On-chain Registration Fee: ${hre.ethers.formatEther(currentFee)} ETH`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
