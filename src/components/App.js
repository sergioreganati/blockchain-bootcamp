import { useEffect } from 'react';
//import { ethers } from 'ethers';
import config from '../config.json';
import { useDispatch } from 'react-redux';
import { 
  loadProvider, 
  loadNetwork, 
  loadTokens, 
  loadExchange,
  loadAccount,
  subscribeToEvents,
  loadAllOrders
} from '../store/interations';

import Navbar from './Navbar';
import Markets from './Market';
import Balance from './Balance';
import OrderBook from './OrderBook';
import Order from './Order';
import PriceChart from './PriceChart';
import Trades from './Trades';
import Transactions from './Transactions';
import Alert from './Alert';






function App() {
  const dispatch = useDispatch();



  const loadblockchainData = async () => {

    
    //connect ethers to blockchain using function defined in interactions and store info
    const provider = await loadProvider(dispatch)
    //fetch network chainid 


    window.ethereum.on('chainChanged', (chainId) => {
      window.location.reload();
    });

    const chainId = await loadNetwork(dispatch, provider)
    

    //fetch current account and balance from metamask when changed
    window.ethereum.on('accountsChanged', async (accounts) => {
      //load account
      await loadAccount(provider, dispatch)
    })


    //await loadAccount(provider, dispatch);



    //get Tokens contract
    const sdex = config[chainId].sDEX
    const meth = config[chainId].mETH
    await loadTokens(provider, [sdex.address, meth.address], dispatch)
   

    //log Dapp symbol

   
    //get exchange contract
    const exchangeConfig = config[chainId].exchange
    const exchange = await loadExchange(provider, exchangeConfig.address, dispatch)

    //fetch all orders
    loadAllOrders(provider, exchange, dispatch)

    //listen to subscribe to events
    subscribeToEvents(exchange, dispatch)

  }

useEffect(() => {
  loadblockchainData()
})

  return (
    <div>
      <Navbar />
                  <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          <Markets />

          <Balance />

          <Order />

        </section>
        <section className='exchange__section--right grid'>

          <PriceChart />

          <Transactions />

          <Trades />

          <OrderBook />

        </section>
      </main>

      <Alert />

    </div>
  );
}

export default App;
