import React, { useState } from 'react';
import './expenseList.css'; // Assuming AddExpenseModal styles are in the same CSS file

const AddExpenseModal = ({ showModal, setShowModal, addExpense }) => {
  const [expenseData, setExpenseData] = useState({
    date: '',
    type: '',
    amount: '',
  });

  const handleChange = (e) => {
    setExpenseData({
      ...expenseData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (expenseData.type.trim() === '' || expenseData.amount <= 0) {
      alert('Please enter valid expense details.');
      return;
    }
    addExpense(expenseData);
    setShowModal(false);
    setExpenseData({ date: '', type: '', amount: '' });
  };

  const handleClose = () => {
    setShowModal(false);
    setExpenseData({ date: '', type: '', amount: '' });
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

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={expenseData.date}
              onChange={handleChange}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="type">Type of Expense</label>
            <input
              type="text"
              name="type"
              value={expenseData.type}
              onChange={handleChange}
              placeholder="e.g., Groceries"
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={expenseData.amount}
              onChange={handleChange}
              placeholder="e.g., 50.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-actions">
            <button type="submit" className="save-btn">
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
