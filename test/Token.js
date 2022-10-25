const { expect } = require('chai');
const { ethers } = require('hardhat');
//create function to read the total suypply including all the decimals ops
const tokens = (n) => {
	return ethers.utils.parseUnits(n.toString(), 'ether')
}

describe('Token', () => {
	let token
//making the token avaiable for the tests
	beforeEach(async () => {
	//fetch token from blockchain/ deploy
	const Token = await ethers.getContractFactory('Token')
	token = await Token.deploy('Sergio token', 'SSR', '1000000' )
	})

describe('Deployment',() => {

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

})
})

