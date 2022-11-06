import { useEffect } from 'react';
import { ethers } from 'ethers';
import EXCHANGE_ABI from '../abis/Exchange.json'
import config from '../config.json';
import { useDispatch } from 'react-redux';
import { loadProvider, loadNetwork, loadAccount, loadToken } from '../store/interations';


function App() {
  const dispatch = useDispatch();



  const loadblockchainData = async () => {


    const acount = await loadAccount(dispatch);
    console.log(acount[0])

    //connect ethers to blockchain using function defined in interactions and store info
    const provider = await loadProvider(dispatch)
    const chainId = await loadNetwork(dispatch, provider)

    //get Tokens contract
    const token = await loadToken(provider, config[chainId].DApp.address, dispatch)
    console.log(`Dapp token fetched: ${token.address}\n`)

    //log Dapp symbol

    const symbol = await token.symbol()
    console.log(symbol)
    //const mETH = new ethers.Contract(config[chainId].mETH.address, TOKEN_ABI, provider)
    //console.log(`mETH token fetched: ${mETH.address}\n`)
    //const mDAI = new ethers.Contract(config[chainId].mDAI.address, TOKEN_ABI, provider)
    //console.log(`mDAI token fetched: ${mDAI.address}\n`)
    const exchange = new ethers.Contract(config[chainId].exchange.address, EXCHANGE_ABI, provider)
    console.log(`Exchange fetched: ${exchange.address}\n`)




  }
useEffect(() => {
  loadblockchainData()
})




  return (
    <div>

      {/* Navbar */}

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
