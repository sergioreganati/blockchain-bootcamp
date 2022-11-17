import {createSelector} from 'reselect';
import { get, groupBy, reject, maxBy, minBy } from 'lodash';
import { ethers } from 'ethers';
import moment from 'moment';

const GREEN = '#25CE8F'
const RED = '#F45353'
const YELLOW = '#EADDCA'

const account = state => get(state, 'provider.account')
const tokens = state => get(state, 'tokens.contracts')
const events = state => get(state, 'exchange.events')

const allOrders = state => get(state, 'exchange.allOrders.data', []);
const cancelledOrders = state => get(state, 'exchange.cancelledOrders.data', []);
const filledOrders = state => get(state, 'exchange.filledOrders.data', []);



//--------------------RE-USABLE SELECTORS--------------------
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

const decorateOrder = (order, tokens) => {
    let token0Amount, token1Amount
  
    // Note: DApp should be considered token0, mETH is considered token1
    // Example: Giving mETH in exchange for DApp BUY
    if (order.tokenGive === tokens[1].address) {
      token0Amount = order.amountGive // The amount of mETH we are giving
      token1Amount = order.amountGet // The amount of daPP we want...
    } else {//SELL
      token0Amount = order.amountGet // The amount of mETH we want
      token1Amount = order.amountGive // The amount of daPP we are giving...
    }
const precision = 100000
let tokenPrice = (token0Amount / token1Amount)
tokenPrice = Math.round(tokenPrice * precision) / precision
    return ({
        ...order,
        token0Amount: ethers.utils.formatUnits(token0Amount, "ether"),
        token1Amount: ethers.utils.formatUnits(token1Amount, "ether"),
        tokenPrice: tokenPrice,
        displayTokenPrice: tokenPrice.toFixed(2),
        formattedTimestamp: moment.unix(order.timeStamp).format('HH:mm:ss D MMM YY'),
    })
}
//---------------------ORDERBOOK SELECTORS---------------------
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
        sellOrders: sellOrders.sort((a, b) => a.tokenPrice - b.tokenPrice)
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
        


        return({
            lastPrice: lastPrice,
            lastPriceChange: (lastPrice >= secondLastPrice ? 'up' : 'down'),
            series: [{
                data: buildGraphData(orders)
            }]
        })
        

        

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

//.......................All FILLED ORDERS SELECTOR.......................
export const filledOrdersSelector = createSelector(
    filledOrders,
    tokens,
    (orders, tokens) => {
        if(!tokens[0] || !tokens[1]) {return}
        orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
        orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
        orders = orders.sort((a, b) => a.timeStamp - b.timeStamp)//sort orders ascending for price comparison

        orders = decorateFilledorders(orders, tokens)

        orders = orders.sort((a, b) => b.timeStamp - a.timeStamp)// sort orders descending for display

        return orders
    }
)

    const decorateFilledorders = (orders, tokens) => {
        //defining 1st value of previous order
        let previousOrder = orders[0]
        return(
            orders.map((order) => {
                order = decorateOrder(order, tokens)
                order = decorateFilledOrder(order, previousOrder)
                previousOrder = order //update previous order after decoration
            return order
            
        })
        )
    }

    const decorateFilledOrder = (order, previousOrder) => {

        return ({
            ...order,
            tokenPriceClass: tokenPriceClass(order.tokenPrice, order.id, previousOrder),
        })

    }

    const tokenPriceClass  = (tokenPrice, orderId, previousOrder) => {
        if (previousOrder.id.toString() === orderId.toString()) {
            return YELLOW
        }

        if(previousOrder.tokenPrice <= tokenPrice) {
        return GREEN 
        } else {
        return RED
        }
    }
    
    //-------------------------MY OPEN ORDERS SELECTOR-------------------------
    export const myOpenOrdersSelector = createSelector(
        account,
        tokens,
        openOrders,
        (account, tokens, orders) => {
            
            if(!tokens[0] || !tokens[1]) {return}
            
            orders = orders.filter((o) => o.user === account) //filter orders by user
            orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
            orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
            
            orders = decorateMyOpenOrders(orders, tokens)
            
            //sort orders by descending timestamp
            orders = orders.sort((a, b) => b.timeStamp - a.timeStamp)
            
            return orders
        }
    )
        
        const decorateMyOpenOrders = (orders, tokens) => {
            
            return(
                orders.map((order) => {
                    order = decorateOrder(order, tokens)
                    order = decorateMyOpenOrder(order, tokens)
                    return order
                    
                })
        )
        }
    
        const decorateMyOpenOrder = (order, tokens) => {
        //apply color for buy/sell
        let orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'
        //order.orderType = orderType
        
        
        return ({
            ...order, 
            orderType, 
            orderTypeClass: (orderType === 'buy' ? GREEN : RED)
        })
            
        }
        
        
    //-----------------------MY FILLED ORDERS SELECTORS-----------------------
    export const myFilledOrderSelector = createSelector(
        account,
        tokens,
        filledOrders,
        (account, tokens, orders) => {
            
            if(!tokens[0] || !tokens[1]) {return}

            //filled orders can be either maker or taker so we need to filter by both
            orders = orders.filter((o) => o.user === account || o.creator === account)
            //only orders that are from this market
            orders = orders.filter((o) => o.tokenGet === tokens[0].address || o.tokenGet === tokens[1].address)
            orders = orders.filter((o) => o.tokenGive === tokens[0].address || o.tokenGive === tokens[1].address)
            
            
            //sort orders by descending timestamp
            orders = orders.sort((a, b) => b.timeStamp - a.timeStamp)
            
            orders = decorateMyFilledOrders(orders, account, tokens)
            return orders
        }
    )
        
        const decorateMyFilledOrders = (orders, account, tokens) => {
            
            return(
                orders.map((order) => {
                    order = decorateOrder(order, tokens)
                    order = decorateMyFilledOrder(order, account, tokens)
                    return order
                    
                })
        )
        }
    
        const decorateMyFilledOrder = (order, account, tokens) => {
        //who created the order
        const myOrder = order.creator === account

        let orderType 
        if(myOrder) {
            orderType = order.tokenGive === tokens[1].address ? 'buy' : 'sell'
        } else {
            orderType = order.tokenGive === tokens[1].address ? 'sell' : '`buy'
        }
        order.orderType = orderType
        
        
        return ({
            ...order, 
            orderType, 
            orderClass: (orderType === 'buy' ? GREEN : RED),
            orderSign: (orderType === 'buy' ? '+' : '-')
        })
        }

    //--------------------FETCH ORDER INFO FOR THE BLOCKEXPLORER-----------------
    export const myEventsSelector = createSelector(
        account,
        events,
        (account, events) => {
            events = events.filter((e) => e.args.user === account)
            return (events)
        }
    )
