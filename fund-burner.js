const { ethers } = require('ethers');
require('dotenv').config();

async function fundBurner() {
    const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    const privateKey = process.env.PRIVATE_KEY;
    const wallet = new ethers.Wallet(privateKey, provider);

    const burnerAddress = process.argv[2] || process.env.BURNER_ADDRESS;
    const amount = ethers.parseEther('0.01'); // 0.01 ETH

    console.log(`Funding burner wallet ${burnerAddress} with ${ethers.formatEther(amount)} ETH`);
    console.log(`Sender balance: ${ethers.formatEther(await provider.getBalance(wallet.address))} ETH`);

    const tx = await wallet.sendTransaction({
        to: burnerAddress,
        value: amount
    });

    console.log('Tx sent!', tx.hash);
    const receipt = await tx.wait();
    console.log('Confirmed in block:', receipt.blockNumber);
    console.log(`Burner balance now: ${ethers.formatEther(await provider.getBalance(burnerAddress))} ETH`);
}

fundBurner().catch(console.error);
