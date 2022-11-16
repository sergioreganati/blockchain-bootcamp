import { ethers } from "ethers";
import TOKEN_ABI from '../abis/Token.json'
import EXCHANGE_ABI from '../abis/Exchange.json'

//load provider
export const loadProvider = async (dispatch) => {
   const connection = new ethers.providers.Web3Provider(window.ethereum)
   dispatch({ type: 'PROVIDER_LOADED', connection })
    return connection
}

//load network
export const loadNetwork = async (dispatch, provider) => {
   const { chainId } = await provider.getNetwork()
   dispatch({ type: 'NETWORK_LOADED', chainId })
    return chainId
}

//load account
export const loadAccount = async (provider, dispatch,) => {
    const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    const account = ethers.utils.getAddress(accounts[0])
    dispatch({ type: 'ACCOUNT_LOADED', account })
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatEther(balance)
    dispatch({ type: 'ETHER_BALANCE_LOADED', balance })
    return account
}

//load token
export const loadTokens = async (provider, addresses, dispatch) => {
    let tokens, symbol

    tokens= new ethers.Contract(addresses[0], TOKEN_ABI, provider)
    symbol = await tokens.symbol()
    dispatch({ type: 'TOKEN_1_LOADED', token: tokens, symbol })

    tokens = new ethers.Contract(addresses[1], TOKEN_ABI, provider)
    symbol = await tokens.symbol()   
    dispatch({ type: 'TOKEN_2_LOADED', token: tokens, symbol })

    return tokens
}

//load exchange
export const loadExchange = async (provider, address, dispatch) => {
    const exchange = new ethers.Contract(address, EXCHANGE_ABI, provider)
    dispatch({ type: 'EXCHANGE_LOADED', exchange })

    return exchange
}

//function that listen to events
export const subscribeToEvents = (exchange, dispatch) => {

    exchange.on('Deposit', (token, user, amount, balance, event) => {
        dispatch({ type: 'TRANSFER_SUCCESS', event })  
    })

    exchange.on('Withdraw', (token, user, amount, balance, event) => {
        dispatch({ type: 'TRANSFER_SUCCESS', event })  
    })

    exchange.on('Order', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        const order=event.args
        dispatch({ type: 'ORDER_SUCCESS', order, event })  
    })

    exchange.on('Cancel', (id, user, tokenGet, amountGet, tokenGive, amountGive, timestamp, event) => {
        const order=event.args
        dispatch({ type: 'CANCEL_SUCCESS', order, event })  
    })

    exchange.on('Trade', (id, user, tokenGet, amountGet, tokenGive, amountGive, creator, timestamp, event) => {
        const order=event.args
        dispatch({ type: 'ORDER_FILL_SUCCESS', order, event })  
    })
}

//load user balances and exchange balances
export const loadBalances = async (exchange, tokens, account, dispatch) => {

    let balance = ethers.utils.formatUnits(await tokens[0].balanceOf(account), 18)
    dispatch({ type: 'TOKEN_1_BALANCE_LOADED', balance })

    balance=ethers.utils.formatUnits(await exchange.balanceOf(tokens[0].address, account),18)
    dispatch({ type: 'EXCHANGE_TOKEN_1_BALANCE_LOADED', balance })

    balance = ethers.utils.formatUnits(await tokens[1].balanceOf(account), 18)
    dispatch({ type: 'TOKEN_2_BALANCE_LOADED', balance })

    balance=ethers.utils.formatUnits(await exchange.balanceOf(tokens[1].address, account),18)
    dispatch({ type: 'EXCHANGE_TOKEN_2_BALANCE_LOADED', balance })

}

//load all orders
export const loadAllOrders = async (provider, exchange, dispatch) => {
    const block = await provider.getBlockNumber()
    //cancelled orders
    const cancelStream = await exchange.queryFilter('Cancel', 0, block)
    const cancelledOrders = cancelStream.map((event) => event.args)
    dispatch({ type: 'CANCELLED_ORDERS_LOADED', cancelledOrders })

    //filled orders
    const fillStream = await exchange.queryFilter('Trade', 0, block)
    const filledOrders = fillStream.map((event) => event.args)
    dispatch({ type: 'FILLED_ORDERS_LOADED', filledOrders })

    //All orders
    const orderStream = await exchange.queryFilter('Order', 0, block)
    const allOrders = orderStream.map((event) => event.args)
    dispatch({ type: 'ALL_ORDERS_LOADED', allOrders })
}

//deposit & withdraws tokens
export const transferTokens = async (provider, exchange, transferType, token, amount, dispatch) => {
    let transaction

    dispatch({ type: 'TRANSFER_REQUEST'})

    try {
        const signer = await provider.getSigner()
        const amountToTransfer = ethers.utils.parseUnits(amount.toString(), 18)
        //approve exchange to transfer tokens
        if (transferType === 'Deposit') {
        transaction = await token.connect(signer).approve(exchange.address, amountToTransfer)
        await transaction.wait()
        transaction = await exchange.connect(signer).depositToken(token.address, amountToTransfer)
        await transaction.wait()
        } else {
        transaction = await exchange.connect(signer).withdrawToken(token.address, amountToTransfer)
        await transaction.wait()
        }

    } catch (error) {
        dispatch({ type: 'TRANSFER_FAIL', error })
        console.error(error)
    }
}

//orders

export const buyOrder = async (provider, exchange, token, order, dispatch) => {
    let transaction

    dispatch({ type: 'ORDER_REQUEST'})

    const tokenGet = token[0].address
    const tokenGive = token[1].address
    const amountGet = ethers.utils.parseUnits(order.amount.toString(), 18)
    const amountGive = ethers.utils.parseUnits((order.amount * (order.price)).toString(), 18)
    
    try {
        const signer = await provider.getSigner()
        transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
        await transaction.wait()

    } catch (error) {
        dispatch({ type: 'ORDER_FAIL', error })
        console.error(error)
    }
}

export const sellOrder = async (provider, exchange, token, order, dispatch) => {
    let transaction

    dispatch({ type: 'ORDER_REQUEST'})

    const tokenGet = token[1].address
    const tokenGive = token[0].address
    const amountGet = ethers.utils.parseUnits((order.amount * order.price).toString(), 18)
    const amountGive = ethers.utils.parseUnits(order.amount.toString(), 18)
    
    try {
        const signer = await provider.getSigner()
        transaction = await exchange.connect(signer).makeOrder(tokenGet, amountGet, tokenGive, amountGive)
        await transaction.wait()

    } catch (error) {
        dispatch({ type: 'ORDER_FAIL', error })
        console.error(error)
    }
    
}

export const cancelOrder = async (provider, exchange, order, dispatch) => {

    dispatch({ type: 'CANCEL_REQUEST'})

    try {
        const signer = await provider.getSigner()
        const transaction = await exchange.connect(signer).cancelOrder(order.id)
        await transaction.wait()

    }   catch (error) {
        dispatch({ type: 'CANCEL_FAIL'})
    }
}

export const fillOrder = async (provider, exchange, order, dispatch) => {
    
    dispatch({ type: 'ORDER_FILL_REQUEST'})

    try {
        const signer = await provider.getSigner()
        const transaction = await exchange.connect(signer).fillOrder(order.id)
        await transaction.wait()

    }   catch (error) {
        dispatch({ type: 'ORDER_FILL_FAIL'})
        
    }
}
