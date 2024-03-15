// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "hardhat/console.sol";

contract SmartGate {

    mapping(bytes16 => address[]) private database;
    address public owner;

    event AccessAttempt(bytes16 gateUUID, address carAddress, bool accessGranted, string content);

    constructor() {
        owner = msg.sender;
    }

    function grantAccess(bytes16 gateUUID, address carAddress) public {
        require(msg.sender == owner, "You aren't the owner");
        database[gateUUID].push(carAddress);
    }

    function denyAccess(bytes16 gateUUID, address carAddress) public {
        require(msg.sender == owner, "You aren't the owner");
        address[] storage carAddresses = database[gateUUID];
        bool found = false;
        uint foundIndex;
        for (uint i = 0; i < carAddresses.length; i++) {
            if (carAddresses[i] == carAddress) {
                foundIndex = i;
                found = true;
            }
        }
        if (found) {
            delete carAddresses[foundIndex];
        }
    }

    function requestAccess(bytes16 gateUUID, string calldata content) external {
        address carAddress = msg.sender;
        address[] storage carAddresses = database[gateUUID];
        for (uint i = 0; i < carAddresses.length; i++) {
            if (carAddresses[i] == carAddress) {
                emit AccessAttempt(gateUUID, carAddress, true, content);
                return;
            }
        }
        emit AccessAttempt(gateUUID, carAddress, false, content);
    }

}
