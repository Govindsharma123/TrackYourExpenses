import React, { useEffect, useState } from 'react';
import './expenseList.css';
import { getAllCategories, saveExpense, saveNewCategory } from '../../services/HomeServices/HomeServices';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const AddExpenseModal = ({
  showModal,
  setShowModal,
  addExpense,
  date,
  setDate,
  detail,
  setDetail,
  amount,
  setAmount,
  expenses,
  setExpenses,
  modeOfExpense,
  setModeOfExpense
}) => {
  const [category, setCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isCategoryUnique, setIsCategoryUnique] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await getAllCategories();
        setCategories(categoriesList);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    if (showModal) fetchCategories();
  }, [showModal]);

  const handleSave = (e) => {
    e.preventDefault();
    // error toasts
    if (detail.trim() === '') {
      toast.error('Expense detail cannot be empty.');
      return;
    }

    if (amount <= 0) {
      toast.error('Amount must be greater than 0.');
      return;
    }

    if (!category || category.trim() === '') {
      toast.error('Category cannot be empty.');
      return;
    }

    if (date.trim() === '') {
      toast.error('Date cannot be empty.');
      return;
    }

    if (modeOfExpense.trim() === '') {
      toast.error('Please select a mode of expense.');
      return;
    }

    // Check if the category is unique and hasn't been saved
  if (isCategoryUnique) {
    toast.error('You must save the new category before adding the expense.');
    return;
  }
  
    // Saving the expense details in db
    const newExpense = {
      date: date,
      detail: detail,
      amount: amount,
      category: category, // Assuming category is now an object
      modeOfExpense: modeOfExpense,
    };

    saveExpense(newExpense)
      .then(() => {
        setExpenses((prevExpenses) => [...prevExpenses, newExpense]);

        toast.success('Expense added successfully');
        clearForm();
        setShowModal(false);
      })
      .catch(() => {
        toast.error('Error in saving expense. Please try again later.');
      });
  };

  const clearForm = () => {
    setDate('');
    setDetail('');
    setAmount('');
    setCategory('');
    setModeOfExpense('');
  };

  // Handling category change
  const handleCategoryChange = (e) => {
    const input = e.target.value;
    setCategory(input);

    const filtered = categories.filter((cat) =>
      cat.name && cat.name.toLowerCase().includes(input.toLowerCase())
    );
    setFilteredCategories(filtered);

    // Check if the entered category is unique
    const isUnique = !categories.some((cat) => cat.name.toLowerCase() === input.toLowerCase());
    setIsCategoryUnique(isUnique);
  };

  // Handling category selection from the suggestions
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory.name); // Set the category as the selected category's name
    setFilteredCategories([]); // Clear suggestions
    setIsCategoryUnique(false); // Since it is an existing category
  };

  const handleAddCategory = async () => {
    if (category.trim() === '') {
      toast.error('Please enter a valid category.');
      return;
    }

    try {
      const newCategory = {
        name: category,
      };
      await saveNewCategory(newCategory);
      setCategories((prevCategories) => [...prevCategories, newCategory]);
      // setCategory('');
      
      // toast.success('New category added successfully!');
      // isCategoryUnique(false);
    } catch (error) {
      console.error('Error adding category:', error);
      toast.error('Failed to add new category.');
    }
  };

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

        <form>
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category of Expense</label>
            <div style={{ display: 'flex', position: 'relative' }}>
              <input
                type="text"
                name="category"
                value={category}
                onChange={handleCategoryChange}
                placeholder="e.g., Groceries"
                required
                autoComplete="off"
              />

              {filteredCategories.length > 0 && (
                <ul className="category-suggestions">
                  {filteredCategories.map((cat, i) => (
                    <li key={i} onClick={() => handleCategorySelect(cat)}>
                      {cat.name}
                    </li>
                  ))}
                </ul>
              )}

              {isCategoryUnique && category.trim() && (
                <button
                  style={{ height: '40px' }}
                  onClick={handleAddCategory}
                  type="button"
                >
                  +
                </button>
              )}
            </div>
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
              onChange={(e) => setAmount(e.target.value)}
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
              placeholder="e.g., Paytm"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="save-btn" onClick={handleSave}>
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
