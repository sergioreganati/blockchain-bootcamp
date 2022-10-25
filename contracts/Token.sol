// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";


contract Token {
	string public name;
	string public symbol;
	//decimals
	uint256 public decimals = 18;
	//total supply
	uint256 public totalSupply;

constructor(string memory _name, string memory _symbol, uint256 _totalsupply){
	name = _name;
	symbol = _symbol;
	totalSupply = _totalsupply * (10**decimals);
}
}
