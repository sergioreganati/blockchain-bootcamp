
// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {

	address public feeAccount;
	uint256 public feePercent; 
	mapping(address => mapping(address => uint256)) public tokens;
	event Deposit(address token, address user, uint256 amount,uint256 balance);

	constructor(address _feeAccount, uint256 _feePercent){
		feeAccount = _feeAccount;
		feePercent = _feePercent;
	}
//deposit tokens & withdraw token
function depositToken(address _token, uint256 _amount) public {
	//transfer token to exchange
	require(Token(_token).transferfrom(msg.sender, address(this), _amount));
	//update balance
	tokens[_token][msg.sender] = tokens[_token][msg.sender] + _amount;
	//Emit event
	emit Deposit(_token, msg.sender, _amount, tokens[_token][msg.sender]);

}
//withdraw tokens
//check balances
function balanceOf(address _token, address _user)
public
view
returns (uint256)
{
	return tokens[_token][_user];
}


//make orders
//cancel orders
//fill orders
//charge fees
//track fee account

}