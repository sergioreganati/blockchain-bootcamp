// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {

	address public feeAccount;
	uint256 public feePercent; 

	mapping(address => mapping(address => uint256)) public tokens;
	mapping(uint256 => _Order) public orders;

	uint256 public ordersCount;

	event Deposit(address token, address user, uint256 amount,uint256 balance);
	event Withdraw(address token, address user, uint256 amount,uint256 balance);
	event Order (		
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timeStamp
);
	struct _Order {
		uint256 id;
		address user;
		address tokenGet;
		uint256 amountGet;
		address tokenGive;
		uint256 amountGive;
		uint256 timeStamp;
	}

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

function withdrawToken(address _token, uint256 _amount) public {
	//ensure user has enough tokesn
	require (tokens[_token][msg.sender] >= _amount);
	//transfer toke to user
	Token(_token).transfer(msg.sender, _amount);
	//update balances
	//console.log(tokens[_token][msg.sender]);
	tokens[_token][msg.sender] = tokens[_token][msg.sender] - _amount;

	//emit event
	emit Withdraw(_token, msg.sender, _amount, tokens[_token][msg.sender]);
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
function makeOrder(address _tokenGet, 
uint256 _amountGet, 
address _tokenGive, 
uint256 _amountGive) public {
	require(balanceOf(_tokenGive, msg.sender)>=_amountGive);
	ordersCount = ordersCount + 1;
	orders[ordersCount] = _Order(
		ordersCount, 
		msg.sender, 
		_tokenGet,
		_amountGet, 
		_tokenGive, 
		_amountGive, 
		block.timestamp
	);
	emit Order(
		ordersCount, 
		msg.sender, 
		_tokenGet,
		_amountGet, 
		_tokenGive, 
		_amountGive, 
		block.timestamp);


//Token give - token to be spent which token and how much

//Token get - token to be receive which token and how much

}




//cancel orders
//fill orders
//charge fees
//track fee account

}
