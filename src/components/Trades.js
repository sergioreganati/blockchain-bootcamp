import { filledOrdersSelector } from "../store/selectors";
import { useSelector } from "react-redux";
import sort from '../assets/sort.svg';
import Banner from "./Banner";

const Trades = () => {

  const filledOrders = useSelector(filledOrdersSelector)
  const symbols = useSelector(state => state.tokens.symbols)
  const filledOrdersLenght = filledOrders && filledOrders.length

  return (
    <div className="component exchange__trades">
      <div className='component__header flex-between'>
        <h2>Trades</h2>
      </div>

      {!filledOrders || filledOrdersLenght === 0 ? (
        <Banner text={'No trades yet'}/>
      ) : (
      <table>
        <thead>
          <tr>
            <th>Time<img src={sort} alt="Sort"/></th>
            <th>{symbols && symbols[0]}<img src={sort} alt="Sort"/></th>
            <th>{symbols && symbols[1]}/{symbols && symbols[0]}<img src={sort} alt="Sort"/></th>
          </tr>
        </thead>
        <tbody>
          {filledOrders && filledOrders.map((order, index) => {
            return (
              <tr key ={index}>
              <td>{order.formattedTimestamp}</td>
              <td style={{color: `${order.tokenPriceClass}`}}>{order.displayToken1Amount}</td>
              <td>{order.displayTokenPrice}</td>
            </tr>
            )
          })}
        </tbody>
      </table>
      )}
    </div>
  );
}
  
  export default Trades;
