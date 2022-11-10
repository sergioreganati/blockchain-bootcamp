import {createSelector} from 'reselect';
import { get, groupBy, reject, maxBy, minBy } from 'lodash';
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
//let displayTokenPrice = ethers.utils.formatUnits(tokenPrice.toString(), 'ether')
    return ({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        tokenPrice: tokenPrice,
        displayTokenPrice: tokenPrice.toFixed(2),
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



//-----------------------PRICE CHART SELECTORS-----------------------
export const priceChartSelector = createSelector(
    filledOrders,
    tokens,
    (orders, tokens) => {
        //failsafe if there are no tokens loaded
        if(!tokens[0] || !tokens[1]) {return}
        //filter orders by selected tokens
        orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
        orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
        orders = orders.sort((a, b) => a.timeStamp - b.timeStamp)
        //decorate orders
        orders = orders.map((o) => decorateOrder(o, tokens))


        //last traded price
        let secondLastOrder, lastOrder
        [secondLastOrder, lastOrder] = orders.slice(-2) //get last two orders

        const lastPrice = get(lastOrder, 'tokenPrice', 0) 
        const secondLastPrice = get(secondLastOrder, 'tokenPrice', 0)
        
        
        orders = buildGraphData(orders)


        orders ={
            lastPrice: lastPrice,
            lastPriceChange: (lastPrice >= secondLastPrice ? 'up' : 'down'),
            series: [{
                data: orders
            }]
        }
        // console.log(orders)

        return orders

    } )

    const buildGraphData = (orders) => {
       

        // group orders by hour or day or...
        orders = groupBy(orders, (o) => moment.unix(o.timeStamp).startOf('hour').format())
        // create array of the keys that we defined above (hour, day, week, month, year)
        const hours = Object.keys(orders)
        //build data as required by APEX CHARTS candles
        const graphData = hours.map((hour) => {
            //fetch all orders for this hour
            const group = orders[hour]
            //calculate the open price, sort orders by timestamp so we can get the first order's price, see filters above
            const open = group[0].tokenPrice
            //calculate max and min with lodash tools
            const high = maxBy(group, 'tokenPrice').tokenPrice
            const low = minBy(group, 'tokenPrice').tokenPrice
            //calculate the close price, sort orders by timestamp so we can get the last order's price, see filters above
            const close = group[group.length - 1].tokenPrice
            return({
                x: new Date(hour),
                y:[open, high, low, close]

            })
        })
        return graphData

    }
    