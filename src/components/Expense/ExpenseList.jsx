import React, { useState, useEffect} from 'react';
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
import { getExpenseList } from '../../services/HomeServices/HomeServices';

const ExpenseList = ({expenses, setExpenses}) => {
  
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const uid = localStorage.getItem("uid");
  const year = dayjs().format("YYYY");
  const month = dayjs().format("MMM");
  const date = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);

      try {
        const expenseList = await getExpenseList(uid);
        // console.log('expense List: ', expenseList)
        setExpenses(expenseList);
      } catch (error) {
        console.log("error in fetching expense list", error);
      }
      setLoading(false);
    };
    fetchExpenses();
  }, []);

 



  // Function to assign icons based on expense type
  const getIconForType = (detail) => {
    switch (detail.toLowerCase()) {
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
  // console.log(expenses)
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
          <p className="total-amount" style={{ color: getTotalAmountColor() }}> ₹ {Number(totalExpenses).toFixed(2)}</p> 
        </div> 
      </header>

      {/* Expense List Section */}
       <section className="expense-list">
        <h3>Recent Expenses</h3>
        <div className="expense-items">
          {/* {console.log('expenses', expenses)} */}
          {expenses.map((expense) => (
            <div className="expense-card" key={expense.id}>
              <div className="expense-icon">
                 <FontAwesomeIcon icon={getIconForType(expense.detail)} /> 
              </div>
                  <div className="expense-info">
                 <div className="expense-date">{dayjs(expense.date).format('DD MMM YYYY')}</div>
                 <div className="expense-type">{expense.detail}</div>
                 <div className="expense-amount">₹ {expense.amount}</div> 
              </div> 
            </div> 
           ))}
        </div>
      </section> 

     
    </div>
  );
};

export default ExpenseList;
