import { useState, useRef } from 'react';
import { buyOrder, sellOrder } from '../store/interations';
import { useDispatch, useSelector } from 'react-redux';

const Order = () => {

    const [isBuy, setIsBuy] = useState(true);
    const [amount, setAmount] = useState(0)
    const [price, setPrice] = useState(0)

    const provider = useSelector(state => state.provider.connection);
    const exchange = useSelector(state => state.exchange.contract);
    const tokens = useSelector(state => state.tokens.contracts);
    const symbols = useSelector(state => state.tokens.symbols);
    //console.log('tokens', tokens[1])

    const dispatch = useDispatch();

    const buyHandler = (e) => {
      e.preventDefault();
      buyOrder(provider, exchange, tokens, { amount, price }, dispatch)
      setAmount(0)
      setPrice(0)
    }

    const sellHandler = (e) => {
      e.preventDefault();
      sellOrder(provider, exchange, tokens, { amount, price }, dispatch)
      setAmount(0)
      setPrice(0)
    }

    const buyRef = useRef(null);
    const sellRef = useRef(null);

    const tabHandler = (e) => {
      if(e.target.className !== buyRef.current.className) {
        buyRef.current.className = 'tab';
        e.target.className = 'tab tab--active';
        setIsBuy(false);
      } else {
        e.target.className = 'tab tab--active';
        sellRef.current.className = 'tab';
        setIsBuy(true);
      }
    }

    return (
      <div className="component exchange__orders">
        <div className='component__header flex-between'>
          <h2>New Order</h2>
          <div className='tabs'>
            <button onClick={tabHandler} ref={buyRef} className='tab tab--active'>Buy</button>
            <button onClick={tabHandler} ref={sellRef} className='tab'>Sell</button>
          </div>
        </div>
  
      <form onSubmit={isBuy ? (
          (e) =>buyHandler(e)
        ) : (
          (e) =>sellHandler(e)
        )}>

        {isBuy ? (
            <label htmlFor="amount">Buy {symbols && symbols[0]} Amount</label>
        ) : (
            <label htmlFor="amount">Sell {symbols && symbols[0]} Amount</label>
        )}

        <input 
          type="text" 
          id='amount' 
          placeholder='0.0000' 
          value={amount === 0 ? '' : amount}
          onChange={(e) => setAmount(e.target.value)}/>

        {isBuy ? (
          <label htmlFor="price">Buy Price {symbols && symbols[1]}/{symbols && symbols[0]}</label>
        ) : (
          <label htmlFor="price">Sell Price {symbols && symbols[1]}/{symbols && symbols[0]}</label>
        )}

        <input 
          type="text" 
          id='price' 
          placeholder='0.0000'
          value={price === 0 ? '' : price}
          onChange={(e) => setPrice(e.target.value)}/>
  
        <button className='button button--filled' type='submit'>
          {isBuy ? (
            <span>Buy</span>
          ) : (
            <span>Sell</span>
          )}
        </button>

      </form>
      </div>
    );
  }
  
  export default Order;