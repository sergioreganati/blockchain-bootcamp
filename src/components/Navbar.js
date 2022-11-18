import eth from '../assets/eth.svg';
import cdex from '../assets/cdex.png';
import { useSelector, useDispatch } from 'react-redux';
import { useState } from 'react';
import Blockies from 'react-blockies';
import { loadAccount} from '../store/interations';
import config from '../config.json';

const Navbar = () => {
    const provider = useSelector(state => state.provider.connection);
    const chainId = useSelector(state => state.provider.chainId);
    const account = useSelector((state) => state.provider.account);
    const etherBalance = useSelector((state) => state.provider.etherBalance);
    const dispatch = useDispatch();
    
    let [network, setNetwork] = useState()
    
    const connectHandler = async () => {
      await loadAccount(provider, dispatch);
      
    }
    
    const networkHandler = async (event) => {
      
      //console.log(chainId);
      //console.log(config[chainId]);
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ 
            chainId: event.target.value
            
          }],
        })
        chainId.toString(16)
        console.log(network);
      //console.log(chainId);
      //console.log(config[chainId]);
      //console.log(chainId.toString(16))

      } catch (switchError) {
        if (switchError.code === 4902) {
          try {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{ 
                chainId: event.target.value.toString(16),
                chainName: config[event.target.value].name,
                nativeCurrency: {
                  name: 'Ether',
                  symbol: 'ETH',
                  decimals: 18
                },
              
              }],
            })
          } catch (addError) {
            console.log(addError)
          }
        }
      } 
    }
    return(
      <div className='exchange__header grid'>
        <div className='exchange__header--brand flex'>
            <img src={cdex} className ="logo" alt="Cdex logo"></img>
            <h1>SDEX Token Exchange</h1>
        </div>
        <div className='exchange__header--networks flex'>

          <img src={eth} className="eth" alt="eth logo"></img>
          {chainId && (
          <select name="networks" id="networks" value={`0x${chainId.toString(16)}`}  onChange={networkHandler}> 
          <option value="0" disabled>Select Network</option>
          <option value="0x7a69">LocalHost</option>
          <option value="0xaa36a7">Sepolia</option>
          <option value="0x5">Goerli</option>
          <option value="0x13881">Mumbai</option>

          </select>
          )}

        </div>
  
        <div className='exchange__header--account flex'>
            {etherBalance ?  (
            <p><small>My Balance</small>{Number(etherBalance).toFixed(4)}</p>
            ) : (
            <p><small>My Balance</small>0.0000</p>
            )}

            {account ? (
                <a href={config[chainId] ? `${config[chainId].explorerURL}/address/${account}` : '#'} 
                target = "_blank"
                rel="noreferrer"
                >
                    {account.slice(0,5) + '...' + account.slice(38,42)}
                    <Blockies 
                     seed={account}  
                     size={10} 
                     scale={3} 
                     color="#2187D0"
                     bgColor="#F1F2F9"
                     spotColor='#7677F92'
                    className="identicon" 
                    />
                    </a>
                ) : (
                <button className='button'onClick={connectHandler}>Connect</button>
                )}
                
        </div>
      </div>
    )
  }
  
  export default Navbar;
  