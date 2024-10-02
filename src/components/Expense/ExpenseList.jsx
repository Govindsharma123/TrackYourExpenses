import React, { useState } from 'react';
import './expenseList.css';
import dayjs from 'dayjs';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingCart,
  faLightbulb,
  faFilm,
  faCar,
  faUtensils,
  faTv,
  faHome,
} from '@fortawesome/free-solid-svg-icons';
import AddExpenseModal from './AddExpense';

const ExpenseList = () => {
  const [expenses, setExpenses] = useState([
    {
      id: 1,
      date: "2024-09-28",
      type: "Groceries",
      amount: 150.75,
      icon: faShoppingCart,
    },
    {
      id: 2,
      date: "2024-09-29",
      type: "Utilities",
      amount: 90.50,
      icon: faLightbulb,
    },
    {
      id: 3,
      date: "2024-09-30",
      type: "Entertainment",
      amount: 45.00,
      icon: faFilm,
    },
    {
      id: 4,
      date: "2024-10-01",
      type: "Transportation",
      amount: 30.00,
      icon: faCar,
    },
    {
      id: 5,
      date: "2024-10-02",
      type: "Dining Out",
      amount: 60.20,
      icon: faUtensils,
    },
    {
      id: 6,
      date: "2024-10-02",
      type: "Subscriptions",
      amount: 12.99,
      icon: faTv,
    },
    {
      id: 7,
      date: "2024-10-03",
      type: "Rent",
      amount: 1200.00,
      icon: faHome,
    },
  ]);

  const [showModal, setShowModal] = useState(false);

  const handleAddExpense = (expenseData) => {
    const newExpense = {
      ...expenseData,
      id: expenses.length + 1,
      icon: getIconForType(expenseData.type),
    };
    setExpenses([...expenses, newExpense]);
  };

  // Function to assign icons based on expense type
  const getIconForType = (type) => {
    switch (type.toLowerCase()) {
      case 'groceries':
        return faShoppingCart;
      case 'utilities':
        return faLightbulb;
      case 'entertainment':
        return faFilm;
      case 'transportation':
        return faCar;
      case 'dining out':
        return faUtensils;
      case 'subscriptions':
        return faTv;
      case 'rent':
        return faHome;
      default:
        return faShoppingCart; // Default icon
    }
  };

  // Calculate total expenses
  let totalExpenses = expenses.reduce((acc, expense) => acc + parseFloat(expense.amount) || 0, 0);
  totalExpenses = typeof totalExpenses === 'number' ? totalExpenses : parseFloat(totalExpenses) || 0;

  const getTotalAmountColor = () => {
    if (totalExpenses < 500) return '#81ecec'; // Pastel teal
    if (totalExpenses < 1000) return '#ffeaa7'; // Pastel yellow
    return '#fab1a0'; // Pastel peach
  };
  return (
    <div className="expense-page">
      {/* Total Expense Section */}
      <header className="total-expense">
        <div className="total-expense-card">
          <h2>Total Expenses</h2>
          <p className="total-amount" style={{ color: getTotalAmountColor() }}> ₹ {Number(totalExpenses).toFixed(2)}</p> {/* Dynamic styling for color */}
        </div>
      </header>

      {/* Expense List Section */}
      <section className="expense-list">
        <h3>Recent Expenses</h3>
        <div className="expense-items">
          {expenses.map(expense => (
            <div className="expense-card" key={expense.id}>
              <div className="expense-icon">
                <FontAwesomeIcon icon={expense.icon} />
              </div>
              <div className="expense-info">
                <div className="expense-date">{dayjs(expense.date).format('DD MMM YYYY')}</div>
                <div className="expense-type">{expense.type}</div>
                <div className="expense-amount">₹ {expense.amount}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Add Expense Button */}
      <button className="add-expense-btn" onClick={() => setShowModal(true)}>
        + Add Expense
      </button>

      {/* Add Expense Modal */}
      {showModal && (
        <AddExpenseModal
          showModal={showModal}
          setShowModal={setShowModal}
          addExpense={handleAddExpense}
        />
      )}
    </div>
  );
};

export default ExpenseList;
