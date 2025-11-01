import React from 'react'
import { Form, Input, DatePicker, Select, Button } from 'antd'
import { addDoc, collection } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

const AddExpense = ({ onSuccess, addTransaction }) => {
  const [user] = useAuthState(auth)
  const [form] = Form.useForm()

  const handleFinish = async (values) => {
    const newTransaction = {
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.category,
      name: values.purpose,
      type: "expense",
    };

    await addTransaction(newTransaction); 
    onSuccess(newTransaction);
    form.resetFields();
  };

  return (
    <div>
      <Form layout='vertical' form={form} onFinish={handleFinish}>
        <Form.Item
          label='Purpose'
          name='purpose'
          rules={[{ required: true, message: 'Please enter expense purpose' }]}
        >
          <Input placeholder='e.g. Rent, Grocery' />
        </Form.Item>

        <Form.Item
          label='Amount'
          name='amount'
          rules={[{ required: true, message: 'Please enter amount' }]}
        >
          <Input type='number' prefix='₹' />
        </Form.Item>

        <Form.Item
          label='Date'
          name='date'
          rules={[{ required: true, message: 'Please select date' }]}
        >
          <DatePicker style={{ width: '100%' }} />
        </Form.Item>

        <Form.Item label='Category' name='category'>
          <Select placeholder='Select category'>
            <Select.Option value='rent'>Rent</Select.Option>
            <Select.Option value='grocery'>Grocery</Select.Option>
            <Select.Option value='bills'>Bills</Select.Option>
            <Select.Option value='entertainment'>Entertainment</Select.Option>
            <Select.Option value='miscellaneous'>Miscellaneous</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full'>
            Add Expense
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddExpense
