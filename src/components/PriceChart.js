import { useSelector } from "react-redux";
import { useRef, useState } from "react";
import Banner from "./Banner";
import Chart from "react-apexcharts";
import { options } from './PriceChart.config.js';
import { priceChartSelectorHour, priceChartSelectorDay } from "../store/selectors";
import arrowDown from '../assets/down-arrow.svg';
import arrowUp from '../assets/up-arrow.svg';

const PriceChart = () => {

  const account = useSelector(state => state.provider.account)
  const symbols = useSelector(state => state.tokens.symbols)

  const priceChartHour = useSelector(priceChartSelectorHour)
  const priceChartDay = useSelector(priceChartSelectorDay)

  const hourRef = useRef(null);
  const dayRef = useRef(null);
  const [showHour, setShowHour] = useState(true);
 

  const timeFrameHandler = (e) => {
    if (e.target.className !== hourRef.current.className) {
      e.target.className = 'tab tab--active';
      hourRef.current.className = 'tab';
      setShowHour(true);
    } else {
      e.target.className = 'tab tab--active';
      dayRef.current.className = 'tab';
      setShowHour(false);
    }
  }

  return (

    <div className="component exchange__chart">
      <div className='component__header flex-between'>
        <div className='flex'>
          <h2>{symbols && `${symbols[0]}/${symbols[1]}`}</h2>
          <div className='flex'>            
              {priceChartDay && priceChartDay.lastPriceChange === 'up' ? (
                <img src={arrowUp} alt="Arrow up" />
              ) : (
                <img src={arrowDown} alt="Arrow down" />
              )}
            <span className='up'>{priceChartDay && priceChartDay.lastPrice}</span>
          </div>
         </div>

         <div className='flex-end'>
          <div className='tabs'>
            <button onClick={timeFrameHandler} ref={hourRef} className='tab'>1-Hour</button>
            <button onClick={timeFrameHandler} ref={dayRef} className='tab tab--active'>1-Day</button>
          </div>
         </div>
      </div>

      {! account ? (
        <Banner text={'Please connect your wallet'}/>
      ) : (showHour && priceChartHour) ? (
          
            

            <Chart 
            series = {priceChartHour ? priceChartDay.series : []}
            type='candlestick'
            width='100%'
            height='100%'
            options={options}
          />
           )  :  (
          <Chart 
          series = {priceChartHour ? priceChartHour.series : []}
          type='candlestick'
          width='100%'
          height='100%'
          options={options}
        />
      // ) : (
      //     <Banner text={'Loading chart...'}/>
      //     )
        )}

{/* else statement */}



{/* finish if statement */}

    </div>
    );
  }
  
  export default PriceChart;
  