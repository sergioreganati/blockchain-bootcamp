import { useEffect } from 'react';
//import { ethers } from 'ethers';
import config from '../config.json';
import { useDispatch } from 'react-redux';
import { loadProvider, 
  loadNetwork, 
  //loadAccount, 
  loadTokens, 
  loadExchange,
  loadAccount 
} from '../store/interations';

import Navbar from './Navbar';



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
    const dapp = config[chainId].DApp
    const meth = config[chainId].mETH
    await loadTokens(provider, [dapp.address, meth.address], dispatch)
   

    //log Dapp symbol

   
    //get exchange contract
    const exchangeConfig = config[chainId].exchange
   await loadExchange(provider, exchangeConfig.address, dispatch)
    //console.log(`Exchange fetched: ${exchange.address}\n`)
  }
useEffect(() => {
  loadblockchainData()
})
  return (
    <div>
      <Navbar />
      

      <main className='exchange grid'>
        <section className='exchange__section--left grid'>

          {/* Markets */}

          {/* Balance */}

          {/* Order */}

        </section>
        <section className='exchange__section--right grid'>

          {/* PriceChart */}

          {/* Transactions */}

          {/* Trades */}

          {/* OrderBook */}

        </section>
      </main>

      {/* Alert */}

    </div>
  );
}

export default App;
