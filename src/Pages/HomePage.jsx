import React, { useState } from "react";
// import Home from "../components/Home";
import ExpenseList from "../components/Expense/ExpenseList";
import AddExpenseModal from "../components/Expense/AddExpense";

const HomePage = () => {
  const [date, setDate ] = useState('');
  const [detail, setDetail ] = useState('');
  const [amount, setAmount ] = useState('');
  const [category, setCategory ] = useState('');
  const [showModal,   setShowModal] = useState(false);
  const [expenses, setExpenses] = useState([]);

  return (

    <>
     

      {showModal && (
        <AddExpenseModal 
        date={date} 
        setDate={setDate} 
        detail={detail} setDetail={setDetail} 
        amount= {amount} setAmount={setAmount}
        category={category} setCategory={setCategory}
        expenses={expenses} setExpenses={setExpenses}
        showModal={showModal}
        setShowModal={setShowModal}
        // addExpense={handleAddExpense}
        />
      )}

    <ExpenseList
    expenses={expenses} setExpenses={setExpenses}
     />

    <button className="add-expense-btn" onClick={() => setShowModal(true)}>
      + Add Expense
    </button>

    </>
  );
};

export default HomePage;
