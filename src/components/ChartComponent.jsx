import React from 'react'
import { Line, Pie } from '@ant-design/charts';

const ChartComponent = ({sortedTransactionsForChart}) => {
  
  const data = sortedTransactionsForChart.map((item) => ({
  date: item.date,
  amount: item.amount
  }));

  const spendingData = sortedTransactionsForChart
        .filter (item => item.type === 'expense')
        .map(item => ({
          tag: item.tag,
          amount: item.amount
        }))
  
  // const spendingData = []

  const config = {
    data,
    xField: 'date',
    yField: 'amount',
    point: {
      shapeField: 'square',
      sizeField: 4,
    },
    interaction: {
      tooltip: {
        marker: false,
      },
    },
    style: {
      lineWidth: 2,
    },
  };

  const spendingConfig = {
    data: spendingData,
    angleField: 'amount',
    colorField: 'tag',
    radius: 0.8,
    innerRadius: 0.5,
    label: {
      text: 'amount',
      style: {
        fontWeight: 'bold',
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: 'Your\nSpends',
          x: '50%',
          y: '50%',
          textAlign: 'center',
          fontSize: 30,
          fontStyle: 'bold',
        },
      },
    ],
  };

  
  return (
    <div className='p-4 flex w-full gap-4'>
        <div className='w-1/2 shadow-xl'>
          <div className='font-bold text-2xl mb-4 m-2 p-2'>Your Analytics</div>
          <div><Line {...config} />  </div>
        </div>
        
        <div className='w-1/2 shadow-xl shadow-blue-100'>
          <div className='font-bold text-2xl mb-4 m-2 p-2'>Your Expenses</div>
          
          <div>
            {spendingData.length === 0 ? <div className='p-2 m-2'>Seems like you don't have any spendings until now...</div> : <div><Pie {...spendingConfig}/></div>}
          </div>
        </div>
    </div>
  )
}

export default ChartComponent
