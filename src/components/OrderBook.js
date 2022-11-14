import { useSelector, useDispatch } from "react-redux";

import { orderBookSelector } from "../store/selectors";
import sort from '../assets/sort.svg';
import { fillOrder } from "../store/interations";
//import { useEffect } from "react";



const OrderBook = () => {
    const symbols = useSelector(state => state.tokens.symbols);
    const orderBook = useSelector(orderBookSelector)
    const dispatch = useDispatch();
    const exchange = useSelector(state => state.exchange.contract);
    const provider = useSelector(state => state.provider.connection);

  const fillOrderHandler = (order) => {
    console.log(order);
    fillOrder(provider, exchange, order, dispatch)
  }



    return (
      <div className="component exchange__orderbook">
        <div className='component__header flex-between'>
          <h2>Order Book</h2>
        </div>
  
        <div className="flex">
          {!orderBook || orderBook.sellOrders.lenght === 0 ? (
            <p className="text-center">No Sell Orders</p>
          ) : (
          
          <table className='exchange__orderbook--sell'>
            <caption>Selling</caption>
            <thead>
              <tr>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                <th>{symbols && symbols[0]}/{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>  
                <th>{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>
              </tr>
            </thead>
            <tbody>
              {orderBook && orderBook.sellOrders.map((order, index) => {
                return (
             <tr key={index} onClick={() => fillOrderHandler(order)}>
               <td>{order.token0Amount}</td>
               <td style={{color: `${order.orderTypeClass}`}}>{order.displayTokenPrice}</td>
               <td>{order.token1Amount}</td>
             </tr>
                )
            })}
            </tbody>
          </table>
          )}


          <div className='divider'></div>
  
          <table className='exchange__orderbook--buy'>
            <caption>Buying</caption>
            <thead>
              <tr>
                <th>{symbols && symbols[1]}<img src={sort} alt="Sort" /></th>
                <th>{symbols && symbols[1]}/{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
                <th>{symbols && symbols[0]}<img src={sort} alt="Sort" /></th>
              </tr>
            </thead>
            <tbody>
              {orderBook && orderBook.buyOrders.map((order, index) => {
                return (
                  <tr key={index} onClick={() => fillOrderHandler(order)}>
                  <td>{order.token0Amount}</td>
                  <td style={{color: `${order.orderTypeClass}`}}>{order.displayTokenPrice}</td>
                  <td>{order.token1Amount}</td>
                </tr>
                  )    
              })}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
  
  export default OrderBook;
  