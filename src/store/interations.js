import { ethers, providers } from "ethers";
import TOKEN_ABI from '../abis/Token.json'
import EXCHANGE_ABI from '../abis/Exchange.json'
import { provider } from "./reducer";
import { Provider } from "react-redux";


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
    //load account balance
    let balance = await provider.getBalance(account)
    balance = ethers.utils.formatEther(balance)
    dispatch({ type: 'ETHER_BALANCE_LOADED', balance })

    return account
}

//load token
export const loadTokens = async (provider, addresses, dispatch) => {
   let tokens, symbol
   
   
    tokens = new ethers.Contract(addresses[0], TOKEN_ABI, provider)
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
