import dapp from '../assets/dapp.svg';
import eth from '../assets/eth.svg';
import { useSelector ,useDispatch} from 'react-redux';
import { loadBalances } from '../store/interations';
import { useEffect, useState , useRef } from 'react';
import { transferTokens } from '../store/interations';


const Balance = () => {
    const dispatch = useDispatch();

    const [isDeposit, setIsDeposit] = useState(true);
    const [token1TransferAmount, setToken1TransferAmount] = useState(0);
    const [token2TransferAmount, setToken2TransferAmount] = useState(0);

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
        }   else {
            setToken2TransferAmount(event.target.value)
        }   


    }
    //console.log({ token1TransferAmount })

    const depositHandler = (e, token) => {
        e.preventDefault();

      
        if (token.address === tokens[0].address) {
            //console.log(`depositing ${token1TransferAmount} ${token.symbol}`)
         transferTokens(provider, exchange, 'Deposit', token, token1TransferAmount, dispatch) 
         setToken1TransferAmount(0)
        }   else {
            transferTokens(provider, exchange, 'Deposit', token, token2TransferAmount, dispatch) 
            setToken2TransferAmount(0)
              // console.log(`depositing ${token2TransferAmount} ${token.symbol}`)

        }
    }
    const depositRef = useRef(null);
    const withdrawRef = useRef(null);


    const tabHandler = (e) => {
        if(e.target.className !== depositRef.current.className) {
            depositRef.current.className = 'tab';
            withdrawRef.current.className = 'tab tab--active';
            setIsDeposit(false);
        } else {
            depositRef.current.className = 'tab tab--active';
            withdrawRef.current.className = 'tab';
            setIsDeposit(true);
        }



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
            <button onClick={tabHandler} ref={depositRef} className='tab'>Deposit</button>
            <button onClick={tabHandler} ref={withdrawRef} className='tab tab--active'>Withdraw</button>
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
                {isDeposit ? (
                    <span>Deposit</span>
                ) : (
                    <span>Withdraw</span>
                )}
            </button>
          </form>
        </div>
  
        <hr />
  
        {/* Deposit/Withdraw Component 2 (mETH) */}
  
        <div className='exchange__transfers--form'>
          <div className='flex-between'>
          <p><small>Token</small><br /><img src = {eth} alt="Token Logo" />{symbols && symbols[1]}</p>
            <p><small>Wallet</small><br />{tokenBalances && tokenBalances[1]}</p>
            <p><small>Exchange</small><br />{exchangeBalances && exchangeBalances[1]}</p>
          </div>
  
          <form onSubmit={(e) =>depositHandler(e, tokens[1])}>
            <label htmlFor="token1">{symbols && symbols[1]} Amount</label>
            <input 
                type="text" 
                id='token1' 
                placeholder='0.0000' 
                value={token2TransferAmount === 0 ? '' : token2TransferAmount}
                onChange={(event) => amountHandler(event, tokens[1])}/>
  
  
            <button className='button' type='submit'>
            {isDeposit ? (
                    <span>Deposit</span>
                ) : (
                    <span>Withdraw</span>
                )}            </button>
          </form>
        </div>
  
        <hr />
      </div>
    );
  }
  
  export default Balance;
