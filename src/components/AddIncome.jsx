import React from 'react'
import { Form, Input, DatePicker, Select, Button } from 'antd'
import { addDoc, collection } from 'firebase/firestore'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import moment from 'moment'

const AddIncome = ({ onSuccess, addTransaction }) => {
  const [user] = useAuthState(auth)
  const [form] = Form.useForm()

  const handleFinish = async (values) => {
    const newTransaction = {
      date: values.date.format("YYYY-MM-DD"),
      amount: parseFloat(values.amount),
      tag: values.category,
      name: values.source,
      type: "income",
    };

    await addTransaction(newTransaction);
    onSuccess(newTransaction);
    form.resetFields();
  };


  return (
    <div>
      <Form layout='vertical' form={form} onFinish={handleFinish}>
        <Form.Item
          label='Source'
          name='source'
          rules={[{ required: true, message: 'Please enter income source' }]}
        >
          <Input placeholder='e.g. Salary, Freelance' />
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
            <Select.Option value='salary'>Salary</Select.Option>
            <Select.Option value='freelance'>Freelance</Select.Option>
            <Select.Option value='investment'>Investment</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type='primary' htmlType='submit' className='w-full'>
            Add Income
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default AddIncome
