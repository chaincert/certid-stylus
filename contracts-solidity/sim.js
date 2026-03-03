const { ethers } = require("ethers");
const CERTID_ABI = [
    {
        "type": "function",
        "name": "registerHardwareIdentity",
        "inputs": [
            { "name": "publicKey", "type": "bytes" }
        ],
        "outputs": [],
        "stateMutability": "payable"
    }
];
async function run() {
    const provider = new ethers.JsonRpcProvider("https://sepolia-rollup.arbitrum.io/rpc");
    const contractAddress = "0x67921Ae6eFA1c1Ca024725F425056FFaf7705c1E";
    const user = "0xc68a92163f496ADCc7A8502fB2fdc7341fFdF589";
    const pubKey = "0x13eb2998ff367ed274af56808d3ff7dd7cc16870f18a588550c1b687f9f72b823b8da102dcda361c5b94be7028e3042a45eb8584b3929ae3f8eeae499f566244";
    
    try {
        console.log("Estimating gas...");
        const gas = await provider.estimateGas({
            to: contractAddress,
            from: user,
            value: ethers.parseEther("0.0005"),
            data: new ethers.Interface(CERTID_ABI).encodeFunctionData("registerHardwareIdentity", [pubKey])
        });
        console.log("Gas needed:", gas.toString());
    } catch (e) {
        console.error("Error formatting:", e.info || e);
    }
}
run();
