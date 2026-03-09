const { ethers } = require("ethers");

async function testManager() {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    const managerAddress = "0xB05dBBAe660C4F2ebD917638760e608b3c263CaA";

    const abi = [
        "function verifyBiometricLogin(bytes32 msgHash, bytes signature) external returns (bool)",
        "function userPublicKeys(address) view returns (bytes)"
    ];

    const contract = new ethers.Contract(managerAddress, abi, provider);

    const fromAddress = "0x58aF5798150D7a5752ff411Fd7D5290b693CAF7C";
    const msgHash = "0xa8be78f19301b2cb388443f1df265bea9d0505e2d1d7512b4c46eb64a304092c";
    const signature = "0xc4ceb14753ed1668839d7dc1f3573f0cfec3f116d5e637e89f8b08238ce0b64400d5a7968471151815320527e5d3bf379443f9b76173d5b4ad690c381bfca6ac";

    console.log("Checking stored public key for", fromAddress);
    try {
        const storedKey = await contract.userPublicKeys(fromAddress);
        console.log("Stored Key:", storedKey);
    } catch (e) {
        console.error("Lookup failed:", e.message);
    }

    console.log("\nCalling estimateGas for verifyBiometricLogin on Manager...");
    try {
        const estimatedGas = await contract.verifyBiometricLogin.estimateGas(msgHash, signature, {
            from: fromAddress
        });
        console.log("Estimated Gas:", estimatedGas.toString());
    } catch (e) {
        console.error("Reverted:", e.message);
        if (e.data) console.error("Revert data:", e.data);
    }
}

testManager().catch(console.error);
