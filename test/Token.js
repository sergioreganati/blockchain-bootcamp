const { expect } = require('chai');
const { ethers } = require('hardhat');
//create function to read the total suypply including all the decimals ops
const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => 
{
	let token,
		accounts,
		deployer,
		receiver
//making the token avaiable for the tests
	beforeEach(async () => {
	//fetch token from blockchain/ deploy
	const Token = await ethers.getContractFactory('Token')
	token = await Token.deploy('Sergio token', 'SSR', '1000000' )
	accounts = await ethers.getSigners()
	deployer = accounts[0]
	receiver = accounts[1]
	})

describe('Deployment',() => 
{
const name = 'Sergio token'
const symbol = 'SSR'
const decimals = '18'
const totalsupply = tokens(1000000)
it('has the correct name', async ()=> {expect(await token.name()).to.equal('Sergio token')
})
it('has the correct symbol', async ()=> {expect(await token.symbol()).to.equal(symbol)
})
it('has the correct decimals', async ()=> {expect(await token.decimals()).to.equal(decimals)
})
it('has the correct total supply', async ()=> {expect(await token.totalSupply()).to.equal(totalsupply)
})
console.log(totalsupply.toString())
it('assigns total supply to deployer', async ()=> {expect(await token.balanceOf(deployer.address)).to.equal(totalsupply)
})
})

describe('Sending tokens', () => {
	let amount, transaction, result

	describe('Sucess', () => {
		beforeEach(async () => {
		amount = tokens(100)
		transaction = await token.connect(deployer).transfer(receiver.address,amount)
		result = await transaction.wait() //waits for the transaction to be included in the block
	})

	it('transfer token balances', async () => { 

		//log balance before transaction
		//console.log('deployer balance before transaction', await token.balanceOf(deployer.address))
		//console.log('receiver balance before transaction', await token.balanceOf(receiver.address))

		//transfer tokens transaction must be signed so connect and ensure balance changes
		expect(await token.balanceOf(deployer.address)).to.equal(tokens(999900))
		expect (await token.balanceOf(receiver.address)).to.equal(amount)

		//log balance after transaction
		//console.log('deployer balance before transaction', await token.balanceOf(deployer.address))
		//console.log('receiver balance before transaction', await token.balanceOf(receiver.address))
	})

	it('emits a transfer event', async () => {
		const eventlog = result.events[0]
		//console.log(eventlog)
		expect(eventlog.event).to.equal('Transfer')
		const args = eventlog.args
		expect(args.from).to.equal(deployer.address) 
		//compares line 'from' in the eventlog to deployer address
		expect(args.to).to.equal(receiver.address)
		expect(args.value).to.equal(amount)
	})

	describe('Failure', () => {
		it('rejects insuficcient balances', async () => {
		//transfer more tokens the deployer has
		const invalidamount = tokens(10000000)	
		await expect(token.connect(deployer).transfer(receiver.address,invalidamount)).to.be.reverted
		})
		it('rejects invalid recipent', async () => {
        const amount = tokens(100)
        await expect(token.connect(deployer).transfer('0x0000000000000000000000000000000000000000', amount)).to.be.reverted
      	})

	})

})
	
	
})

})

