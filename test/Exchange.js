const { expect } = require('chai');
const { ethers } = require('hardhat');
//create function to read the total suypply including all the decimals ops
const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Exchange', () => {
	let accounts,
		deployer,
		feeAccount,
		exchange
	const feePercent = 10
//making the token avaiable for the tests
	beforeEach(async () => {
		accounts = await ethers.getSigners()
		deployer = accounts[0]
		feeAccount = accounts[1]
		const Exchange = await ethers.getContractFactory('Exchange')
		exchange = await Exchange.deploy(feeAccount.address, feePercent)
	})

	describe('Deployment',() => {

		it('Tracks the fee account', async ()=> {expect(await exchange.feeAccount()).to.equal(feeAccount.address)
		})
		it('Tracks the fee percentage', async ()=> {expect(await exchange.feePercent()).to.equal(feePercent)
		})

	})



})

