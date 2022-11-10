import {createSelector} from 'reselect';
import { get, groupBy, reject } from 'lodash';
import { ethers } from 'ethers';
import moment from 'moment';

const GREEN = '#25CE8F'
const RED = '#F45353'

const tokens = state => get(state, 'tokens.contracts')

const allOrders = state => get(state, 'exchange.allOrders.data', []);
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
const filledOrders = state => get(state, 'exchange.filledOrders.data', []);


const openOrders = state => {
    const all = allOrders(state)
    const filled = filledOrders(state)
    const cancelled = cancelledOrders(state)
  
    const openOrders = reject(all, (order) => {
        const orderId = [order.id]
      const orderFilled = filled.find((o) => o.id.toString() === orderId.toString())
      const orderCancelled = cancelled.find((o) => o.id.toString() === orderId.toString())
      return(orderFilled || orderCancelled)
    })
  
    return openOrders
  
  }








//treat database
const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount
  
    // Note: DApp should be considered token0, mETH is considered token1
    // Example: Giving mETH in exchange for DApp
    if (order.tokenGive === tokens[1].address) {
      token0Amount = order.amountGive // The amount of DApp we are giving
      token1Amount = order.amountGet // The amount of mETH we want...
    } else {
      token0Amount = order.amountGet // The amount of DApp we want
      token1Amount = order.amountGive // The amount of mETH we are giving...
    }
const precision = 100000
let tokenPrice = (token1Amount / token0Amount)
tokenPrice = Math.round(tokenPrice * precision) / precision
    return ({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        tokenPrice: tokenPrice,
        formattedTimestamp: moment.unix(order.timeStamp).format('h:mm:ssa d MMM D'),
    })
}


export const orderBookSelector = createSelector(
    openOrders, 
    tokens, 
    (orders, tokens) => {
    if (!tokens[0] || !tokens[1]) {  return }
    //Filter orders by selected tokens
    orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
    orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
    //decorate orders add new valuer

    orders = decorateOrderBookOrders(orders, tokens)

    orders = groupBy(orders, 'orderType')

    //sort buy orders by price
    const buyOrders = get(orders, 'buy', [])
    orders = {
        ...orders,
        buyOrders: buyOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }
    const sellOrders = get(orders, 'sell', [])
    orders = {
        ...orders,
        sellOrders: sellOrders.sort((a, b) => b.tokenPrice - a.tokenPrice)
    }
    return orders
})


const decorateOrderBookOrders = (orders, tokens) => {
    return(
        orders.map((order) => {
        order = decorateOrder(order, tokens)
        order = decorateOrderBookOrder(order, tokens)
        return (order)
        
    })
    )
}


const decorateOrderBookOrder = (order, tokens) => {
    const orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'

    return ({
        ...order,
        orderType,
        orderTypeClass: orderType === 'buy' ? GREEN : RED,
        orderFillAction: orderType === 'buy' ? 'sell' : 'buy',
    })

}