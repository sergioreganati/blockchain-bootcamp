// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "hardhat/console.sol";
import "./Token.sol";

contract Exchange {

	address public feeAccount;
	uint256 public feePercent; 

	mapping(address => mapping(address => uint256)) public tokens;
	mapping(uint256 => _Order) public orders;
	mapping(uint256 => bool) public orderCancelled;
	mapping(uint256 => bool) public orderFilled;

	uint256 public ordersCount;

	event Deposit(
		address token, 
		address user, 
		uint256 amount,
		uint256 balance
	);
	event Withdraw(
		address token, 
		address user, 
		uint256 amount,
		uint256 balance
	);
	event Order (		
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timeStamp
	);

	event Cancel (		
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		uint256 timeStamp
	);

	event Trade (		
		uint256 id,
		address user,
		address tokenGet,
		uint256 amountGet,
		address tokenGive,
		uint256 amountGive,
		address creator,
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
function makeOrder(
address _tokenGet, 
uint256 _amountGet, 
address _tokenGive, 
uint256 _amountGive
) public {
	require(balanceOf(_tokenGive, msg.sender)>=_amountGive);
	ordersCount ++;
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
		block.timestamp)
		;
//Token give - token to be spent which token and how much
//Token get - token to be receive which token and how much
}

function cancelOrder(uint256 _id) public {
	//fetch the order _Order is the structure created, _order local var
	_Order storage _order = orders[_id];
	//cancel order
	orderCancelled[_id] = true;
	require(_order.id == _id);
	require(address(_order.user) == msg.sender);
	emit Cancel(
		_order.id, 
		msg.sender, 
		_order.tokenGet,
		_order.amountGet, 
		_order.tokenGive, 
		_order.amountGive, 
		block.timestamp);
	//update oders

}
function fillOrder(uint256 _id) public {
	//order must be valid
	//require(_id);
	require(_id > 0 && _id <= ordersCount);
	//order cant be filled
	require(!orderFilled[_id]);
	//order cant be cancelled
	require(!orderCancelled[_id]);
	
	_Order storage _order = orders[_id];
	_trade(
		_order.id,
		_order.user,
		_order.tokenGet,
		_order.amountGet,
		_order.tokenGive,
		_order.amountGive
	);
	orderFilled[_order.id] = true;


}

function _trade(
	uint256 _orderId,
	address _user,
	address _tokenGet,
	uint256 _amountGet,
	address _tokenGive,
	uint256 _amountGive
) internal {
	uint256 _feeAmount = (_amountGet*feePercent) / 100;

	tokens[_tokenGet][msg.sender] = 
		tokens[_tokenGet][msg.sender] - 
		(_amountGet + _feeAmount);
	tokens[_tokenGet][_user] = tokens[_tokenGet][_user] +_amountGet;
	
	tokens[_tokenGet][feeAccount] = tokens[_tokenGet][feeAccount] + _feeAmount;
	
	tokens[_tokenGive][_user] = 
		tokens[_tokenGive][_user] -
		_amountGive;

	tokens[_tokenGive][msg.sender] = tokens[_tokenGive][msg.sender] +_amountGive;
	emit Trade (		
		_orderId,
		msg.sender,
		_tokenGet,
		_amountGet,
		_tokenGive,
		_amountGive,
		_user,
		block.timestamp
	);



}
}
