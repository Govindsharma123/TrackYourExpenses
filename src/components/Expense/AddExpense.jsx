import React, { useEffect, useState } from "react";
import "./expenseList.css";
import {getAllCategories,saveExpense,saveNewCategory,updateExpense} from "../../services/HomeServices/HomeServices";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import dayjs from "dayjs";

const AddExpenseModal = (props) => {
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [filteredCategories, setFilteredCategories] = useState([]);
  const [isCategoryUnique, setIsCategoryUnique] = useState(true);
  const [loadingCategories, setLoadingCategories] = useState(true); // <-- Loading state for categories
  const [editing, setEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isCategoryValid, setIsCategoryValid] = useState(false); // <-- New state to track button disable

 
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesList = await getAllCategories();
        setCategories(categoriesList);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
      finally {
        setLoadingCategories(false); // <-- Categories have been fetched
      }
    };

    if (props.showModal) fetchCategories();
  }, [props.showModal]);

  useEffect(() => {
    if (props.expenseToEdit && props.showModal && !loadingCategories) {
      // console.log('expenseToEdit', props.expenseToEdit);
      props.setDate(props.expenseToEdit.date);
      props.setDetail(props.expenseToEdit.detail);
      props.setAmount(props.expenseToEdit.amount);
      props.setModeOfExpense(props.expenseToEdit.modeOfExpense);
      setCategory(props.expenseToEdit.category);
      
      handleCategoryChange(props.expenseToEdit.category);
      

      setEditing(true);
      // clearForm();
    } else {
      clearForm();
      setEditing(false);
    }
  }, [props.expenseToEdit, loadingCategories]);

  useEffect(()=>{
    const today = dayjs().format("DD-MM-YYYY");
    props.setDate(today);
  },[props.showModal]);

  

  const handleSave = (e) => {
    e.preventDefault();
    // error toasts
    if (props.detail.trim() === "") {
      toast.error("Expense detail cannot be empty.");
      return;
    }

    if (props.amount <= 0) {
      toast.error("Amount must be greater than 0.");
      return;
    }

    if (!category || category.trim() === "") {
      toast.error("Category cannot be empty.");
      return;
    }

    if (props.date.trim() === "") {
      toast.error("Date cannot be empty.");
      return;
    }

    if (props.modeOfExpense.trim() === "") {
      toast.error("Please select a mode of expense.");
      return;
    }

    // Check if the category is unique and hasn't been saved
    if (isCategoryUnique) {
      toast.error("you have to save the category first, click on + button to save the category.");
      return;
    }

    // const existingCategory = categories.find(cat => cat.name === category);
    // if (!existingCategory) {
    //   toast.error('Category not found');
    //   return;
    // }

    // Saving the expense details in db
    const expenseData = {
      date: props.date,
      detail: props.detail,
      amount: props.amount,
      category: category, // Assuming category is now an object
      modeOfExpense: props.modeOfExpense,
    };

    // If `props.expenseToEdit` is set, update the existing expense
    if (props.expenseToEdit) {
      // console.log(props.expenseToEdit);
      // Update the existing expense in the database
      updateExpense(props.expenseToEdit.id, expenseData)
      .then(() => {
        props.setExpenses((prevExpenses) => {
          return prevExpenses.map((expense) => {
            // console.log('expense', expense);
      
            // Ensure the 'id' is preserved in the updated expense data
            if (expense.id === props.expenseToEdit.id && expense.date === props.expenseToEdit.date) {
              return { ...expense, ...expenseData };  // Preserve the original id
            }
            return expense;
          });
        });
      
        toast.success("Expense updated successfully");
        clearForm();
        props.setShowModal(false);
      })
      .catch(() => {
        toast.error("Error updating expense. Please try again later.");
      });
        //   toast.success("Expense updated successfully");
        //   clearForm();
        //   props.setShowModal(false);
        // })
        // .catch(() => {
        //   toast.error("Error updating expense. Please try again later.");
        // });
    } else {
      // Otherwise, add a new expense
      saveExpense(expenseData)
        .then(() => {
          props.setExpenses((prevExpenses) => [...prevExpenses, expenseData]);
          toast.success("Expense added successfully");
          clearForm();
          props.setShowModal(false);
        })
        .catch(() => {
          toast.error("Error saving expense. Please try again later.");
        });
    }
  };

  const clearForm = () => {
    props.setDate("");
    props.setDetail("");
    props.setAmount("");
    setCategory("");
    props.setModeOfExpense("");
  };

  // Handling category change
  const handleCategoryChange = (input) => {
    // const input = e.target.value;
    setCategory(input);

    const filtered = categories.filter(
      (cat) => cat.name && cat.name.toLowerCase().includes(input.trim().toLowerCase().trim())
    );
    setFilteredCategories(filtered);

    // Check if the entered category is unique
    const isUnique = !categories.some((cat) => cat.name.toLowerCase() === input.toLowerCase());
    setIsCategoryUnique(isUnique);

      // Set validity of category input (disable "+" button if category is invalid)
      setIsCategoryValid(input.trim().length > 0);
  };

  // Handling category selection from the suggestions
  const handleCategorySelect = (selectedCategory) => {
    setCategory(selectedCategory.name); // Set the category as the selected category's name
    setFilteredCategories([]); // Clear suggestions
    setIsCategoryUnique(false); // Since it is an existing category
  };

  const handleAddCategory = async () => {
    if(isSaving){return;}

    const trimmedCategory = category.trim();  // Trim spaces before saving

    if (trimmedCategory === "") {
      toast.error("Please enter a valid category.");
      return;
    }

    setIsSaving(true);

    try {
      const newCategory = { name: trimmedCategory };
      await saveNewCategory(newCategory);

      // Add the new category to the list and select it
    setCategories((prevCategories) => [...prevCategories, newCategory]);

    // Set the new category as selected
    setCategory(newCategory.name);

      toast.success('New category added successfully!');
      setIsCategoryUnique(false);
    } catch (error) {
      console.error("Error adding category:", error);
      toast.error("Failed to add new category.");
    } finally{
      setIsSaving(false);
    }
  };

  const handleClose = () => {
    props.setShowModal(false);
    clearForm();
  };

  return (
    <div className={`modal ${props.showModal ? "modal-show" : ""}`}>
      <div className="modal-content">
        <div className="modal-header">
          {props.expenseToEdit ? (
            <h2> Edit Expense</h2>
          ) : (
            <h2>Add New Expense</h2>
          )}
          <button className="close-btn" onClick={handleClose}>
            &times;
          </button>
        </div>

        <form>
          {/* {console.log(props.date)} */}
          <div className="form-group">
            <label htmlFor="date">Date</label>
            <input
              type="date"
              name="date"
              value={props.date}
              onChange={(e) => props.setDate(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="category">Category of Expense</label>
            <div style={{ display: "flex", position: "relative" }}>
              <input
                type="text"
                name="category"
                value={category}
                onChange={(e) => handleCategoryChange(e.target.value)}
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
                  style={{ height: "40px" }}
                  onClick={handleAddCategory}
                  type="button"
                  disabled={!isCategoryUnique} // Disable button if category input is invalid
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
              value={props.detail}
              onChange={(e) => props.setDetail(e.target.value)}
              placeholder="e.g., 2 samose"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount">Amount (₹)</label>
            <input
              type="number"
              name="amount"
              value={props.amount}
              onChange={(e) => props.setAmount(e.target.value)}
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
              value={props.modeOfExpense}
              onChange={(e) => props.setModeOfExpense(e.target.value)}
              placeholder="e.g., Paytm"
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" className="save-btn" onClick={handleSave}>
              {props.expenseToEdit ? "save changes" : "save"}
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
