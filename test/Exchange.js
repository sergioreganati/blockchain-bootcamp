const { expect } = require('chai');
const { ethers } = require('hardhat');
//create function to read the total suypply including all the decimals ops

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
	let deployer,
		feeAccount,
		exchange,
		token1
		
	const feePercent = 10

	//making the token avaiable for the tests
	beforeEach(async () => {
		const Exchange = await ethers.getContractFactory('Exchange')
		const Token = await ethers.getContractFactory('Token')
		
		token1 = await Token.deploy('Sergio token', 'SSR', '1000000')
		token2 = await Token.deploy('Mock Dai', 'mDai', '1000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		feeAccount = accounts[1]
		user1 = accounts[2]
		user2 = accounts[3]

		let transaction = await token1.connect(deployer).transfer(user1.address, tokens(100))
		await transaction.wait()

		
		exchange = await Exchange.deploy(feeAccount.address, feePercent)
	})

	describe('Deployment',() => {

		it('Tracks the fee account', async ()=> {expect(await exchange.feeAccount()).to.equal(feeAccount.address)
		})
		it('Tracks the fee percentage', async ()=> {expect(await exchange.feePercent()).to.equal(feePercent)
		})

	})

	describe('Depositing tokens', () => {

		let transaction, result
		let amount = tokens(10)

		describe('Success', () => {

		beforeEach(async () => {
			//approve tokens
			transaction = await token1.connect(user1).approve(exchange.address, amount)
			result = await transaction.wait()
			//deposit tokens
			transaction = await exchange.connect(user1).depositToken(token1.address, amount)
			result = await transaction.wait()
		})

			it ('Tracks the token deposit', async () => {
				expect(await token1.balanceOf(exchange.address)).to.equal(amount)
				expect(await exchange.tokens(token1.address, user1.address)).to.equal(amount)
				expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(amount)		
			})
			it('emits a deposit event', async () => {
			const eventlog = result.events[1]
			//console.log(eventlog)
			expect(eventlog.event).to.equal('Deposit')
			const args = eventlog.args
			expect(args.token).to.equal(token1.address) 
			//compares line 'from' in the eventlog to deployer address
			expect(args.user).to.equal(user1.address)
			expect(args.amount).to.equal(amount)
			expect(args.balance).to.equal(amount)
	})



		})

		describe('Failure', () => {
			it('Fails when no tokens are approved', async () => {
				await expect(exchange.connect(user1).depositToken(token1.address, amount)).to.be.reverted

			})

		})

	})

	describe('Withdrawing tokens', () => {

		let transaction, result
		let amount = tokens(10)



		describe('Success', () => {

		beforeEach(async () => {
			//deposit tokens before withdrawing
			//approve tokens
			transaction = await token1.connect(user1).approve(exchange.address, amount)
			result = await transaction.wait()
			//deposit tokens
			transaction = await exchange.connect(user1).depositToken(token1.address, amount)
			result = await transaction.wait()
			//withdraw
			transaction = await exchange.connect(user1).withdrawToken(token1.address, amount)
			result = await transaction.wait()

		})
		
			it ('Withdraw token funds', async () => {
				//console.log(await exchange.tokens(token1.address, user1.address))
				expect(await exchange.tokens(token1.address, user1.address)).to.equal(0)
				expect(await token1.balanceOf(exchange.address)).to.equal(0)
				expect(await exchange.balanceOf(token1.address, user1.address)).to.equal(0)		
			})
			it('emits a Withdraw event', async () => {
			const eventlog = result.events[1]
			//console.log(result)
			expect(eventlog.event).to.equal('Withdraw')
			const args = eventlog.args
			expect(args.token).to.equal(token1.address) 
			//compares line 'from' in the eventlog to deployer address
			expect(args.user).to.equal(user1.address)
			expect(args.amount).to.equal(amount)
			expect(args.balance).to.equal(0)
			})


		})

		describe('Failure', () => {
			it('Fails for insufficient balance', async () => {
			
				await expect(exchange.connect(user1).withdrawToken(token1.address, amount)).to.be.reverted
				
			})

		})
		
	})

	describe('Checking Balances', () => {

		let transaction, result
		let amount = tokens(1)
		
		beforeEach(async () => {
			//approve tokens
			transaction = await token1.connect(user1).approve(exchange.address, amount)
			result = await transaction.wait()
			//deposit tokens
			transaction = await exchange.connect(user1).depositToken(token1.address, amount)
			result = await transaction.wait()
		})
		
		it ('returns the user balance', async () => {
			expect(await token1.balanceOf(exchange.address)).to.equal(amount)
			
		})
		
		
	})
	
	describe('Making orders', () => {

		let transaction, result
		let amount = tokens(1)
		
		describe('Success', async () => {
			beforeEach(async () => {
			//approve tokens
			transaction = await token1.connect(user1).approve(exchange.address, amount)
			result = await transaction.wait()
			//deposit tokens
			transaction = await exchange.connect(user1).depositToken(token1.address, amount)
			result = await transaction.wait()
			//make order
			transaction = await exchange.connect(user1).makeOrder(token2.address, tokens(1), token1.address, tokens(1))
			result = await transaction.wait()
			
			})
			it('tracks the newly created order', async () => {
				expect(await exchange.ordersCount()).to.equal(1)
			})
			it('emits an order event', async () => {
				const eventlog = result.events[0]
				//console.log(eventlog.args)
				expect(eventlog.event).to.equal('Order')
				const args = eventlog.args
				expect(args.id).to.equal(1) 
				//compares line 'from' in the eventlog to deployer address
				expect(args.user).to.equal(user1.address)
				expect(args.tokenGet).to.equal(token2.address)
				expect(args.amountGet).to.equal(tokens(1))
				expect(args.tokenGive).to.equal(token1.address)
				expect(args.amountGive).to.equal(tokens(1))
				expect(args.timeStamp).to.at.least(1)


			})

		})

		describe('Failure', async () => {
			beforeEach(async () => {
				
			})
			it('rejects create order with insufficient balance', async () => {
				await expect(exchange.connect(user1).makeOrder(token2.address, tokens(1), token1.address, tokens(1))).to.be.reverted
			})

		})		
		
	})
	
	describe('Order actions', async () => {
		let transaction, result
		let amount = tokens(1)

		beforeEach(async () => {
			//approve tokens
			transaction = await token1.connect(user1).approve(exchange.address, amount)
			result = await transaction.wait()
			//deposit tokens
			transaction = await exchange.connect(user1).depositToken(token1.address, amount)
			result = await transaction.wait()
			//make order
			transaction = await exchange.connect(user1).makeOrder(token2.address, tokens(1), token1.address, tokens(1))
			result = await transaction.wait()

		})
		describe('Cancelling orders', async () => {
			describe('Success', async () => {
				beforeEach(async () => {
					transaction = await exchange.connect(user1).cancelOrder(1)
					result = await transaction.wait()
				})
				it('updates cancelled order', async () => {
					expect(await exchange.orderCancelled(1)).to.equal(true)
				})
				it('emits a cancell event', async () => {
					const eventlog = result.events[0]
					//console.log(eventlog.args)
					expect(eventlog.event).to.equal('Cancel')
					const args = eventlog.args
					expect(args.id).to.equal(1) 
					//compares line 'from' in the eventlog to deployer address
					expect(args.user).to.equal(user1.address)
					expect(args.tokenGet).to.equal(token2.address)
					expect(args.amountGet).to.equal(tokens(1))
					expect(args.tokenGive).to.equal(token1.address)
					expect(args.amountGive).to.equal(tokens(1))
					expect(args.timeStamp).to.at.least(1)
				})

			})
			describe('Failure', async () => {
				beforeEach(async () => {
					//approve tokens
					transaction = await token1.connect(user1).approve(exchange.address, amount)
					result = await transaction.wait()
					//deposit tokens
					transaction = await exchange.connect(user1).depositToken(token1.address, amount)
					result = await transaction.wait()
					//make order
					transaction = await exchange.connect(user1).makeOrder(token2.address, tokens(1), token1.address, tokens(1))
					result = await transaction.wait()
					
				})
				it('Rejects invalid order ids', async () => {
					
					const invalidOrderId = 99999
					await expect(exchange.connect(user1).cancelOrder(invalidOrderId)).to.be.reverted
				})
				it('Rejects unauthorized cancellations', async () => {
					
					await expect(exchange.connect(user2).cancelOrder(1)).to.be.reverted
				})
			})
		})

	})
})
	