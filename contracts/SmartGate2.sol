// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SmartGate2 {

    mapping(bytes16 => mapping(address => bool)) private database;
    address public owner;

    event AccessAttempt(bytes16 gateUUID, address carAddress, bool accessGranted, string content);

    constructor() {
        owner = msg.sender;
    }

    function grantAccess(bytes16 gateUUID, address carAddress) public {
        require(msg.sender == owner, "You aren't the owner");
        database[gateUUID][carAddress] = true;
    }

    function denyAccess(bytes16 gateUUID, address carAddress) public {
        require(msg.sender == owner, "You aren't the owner");
        database[gateUUID][carAddress] = false;
    }

    function requestAccess(bytes16 gateUUID, string calldata content) external{
        address carAddress = msg.sender;
        bool granted = database[gateUUID][carAddress];
        emit AccessAttempt(gateUUID, carAddress, granted, content);
    }

}
