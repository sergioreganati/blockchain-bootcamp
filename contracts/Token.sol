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
	//owner address, approval addresses
	mapping(address => mapping(address => uint256)) public allowance;

	event Transfer(
		address indexed from, 
		address indexed to, 
		uint256 value
	);
	event Approval(
		address indexed owner,
		address indexed to,
		uint256	value
	);

	//send tokens - 

	constructor(
		string memory _name, 
		string memory _symbol, 
		uint256 _totalsupply)
	{
	name = _name;
	symbol = _symbol;
	totalSupply = _totalsupply * (10**decimals);
	//create the tokens with the ownership of the creator/sender of the token, writtes info on the blockchain
	balanceOf[msg.sender] = totalSupply; 
	}

	function transfer(address _to, uint256 _value)
	public 
	returns (bool success)
	{
		//require that senders token has enough tokens to spend
		require(balanceOf[msg.sender] >= _value);
		require(_to != address(0));
		//deduct tokens from spender
		balanceOf[msg.sender] = balanceOf[msg.sender] - _value;
		//credit tokens to receiver
		balanceOf[_to] = balanceOf[_to] + _value;
		//emitt event
		emit Transfer(msg.sender, _to, _value);
		return true;
	}

	//create function for users to excange tokens


	//allow spender/dex



function approve(address _spender, uint256 _value) 
	public
	returns(bool success)
{
	require(_spender != address(0));
	allowance[msg.sender][_spender] = _value;

	emit Approval(msg.sender, _spender, _value);
	return true;

}
}
