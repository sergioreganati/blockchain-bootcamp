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
	balanceOf[msg.sender] = totalSupply; 
	}

	function transfer(address _to, uint256 _value)
	public 
	returns (bool success)
	{
		require(balanceOf[msg.sender] >= _value);
		
		_transfer(msg.sender, _to, _value);
		return true;
	}

	//create function for transfer and trasnferfrom
	function _transfer (address _from, 
		address _to, 
		uint256 _value
		) internal {
		require(_to != address(0));
		balanceOf[_from] = balanceOf[_from] - _value;
		balanceOf[_to] = balanceOf[_to] + _value;
		emit Transfer(_from, _to, _value);

	}
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

function transferfrom( address _from, address _to, uint256 _value)
	public 
	returns (bool success)
{
	require	(_from != address(0));
	require	(_to != address(0));
	require	(_value > 0);
	require (_value <= allowance[_from][msg.sender], 'Insufficient allowance');
	require (_value <= balanceOf[_from], 'Insufficient balance');
	
	allowance[_from][msg.sender] = allowance[_from][msg.sender] - _value;

	_transfer(_from, _to, _value);

	return true;
	


		






}


}
