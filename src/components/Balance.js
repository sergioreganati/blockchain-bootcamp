import dapp from '../assets/dapp.svg';
import { useSelector ,useDispatch} from 'react-redux';
import { loadBalances } from '../store/interations';
import { useEffect, useState } from 'react';
import { transferTokens } from '../store/interations';


const Balance = () => {
    const dispatch = useDispatch();

    const [token1TransferAmount, setToken1TransferAmount] = useState(0);

    const symbols = useSelector(state => state.tokens.symbols);

    //console.log(symbols[1]);
    const provider = useSelector(state => state.provider.connection);
    const exchange = useSelector(state => state.exchange.contract);
    const exchangeBalances = useSelector(state => state.exchange.balances);
    const transferInProgress = useSelector(state => state.exchange.transferInProgress);
    const tokens = useSelector(state => state.tokens.contracts);
    const tokenBalances = useSelector(state => state.tokens.balances);
    const account = useSelector(state => state.provider.account);
    
    const amountHandler = (event, token) => {
        if (token.address === tokens[0].address) {
            setToken1TransferAmount(event.target.value)
        }   
        ///console.log(event.target.value);
    }
    console.log({ token1TransferAmount })

    const depositHandler = (e, token) => {
        e.preventDefault();

        //do deposit
        if (token.address === tokens[0].address) {
            console.log(`depositing ${token1TransferAmount} ${token.symbol}`)
         transferTokens(provider, exchange, 'Deposit', token, token1TransferAmount, dispatch) 
         setToken1TransferAmount(0)
        }   
        //notify app deposit is pending

        //get confirmation of deposit from blockchain

        //notify app deposit is complete
    }
    




    useEffect(() => {
        if(account && tokens[0] && tokens[1] && exchange) { 
        loadBalances(exchange, tokens, account, dispatch)}
    }, [exchange, tokens, account, transferInProgress, dispatch])

    return (
      <div className='component exchange__transfers'>
        <div className='component__header flex-between'>
          <h2>Balance</h2>
          <div className='tabs'>
            <button className='tab tab--active'>Deposit</button>
            <button className='tab'>Withdraw</button>
          </div>
        </div>
  
        {/* Deposit/Withdraw Component 1 (DApp) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
            <p><small>Token</small><br /><img src = {dapp} alt="Token Logo" />{symbols && symbols[0]}</p>
            <p><small>Wallet</small><br />{tokenBalances && tokenBalances[0]}</p>
            <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[0]}</p>

          </div>
  
          <form onSubmit={(e) =>depositHandler(e, tokens[0])}>
            <label htmlFor="token0">{symbols && symbols[0]} Amount</label>
            <input 
                type="text" 
                id='token0' 
                placeholder='0.0000' 
                value={token1TransferAmount === 0 ? '' : token1TransferAmount}
                onChange={(event) => amountHandler(event, tokens[0])}/>
  
            <button className='button' type='submit'>
              <span>Deposit</span>
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 (mETH) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
  
          </div>
  
          <form>
            <label htmlFor="token1"></label>
            <input type="text" id='token1' placeholder='0.0000'/>
  
            <button className='button' type='submit'>
              <span></span>
            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
  export default Balance;
