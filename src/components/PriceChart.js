import { useSelector } from "react-redux";
import Banner from "./Banner";
import Chart from "react-apexcharts";
import { options, series } from './PriceChart.config.js';
import { priceChartSelector } from "../store/selectors";
import arrowDown from '../assets/down-arrow.svg';
import arrowUp from '../assets/up-arrow.svg';


const PriceChart = () => {
    const account = useSelector(state => state.provider.account)
    const symbols = useSelector(state => state.tokens.symbols)

    const priceChart = useSelector(priceChartSelector)
    //console.log({ priceChart })
    // const orders = useSelector(state => state.exchange.filledOrders)
    // const tokens = useSelector(state => state.tokens.contracts)


    // if (tokens[0] || tokens[1]) {
    // series = priceChartSelector(orders, tokens)
    // }

    return (


      <div className="component exchange__chart">
        <div className='component__header flex-between'>
          <div className='flex'>
  
            <h2>{symbols && `${symbols[0]}/${symbols[1]}`}</h2>
  
            <div className='flex'>

                {priceChart && priceChart.lastPriceChange === 'up' ? (
                    <img src={arrowUp} alt="Arrow up" />
                ) : (
                    
                    <img src={arrowDown} alt="Arrow down" />
                )}



              <span className='up'>{priceChart && priceChart.lastPrice}</span>
            </div>
  
          </div>
        </div>

        {! account ? (
            
            <Banner text={'Please connect your wallet'}/>
        ) : (
            <Chart 
            series = {priceChart ? priceChart.series : series}
            type='candlestick'
            width='100%'
            height='100%'
            options={options}
            />  
        ) }

        {/* Price chart goes here */}
  
      </div>
    );
  }
  
  export default PriceChart;
  