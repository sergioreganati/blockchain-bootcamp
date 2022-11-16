const { ethers } = require('hardhat')
const config = require('../src/config.json')

const tokens = (n) => {
    return ethers.utils.parseUnits(n.toString(), 'ether')
}

const wait = (seconds) => {
    const milliseconds = seconds * 1000
    return new Promise(resolve => setTimeout(resolve, milliseconds))
}







async function main() {
    

    

    //fetch accounts from unlocked wallet
    const accounts = await ethers.getSigners()
    const { chainId } = await ethers.provider.getNetwork()
    console.log("Using chainId", chainId)

    const Sdex = await ethers.getContractAt('Token', config[chainId].sDEX.address)
    console.log(`Sdex token fetched: ${Sdex.address}\n`)

    const mETH = await ethers.getContractAt('Token', config[chainId].mETH.address)   
    console.log(`mETH token fetched: ${mETH.address}\n`) 
    
    const mDAI = await ethers.getContractAt('Token', config[chainId].mDAI.address)   
    console.log(`mDAI token fetched: ${mDAI.address}\n`) 

    const exchange = await ethers.getContractAt('Exchange', config[chainId].exchange.address)   
    console.log(`Exchange fetched: ${exchange.address}\n`) 

    
    //distribute tokens
    const sender = accounts[0]
    const receiver = accounts[1]
    let amount = tokens(10000)
    let transaction, result

    transaction = await mETH.connect(sender).transfer(receiver.address, amount)
    await transaction.wait()
    console.log(`Transfered ${amount} tokens from ${sender.address} to ${receiver.address}\n`)

    //deposit tokens   
    const user1 = accounts[0]
    const user2 = accounts[1]
    amount = tokens(10000)
        //user1 approves 10k Dapp on exchange
        transaction = await Sdex.connect(user1).approve(exchange.address, amount)
        await transaction.wait()
        console.log(`Approved ${amount} tokens from ${user1.address}`)
        //user1 deposits amount
        transaction = await exchange.connect(user1).depositToken(Sdex.address, amount)
        await transaction.wait()
        console.log(`Deposited ${amount} tokens from ${user1.address}\n`)
        //user2 approves 10k mETH
        transaction = await mETH.connect(user2).approve(exchange.address, amount)
        await transaction.wait()
        console.log(`Approved ${amount} tokens from ${user2.address}`)
        //user2 deposits amount
        transaction = await exchange.connect(user2).depositToken(mETH.address, amount)
        await transaction.wait()
        console.log(`Deposited ${amount} tokens from ${user2.address}\n`)

    //make & cancells orders   
    let orderId
        //user1 makes order
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Sdex.address, tokens(5))
        result = await transaction.wait()
        console.log(`Make order from ${user1.address}\n`)
        //user1 cancells order
        orderId = result.events[0].args.id
        transaction = await exchange.connect(user1).cancelOrder(orderId)
        result = await transaction.wait()
        console.log(`Cancelled order from ${user1.address}\n`)
        await wait(1)

    //make & fill orders   

        //user1 makes order #1 
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(100), Sdex.address, tokens(10))
        result = await transaction.wait()
        console.log(`Make order from ${user1.address}`)
        //user2 fills order #1
        orderId = result.events[0].args.id
        transaction = await exchange.connect(user2).fillOrder(orderId)
        result = await transaction.wait()
        console.log(`User ${user2.address} Filled order from ${user1.address}\n`)
        await wait(1)

        //user1 makes order #2 
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(50), Sdex.address, tokens(15))
        result = await transaction.wait()
        console.log(`Make order from ${user1.address}`)
        //user2 fills order #2
        orderId = result.events[0].args.id
        transaction = await exchange.connect(user2).fillOrder(orderId)
        result = await transaction.wait()
        console.log(`User ${user2.address} Filled order from ${user1.address}\n`)
        await wait(1)

        //user1 makes order #3 
        transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(200), Sdex.address, tokens(20))
        result = await transaction.wait()
        console.log(`Make order from ${user1.address}`)
        //user2 fills order #3
        orderId = result.events[0].args.id
        transaction = await exchange.connect(user2).fillOrder(orderId)
        result = await transaction.wait()
        console.log(`User ${user2.address} Filled order from ${user1.address}\n`)
        await wait(1)


    //Make open orders

        //user1
        for (let i = 1; i<= 10; i++){
            transaction = await exchange.connect(user1).makeOrder(mETH.address, tokens(10 * i), Sdex.address, tokens(10))
            result = await transaction.wait()
            console.log(`Make order from ${user1.address}`)
            await wait(1)
        }
        //user2

        for (let i = 1; i<= 10; i++){
            transaction = await exchange.connect(user2).makeOrder(Sdex.address, tokens(10), mETH.address, tokens(10 * i))
            result = await transaction.wait()
            console.log(`Make order from ${user2.address}`)
            await wait(1)
        }











  
  }
  
  // We recommend this pattern to be able to use async/await everywhere
  // and properly handle errors.
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
  