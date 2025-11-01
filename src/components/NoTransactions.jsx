import React from 'react'
import transactionSvg from '../assets/transaction.svg'

const NoTransactions = () => {
  return (
    <div className='p-4 items-center justify-center flex flex-col'>
      <img 
      src={transactionSvg}
      alt='No transaction'
      className='w-1/3 h-1/3'
      />
      <div className='font-semibold text-lg mt-10'>Currently you have no transactions.</div>
    </div>
  )
}

export default NoTransactions
