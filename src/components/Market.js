import config from '../config'
import { useSelector , useDispatch} from 'react-redux';
import { loadTokens } from '../store/interations';

const Markets = () => {
    
    const dispatch = useDispatch();
    const chainId = useSelector(state => state.provider.chainId);
    const provider = useSelector(state => state.provider.connection);

    const marketHandler = async (event) => {
        loadTokens(provider, (event.target.value).split(`,`), dispatch)
        }
       
    return(
        <div className='component exchange__markets'>
            <div className='component__header'>
                <h2>Select Market</h2>
                </div>
                {chainId && config[chainId] ? (
                <select name="markets" id="markets" onChange={marketHandler}>
                <option value={`${config[chainId].sDEX.address},${config[chainId].mETH.address}`}>sDex/mETH</option>
                <option value={`${config[chainId].mETH.address},${config[chainId].sDEX.address}`}>mETH/sDex</option>
                <option value={`${config[chainId].sDEX.address},${config[chainId].mDAI.address}`}>sDex/mDai</option>
                <option value={`${config[chainId].mDAI.address},${config[chainId].sDEX.address}`}>mDai/sDex</option>
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
