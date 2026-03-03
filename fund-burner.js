const { ethers } = require('ethers');

async function fundBurner() {
    const provider = new ethers.JsonRpcProvider('https://sepolia-rollup.arbitrum.io/rpc');
    const privateKey = '[REDACTED_PRIVATE_KEY]'; // from contracts-solidity/.env
    const wallet = new ethers.Wallet(privateKey, provider);

    const burnerAddress = process.argv[2] || '0x58aF5798150D7a5752ff411Fd7D5290b693CAF7C';
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
