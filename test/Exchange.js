const { expect } = require('chai');
const { ethers } = require('hardhat');
//create function to read the total suypply including all the decimals ops

const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
	let deployer,
		feeAccount,
		exchange
		
	const feePercent = 10

//making the token avaiable for the tests
	beforeEach(async () => {
		const Exchange = await ethers.getContractFactory('Exchange')
		const Token = await ethers.getContractFactory('Token')
		token1 = await Token.deploy('Sergio token', 'SSR', '1000000')

		accounts = await ethers.getSigners()
		deployer = accounts[0]
		feeAccount = accounts[1]
		user1 = accounts[2]
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



})

