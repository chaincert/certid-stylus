// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// 1. The Interface for your Rust WASM Engine
interface ICertIDStylusEngine {
    function verifyDeviceAttestation(
        bytes calldata publicKey, 
        bytes32 msgHash, 
        bytes calldata signature
    ) external view returns (bool);
}

contract CertIDManager {
    // --- State Variables ---
    ICertIDStylusEngine public stylusEngine;
    
    address public owner;
    address public treasury;
    uint256 public registrationFee;

    // Maps an Ethereum address to its hardware's public key (the 64-byte uncompressed X/Y coordinates)
    mapping(address => bytes) public userPublicKeys;

    // --- Events ---
    event HardwareRegistered(address indexed user, bytes publicKey);
    event BiometricLoginVerified(address indexed user);
    event FeeUpdated(uint256 newFee);
    event FundsWithdrawn(uint256 amount, address to);

    // --- Modifiers ---
    modifier onlyOwner() {
        require(msg.sender == owner, "CertID: Caller is not the owner");
        _;
    }

    // --- Constructor ---
    constructor(
        address _stylusEngineAddress, 
        address _treasuryAddress, 
        uint256 _initialFee
    ) {
        owner = msg.sender;
        stylusEngine = ICertIDStylusEngine(_stylusEngineAddress);
        treasury = _treasuryAddress;
        registrationFee = _initialFee;
    }

    // ==========================================
    // Core Business Logic (The Toll Road)
    // ==========================================

    /**
     * @dev Registers a new user's hardware public key. Requires the registration fee.
     * @param publicKey The 64-byte public key extracted from the device's Secure Enclave.
     */
    function registerHardwareIdentity(bytes calldata publicKey) external payable {
        // 1. Enforce the business model
        require(msg.value >= registrationFee, "CertID: Insufficient registration fee");
        require(userPublicKeys[msg.sender].length == 0, "CertID: User already registered");
        require(publicKey.length == 64, "CertID: Invalid public key length");

        // 2. Store the identity
        userPublicKeys[msg.sender] = publicKey;

        // 3. Route revenue to the startup treasury immediately
        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }

        emit HardwareRegistered(msg.sender, publicKey);
    }

    /**
     * @dev Verifies a WebAuthn signature against the user's previously registered public key.
     * @param msgHash The sha256(authData || sha256(clientDataJSON))
     * @param signature The raw r||s signature from the device
     */
    function verifyBiometricLogin(bytes32 msgHash, bytes calldata signature) external returns (bool) {
        // 1. Fetch the user's registered hardware key
        bytes memory registeredKey = userPublicKeys[msg.sender];
        require(registeredKey.length == 64, "CertID: No hardware key registered for this address");

        // 2. Call the highly-optimized Arbitrum Stylus Rust engine to do the math
        bool isValid = stylusEngine.verifyDeviceAttestation(registeredKey, msgHash, signature);
        require(isValid, "CertID: Hardware Signature Invalid");

        // Emit the event so the desktop (or external services) know the login was successful and verified on-chain
        emit BiometricLoginVerified(msg.sender);

        // If it didn't revert, the signature is flawless.
        return true;
    }

    // ==========================================
    // Admin & Treasury Functions
    // ==========================================

    function setRegistrationFee(uint256 _newFee) external onlyOwner {
        registrationFee = _newFee;
        emit FeeUpdated(_newFee);
    }

    function setTreasury(address _newTreasury) external onlyOwner {
        require(_newTreasury != address(0), "CertID: Invalid treasury address");
        treasury = _newTreasury;
    }

    function setStylusEngine(address _newEngineAddress) external onlyOwner {
        stylusEngine = ICertIDStylusEngine(_newEngineAddress);
    }

    // Fallback withdrawal just in case native tokens are sent directly to the contract
    function withdrawTreasury() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "CertID: No funds to withdraw");
        
        payable(treasury).transfer(balance);
        emit FundsWithdrawn(balance, treasury);
    }
}
