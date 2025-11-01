import React from 'react'
import { Card, Row, Col } from 'antd'

const Cards = ({handleShowIncome, handleShowExpense, income, expense, balance}) => {
  return (
    <div>
      <Row gutter={16} className='p-4'>
        <Col span={8}>
          <Card title='Current Balance' hoverable className='shadow-lg'>
            <div className='text-lg text-gray-800 font-semibold'>
                ₹ {balance}
            </div>
            <button className='border text-blue-500 border-blue-500 text-md p-2 font-semibold mt-2 w-full cursor-pointer'>Reset Balance</button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title='Total Income' hoverable className='shadow-lg'>
            <div className='text-lg text-gray-800 font-semibold'>
                ₹ {income}
            </div>
            <button className='border text-blue-500 border-blue-500 text-md p-2 font-semibold mt-2 w-full cursor-pointer' onClick={handleShowIncome}>Add Income</button>
          </Card>
        </Col>

        <Col span={8}>
          <Card title='Total Expenses' hoverable className='shadow-lg'>
            <div className='text-lg text-gray-800 font-semibold'>
                ₹ {expense}
            </div>
            <button className='border text-blue-500 border-blue-500 text-md p-2 font-semibold mt-2 w-full cursor-pointer' onClick={handleShowExpense}>Add Expense</button>
          </Card>
        </Col>
      </Row>
    </div>
  )
}

export default Cards
