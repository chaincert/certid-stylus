const hre = require("hardhat");

async function main() {
    const stylusEngineAddress = "0xea3b41aff7fdfb6b2c967b0aac4f639696bcb540";
    console.log("Deploying CertID with Stylus Engine at:", stylusEngineAddress);

    const CertID = await hre.ethers.getContractFactory("CertID");
    const certID = await CertID.deploy(stylusEngineAddress);

    await certID.waitForDeployment();

    console.log("CertID deployed to:", await certID.getAddress());
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
