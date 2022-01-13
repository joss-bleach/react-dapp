//SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

// Declaring the smart contract
contract Token {
    // Giving the token a name (public viewable string)
    string public name = "Josscoin";
    // Giving the token a symbol (public viewable symbol)
    string public symbol = "BLO";
    // Declaring total supply of tokens
    uint public totalSupply = 1000000;
    // mapping the balances with key of address
    mapping(address => uint) balances;

    constructor() {
        // Set balance of deployer to the total supply of tokens
        balances[msg.sender] = totalSupply; 
    }

    // Function to transfer tokens (transferring to an amount of tokens)
    function transfer(address to, uint amount) external {
        // Check the balance of tokens the sender wants to transfer is less than the amount they hold
        require(balances[msg.sender] >= amount, "You don't hold enough tokens");
        // If they have enough tokens, take the amount sent and take it off their balance of tokens
        balances[msg.sender] -= amount;
        // Update the receivers balance to reflect the tokens they've received
        balances[to] += amount;
    }

    // Function to get balance of tokens
    function balanceOf(address account) external view returns (uint) {
        // Return the balance of the account
        return balances[account];
    }

}
