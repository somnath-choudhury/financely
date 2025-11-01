import React, { useEffect, useState } from "react";
import Header from "./Header";
import Cards from "./Cards";
import { Modal } from "antd";
import AddIncome from "./AddIncome";
import AddExpense from "./AddExpense";
import { collection, getDocs, query, addDoc } from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, db } from "../firebase";
import { toast } from "react-toastify";
import { CircularProgress } from "@mui/material";
import TransactionsTable from "./TransactionsTable";
import NoTransactions from "./NoTransactions";

const Dashboard = () => {
  const [isIncomeModalVisible, setIsIncomeModalVisible] = useState(false);
  const [isExpenseModalVisible, setIsExpenseModalVisible] = useState(false);
  const [balance, setBalance] = useState(0);
  const [income, setIncome] = useState(0);
  const [expense, setExpense] = useState(0);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [user] = useAuthState(auth);

  const addTransaction = async (transaction, many) => {
    if (!user) {
      toast.error("User not authenticated");
      return;
    }

    try {
      const docRef = await addDoc(
        collection(db, `users/${user.uid}/transactions`),
        transaction
      );

      console.log("✅ Transaction added:", docRef.id);
      if (!many) {
              toast.success("Transaction added successfully!");
      }

      setTransactions((prev) => [...prev, { id: docRef.id, ...transaction }]);
    } catch (error) {
      console.error("Error adding transaction:", error);
      toast.error("Could not add transaction");
    }
  };

  const fetchTransactions = async () => {
    if (!user) return;
    setLoading(true);

    try {
      const q = query(collection(db, `users/${user.uid}/transactions`));
      const querySnapshot = await getDocs(q);

      const fetchedTransactions = [];
      querySnapshot.forEach((doc) => {
        fetchedTransactions.push({ id: doc.id, ...doc.data() });
      });

      setTransactions(fetchedTransactions);
      console.log("Fetched transactions:", fetchedTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      toast.error("Failed to fetch transactions");
    }

    setLoading(false);
  };

  useEffect(() => {
    if (user) fetchTransactions();
  }, [user]);

  useEffect(() => {
    if (user) calculateBalance();
  }, [transactions]);

  const calculateBalance = () => {
    let incomeTotal = 0;
    let expenseTotal = 0;

    transactions.forEach((transaction) => {
      if (transaction.type === "income") incomeTotal += transaction.amount;
      else expenseTotal += transaction.amount;
    });

    setIncome(incomeTotal);
    setExpense(expenseTotal);
    setBalance(incomeTotal - expenseTotal);
  };

  return (
    <div className="bg-blue-50 min-h-screen">
      <Header />

      {loading ? (
        <div className="flex justify-center items-center p-6">
          <CircularProgress size={24} />
        </div>
      ) : (
        <div>
          <Cards
            handleShowIncome={() => setIsIncomeModalVisible(true)}
            handleShowExpense={() => setIsExpenseModalVisible(true)}
            income={income}
            expense={expense}
            balance={balance}
          />

          <Modal
            open={isIncomeModalVisible}
            onCancel={() => setIsIncomeModalVisible(false)}
            footer={null}
          >
            <div className="text-lg font-semibold">Income</div>
            <AddIncome
              addTransaction={addTransaction} // 👈 pass shared function
              onSuccess={() => setIsIncomeModalVisible(false)}
            />
          </Modal>

          <Modal
            open={isExpenseModalVisible}
            onCancel={() => setIsExpenseModalVisible(false)}
            footer={null}
          >
            <div className="text-lg font-semibold">Expense</div>
            <AddExpense
              addTransaction={addTransaction} // 👈 pass shared function
              onSuccess={() => setIsExpenseModalVisible(false)}
            />
          </Modal>

          {transactions.length === 0? (<NoTransactions />) : (<TransactionsTable
            transactions={transactions}
            setTransactions={setTransactions}
            addTransaction={addTransaction}
          />)}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
