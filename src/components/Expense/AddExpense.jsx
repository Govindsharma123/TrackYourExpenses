import React, { useState } from 'react';
import './expenseList.css'; // Assuming AddExpenseModal styles are in the same CSS file
import { saveExpense } from '../../services/HomeServices/HomeServices';
import { toast , ToastContainer} from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AddExpenseModal = ({ showModal, setShowModal, addExpense, date, setDate, detail, setDetail, amount, setAmount, category, setCategory, expenses, setExpenses, modeOfExpense, setModeOfExpense}) => {
  
    const handleSave=(e)=>{
      e.preventDefault();

    if (detail.trim() === '') {
      toast.error('Expense detail cannot be empty.');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }

if (category.trim() === '') {
  toast.error('Category cannot be empty.');
  return;
}

if (date.trim() === '') {
  toast.error('Date cannot be empty.');
  return;
}

if (modeOfExpense.trim() === ''){
  toast.error('Please select a mode of expense.');
  return;
}

        const newExpense = {
          date : date,
          detail : detail,
          amount : amount,
          category : category,
          modeOfExpense : modeOfExpense,
        }
             
          console.log('newExpense', newExpense);
          saveExpense(newExpense).then(()=>{
            setExpenses(prevExpenses => [...prevExpenses, newExpense]);
         
          toast.success('Expense added successfully')
          clearForm();
          setShowModal(false);
        }).catch((error) => {
          toast.error('Error in saving expense. Please try again later.');
        });
    }
      
        const clearForm = ()=>{
          setDate('');
          setDetail('');
          setAmount('');
          setCategory('');
          setModeOfExpense('');
        }
      
  

  const handleClose = () => {
    setShowModal(false);
    clearForm();
  };

  return (
    <div className={`modal ${showModal ? 'modal-show' : ''}`}>
      <div className="modal-content">
        <div className="modal-header">
          <h2>Add New Expense</h2>
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form >
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) =>setDate(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Category of Expense </label>
            <input
              type="text"
              name="category"
              value={category}
              onChange={(e)=>setCategory(e.target.value)}
              placeholder="e.g., Groceries"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Details</label>
            <input
              type="text"
              name="type"
              value={detail}
              onChange={(e) => setDetail(e.target.value)}
              placeholder="e.g., 2 samose"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={amount}
              onChange={(e)=>setAmount(e.target.value)}
              placeholder="e.g., 50.00"
              step="0.01"
              min="0"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Mode of Transaction</label>
            <input
              type="text"
              name="mode"
              value={modeOfExpense}
              onChange={(e) => setModeOfExpense(e.target.value)}
              placeholder="e.g., paytm"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="save-btn" onClick= {handleSave}>
              Save Expense
            </button>
            <button type="button" className="cancel-btn" onClick={handleClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddExpenseModal;
