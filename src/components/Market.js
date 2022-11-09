import config from '../config'
import { useSelector , useDispatch} from 'react-redux';
import { loadTokens } from '../store/interations';

//fetch chainId from state

const Markets = () => {
    
    const dispatch = useDispatch();
    const chainId = useSelector(state => state.provider.chainId);
    const provider = useSelector(state => state.provider.connection);
    const marketHandler = async (event) => {
        console.log(`Market Changed`)
        loadTokens(provider, (event.target.value).split(`,`), dispatch)
        
        }
       
    return(
        <div className='component exchange__markets'>
            <div className='component__header'>
                <h2>Select Market</h2>
                </div>
                {chainId && config[chainId] ? (
                <select name="markets" id="markets" onChange={marketHandler}>
                <option value={`${config[chainId].DApp.address},${config[chainId].mETH.address}`}>DApp/mETH</option>
                <option value={`${config[chainId].DApp.address},${config[chainId].mDAI.address}`}>DApp/mDai</option>
                <option value={`${config[chainId].mETH.address},${config[chainId].mDAI.address}`}>mETH/mDai</option>
                </select>  

                ) : (
                <div>
                <p>Connect to a network</p>
                </div>

                )}

                <hr />
            </div>
    )

}
export default Markets
