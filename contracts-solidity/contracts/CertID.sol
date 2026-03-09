// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

// 1. The Interface for your Rust WASM Engine
interface ICertIDStylusEngine {
    function verifyDeviceAttestation(
        bytes calldata publicKey, 
        bytes32 msgHash, 
        bytes calldata signature
    ) external view returns (bool);
}

contract CertIDManager is Ownable {
    // --- State Variables ---
    ICertIDStylusEngine public stylusEngine;
    
    address public treasury;
    uint256 public registrationFee;

    // Maps an Ethereum address to its hardware's public key
    mapping(address => bytes) public userPublicKeys;

    // --- Events ---
    event HardwareRegistered(address indexed user, bytes publicKey);
    event BiometricLoginVerified(address indexed user);
    event FeeUpdated(uint256 newFee);
    event FundsWithdrawn(uint256 amount, address to);

    // --- Constructor ---
    constructor(
        address _stylusEngineAddress, 
        address _treasuryAddress, 
        uint256 _initialFee
    ) Ownable(msg.sender) {
        stylusEngine = ICertIDStylusEngine(_stylusEngineAddress);
        treasury = _treasuryAddress;
        registrationFee = _initialFee;
    }

    // ==========================================
    // Core Business Logic
    // ==========================================

    function registerHardwareIdentity(bytes calldata publicKey) external payable {
        require(msg.value >= registrationFee, "CertID: Insufficient registration fee");
        require(userPublicKeys[msg.sender].length == 0, "CertID: User already registered");
        require(publicKey.length == 64, "CertID: Invalid public key length");

        userPublicKeys[msg.sender] = publicKey;

        if (msg.value > 0) {
            payable(treasury).transfer(msg.value);
        }

        emit HardwareRegistered(msg.sender, publicKey);
    }

    function verifyBiometricLogin(bytes32 msgHash, bytes calldata signature) external returns (bool) {
        bytes memory registeredKey = userPublicKeys[msg.sender];
        require(registeredKey.length == 64, "CertID: No hardware key registered");

        bool isValid = stylusEngine.verifyDeviceAttestation(registeredKey, msgHash, signature);
        require(isValid, "CertID: Hardware Signature Invalid");

        emit BiometricLoginVerified(msg.sender);
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

    function withdrawTreasury() external onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "CertID: No funds to withdraw");
        
        payable(treasury).transfer(balance);
        emit FundsWithdrawn(balance, treasury);
    }
}
