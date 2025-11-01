import React, { useState } from 'react';
import { Input, Table, Select, Radio } from 'antd';
import { SearchOutlined } from '@ant-design/icons';
import { usePapaParse } from 'react-papaparse';
import { toast } from 'react-toastify';

import ChartComponent from './ChartComponent'

const TransactionsTable = ({ transactions, setTransactions, addTransaction }) => {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [sortKey, setSortKey] = useState('');

  const { jsonToCSV, readString } = usePapaParse();

  const columns = [
    { title: 'Name', dataIndex: 'name', key: 'name' },
    { title: 'Amount', dataIndex: 'amount', key: 'amount', render: (value) => (isNaN(value) ? '-' : value) },
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Tag', dataIndex: 'tag', key: 'tag' },
    { title: 'Type', dataIndex: 'type', key: 'type' },
  ];

  let filteredTransactions = transactions.filter(
    (item) =>
      item.name.toLowerCase().includes(search.toLowerCase()) &&
      item.type.includes(typeFilter)
  );

  let sortedTransactions = [...filteredTransactions].sort((a, b) => {
  if (sortKey === 'date') {
    return new Date(b.date) - new Date(a.date); // newest first
  } else if (sortKey === 'amount') {
    return b.amount - a.amount; // largest amount first
  } else {
    return 0;
  }
});

  let sortedTransactionsForChart = [...transactions].sort(
  (a, b) => new Date(a.date) - new Date(b.date)
  );

  const exportCSV = () => {
  const cleanedData = transactions.map(({ id, ...rest }) => rest);

  const csv = jsonToCSV(cleanedData);

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.setAttribute('download', 'transactions.csv');
  link.click();

  toast.success('File downloaded successfully!');
  };

  // IMPORT CSV
  const importCSV = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = ({ target }) => {
    const csv = target.result;

    readString(csv, {
      header: true,
      skipEmptyLines: true,
      complete: async (results) => {
        const validRows = results.data.filter(
          (r) =>
            r.name &&
            r.amount &&
            r.date &&
            r.type &&
            !isNaN(parseFloat(r.amount))
        );

        for (const transaction of validRows) {
          const newTransaction = {
            ...transaction,
            amount: parseFloat(transaction.amount),
          };
          await addTransaction(newTransaction, true);
        }

        toast.success("CSV imported successfully!");
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        toast.error("Failed to import CSV");
      },
    });
  };

  reader.readAsText(file);
};


  return (
    <div className="p-4">
      <Input
        placeholder="Search by name..."
        onChange={(e) => setSearch(e.target.value)}
        prefix={<SearchOutlined />}
        className="h-12 text-lg"
      />

      <div className="flex gap-4 mt-4 mb-4 items-center">
        <Select
          options={[
            { value: '', label: 'All' },
            { value: 'income', label: 'Income' },
            { value: 'expense', label: 'Expense' },
          ]}
          className="w-1/3 mt-2"
          onChange={(value) => setTypeFilter(value)}
          value={typeFilter}
          placeholder="Filter by type"
        />

        <Radio.Group
          value={sortKey}
          options={[
            { value: '', label: 'No Sort' },
            { value: 'amount', label: 'Sort by Amount' },
            { value: 'date', label: 'Sort by Date' },
          ]}
          onChange={(e) => setSortKey(e.target.value)}
          className="w-1/3"
        />

        <input
          type="file"
          accept=".csv"
          onChange={importCSV}
          id="csvInput"
          style={{ display: 'none' }}
        />

        <button
          className="border-2 border-blue-500 p-2 text-sm rounded-xl hover:text-white hover:bg-blue-500 cursor-pointer w-1/6"
          onClick={() => document.getElementById('csvInput').click()}
        >
          Import CSV
        </button>

        <button
          className="border-2 text-white bg-blue-500 border-blue-500 p-2 text-sm rounded-xl hover:text-black hover:bg-white cursor-pointer w-1/6"
          onClick={exportCSV}
        >
          Export CSV
        </button>
      </div>

      <div className="font-semibold text-xl mb-2">My Transactions</div>
      <Table
        columns={columns}
        dataSource={sortedTransactions}
        rowKey={(record) => record.id || record.name + record.date + Math.random()}
      />

      <ChartComponent sortedTransactionsForChart={sortedTransactionsForChart}/>
    </div>
  );
};

export default TransactionsTable;
