import React, { useState, useEffect } from 'react';
import { getAllCategories } from '../../services/HomeServices/HomeServices'; // Example service functions
import { saveBudget } from '../../services/HomeServices/BudgetServices';
import './Budget.css'; // Import CSS for styling

const BudgetPage = () => {
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [savedBudgets, setSavedBudgets] = useState({}); // Track saved budgets
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');

  const months = [
    { value: '01', label: 'January' },
    { value: '02', label: 'February' },
    { value: '03', label: 'March' },
    { value: '04', label: 'April' },
    { value: '05', label: 'May' },
    { value: '06', label: 'June' },
    { value: '07', label: 'July' },
    { value: '08', label: 'August' },
    { value: '09', label: 'September' },
    { value: '10', label: 'October' },
    { value: '11', label: 'November' },
    { value: '12', label: 'December' },
  ];

  const currentYear = new Date().getFullYear();
  const yearRange = Array.from(new Array(10), (v, i) => currentYear - i);

  useEffect(() => {
    const currentDate = new Date();
    setMonth(String(currentDate.getMonth() + 1).padStart(2, '0'));
    setYear(String(currentDate.getFullYear()));

    getAllCategories().then((categories) => setCategories(categories));
  }, []);

  const handleBudgetChange = (categoryKey, value) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [categoryKey]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Object.keys(budgets).forEach((categoryKey) => {
      const budgetAmount = budgets[categoryKey];
      if (budgetAmount > 0) {
        saveBudget(year, month, categoryKey, budgetAmount)
          .then(() => {
            console.log(`Budget for category ${categoryKey} saved`);
            setSavedBudgets((prev) => ({
              ...prev,
              [categoryKey]: budgetAmount, // Save the budget amount
            }));
            setBudgets((prev) => ({
              ...prev,
              [categoryKey]: '', // Clear the input field after saving
            }));
          })
          .catch((error) => console.error('Error saving budget', error));
      }
    });
  };

  return (
    <div className="budget-page">
      <h1>Set Monthly Budget for Categories</h1>

      {/* Month and Year Dropdowns */}
      <div className="budget-date">
        <label htmlFor="month">Month:</label>
        <select
          id="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="input-date"
        >
          {months.map((m) => (
            <option key={m.value} value={m.value}>
              {m.label}
            </option>
          ))}
        </select>

        <label htmlFor="year">Year:</label>
        <select
          id="year"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          className="input-date"
        >
          {yearRange.map((yr) => (
            <option key={yr} value={yr}>
              {yr}
            </option>
          ))}
        </select>
      </div>

      {/* Cards for each category */}
      <form className="budget-form" onSubmit={handleSubmit}>
        <div className="category-budget-cards">
          {categories.map((category, index) => (
            <div className="category-budget-card" key={index + 1}>
              <h2 className="category-name">{category.name}</h2>
              {savedBudgets[index + 1] !== undefined ? (
                <div className="saved-budget-amount">
                  <span>Budget: ${savedBudgets[index + 1]}</span>
                </div>
              ) : (
                <input
                  type="number"
                  value={budgets[index + 1] || ''}
                  onChange={(e) => handleBudgetChange(index + 1, e.target.value)}
                  placeholder="Enter budget"
                  className="budget-input"
                  min="0"
                />
              )}
            </div>
          ))}
        </div>

        <button type="submit" className="save-button">Save Budgets</button>
      </form>
    </div>
  );
};

export default BudgetPage;
