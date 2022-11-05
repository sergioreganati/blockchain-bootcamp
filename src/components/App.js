import { useEffect } from 'react';
import { ethers } from 'ethers';
import TOKEN_ABI from '../abis/Token.json'
import EXCHANGE_ABI from '../abis/Exchange.json'
import '../App.css';
import config from '../config.json';



function App() {



  const loadblockchainData = async () => {
    const acounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
    console.log(acounts[0])
    //connect ethers to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)

    //get newtwork id
    const { chainId } = await provider.getNetwork()
    console.log(chainId)
    console.log(config)
    //get Tokens contract
    const Dapp = new ethers.Contract(config[chainId].DApp.address , TOKEN_ABI, provider)
    console.log(`Dapp token fetched: ${Dapp.address}\n`)
    //log Dapp symbol
    const symbol = await Dapp.symbol()
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
