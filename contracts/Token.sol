// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";


contract Token {
	string public name;
	string public symbol;
	//decimals - state
	uint256 public decimals = 18;
	//total supply - state
	uint256 public totalSupply;
	//track balances - state
	mapping(address => uint256) public balanceOf; //gets the keypar mapps the address to the balance

	//send tokens - 

	constructor(string memory _name, string memory _symbol, uint256 _totalsupply){
	name = _name;
	symbol = _symbol;
	totalSupply = _totalsupply * (10**decimals);
	//create the tokens with the ownership of the creator/sender of the token, writtes info on the blockchain
	balanceOf[msg.sender] = totalSupply; 
	}
}