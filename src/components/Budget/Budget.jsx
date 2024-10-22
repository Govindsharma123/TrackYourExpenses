import React, { useState, useEffect } from "react";
import { getAllCategories } from "../../services/HomeServices/HomeServices"; // Example service functions
import { fetchBudget, getBudget, saveBudget, updateBudget } from "../../services/HomeServices/BudgetServices";
import "./Budget.css"; // Import CSS for styling
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import { CiEdit } from "react-icons/ci";
import Sidebar from "../Navbar/Sidebar";
import dayjs from "dayjs";

const Budget = () => {
  const currentDate = new Date();
  const [categories, setCategories] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [savedBudgets, setSavedBudgets] = useState({}); // Track saved budgets
  const [month, setMonth] = useState(dayjs().format('MMM'));
  const [year, setYear] =  useState(dayjs().format('YYYY'));;
  const [editingCategory, setEditingCategory] = useState(null);

  // console.log(year, month)
  const months = [
    { value: "Jan", label: "January" },
    { value: "Feb", label: "February" },
    { value: "Mar", label: "March" },
    { value: "Apr", label: "April" },
    { value: "May", label: "May" },
    { value: "Jun", label: "June" },
    { value: "Jul", label: "July" },
    { value: "Aug", label: "August" },
    { value: "Sep", label: "September" },
    { value: "Oct", label: "October" },
    { value: "Nov", label: "November" },
    { value: "Dec", label: "December" },
  ];
  
  const currentYear = new Date().getFullYear();
  const yearRange = Array.from(new Array(10), (v, i) => currentYear - i);

  useEffect(() => {
    getAllCategories().then((categories) => setCategories(categories));
    fetchBudget(year,month);
  },[year, month])

  const fetchBudget = (selectedYear, selectedMonth) => {
    getBudget(selectedYear, selectedMonth)
      .then((budgetArray) => {
        // Map the array of objects into a savedBudgets object with keys as category ids
        const formattedBudgets = budgetArray.reduce((acc, item) => {
          acc[item.id] = item.budget; // Assuming the object structure is { id: categoryKey, budget: amount }
          return acc;
        }, {});
        setSavedBudgets(formattedBudgets);
      })
      .catch((error) =>
        console.log(`Error while fetching budget: ${error}`)
      );
  };

  const handleBudgetChange = (categoryKey, value) => {
    setBudgets((prevBudgets) => ({
      ...prevBudgets,
      [categoryKey]: value,
    }));
  };

  const handleSubmit = (categoryKey) => {
   
      const budgetAmount = budgets[categoryKey];
      if (budgetAmount > 0) {
        saveBudget(year, month,  categoryKey, budgetAmount)
          .then(() => {
            console.log(`Budget for category ${categoryKey} saved`);
            setSavedBudgets((prev) => ({
              ...prev,
              [categoryKey]: budgetAmount, // Save the budget amount
            }));
            setBudgets((prev) => ({
              ...prev,
              [categoryKey]: "", // Clear the input field after saving
            }));
          })
          .catch((error) => console.error("Error saving budget", error));
      }
    
  };

 // Calculate total budget
 const totalBudget = Object.values(savedBudgets).reduce((acc, amount) => acc + Number(amount), 0);
  const getTotalAmountColor = () => {
    if (totalBudget < 500) return "#81ecec"; // Pastel teal
    if (totalBudget < 1000) return "#ffeaa7"; // Pastel yellow
    return "#fab1a0"; // Pastel peach
  };

  const handleEdit = (categoryKey) => {
    console.log(categoryKey)
    setEditingCategory(categoryKey); // Set the category to be edited
    setBudgets((prev) => ({
      ...prev,
      [categoryKey]: savedBudgets[categoryKey], // Autofill the saved budget
    }));
  };

const handleUpdateBudget = (categoryKey) => {
  const budgetAmount = budgets[categoryKey];

  if(budgetAmount > 0){
    updateBudget(year, month, categoryKey, budgetAmount)
     .then(() => {
       console.log(`Budget for category ${categoryKey} updated`);
       setSavedBudgets((prev) => ({
         ...prev,
         [categoryKey]: budgetAmount, // Update the saved budgets object
       }));
       setEditingCategory(null); // Reset editing category
       setBudgets((prev) => ({
         ...prev,
         [categoryKey]: "", // Clear the input field after updating
       }));
      
     })
     .catch((error) => console.error("Error updating budget", error));
  }
}


// Get the label of the selected month
const getMonthLabel = (monthValue) => {
  const selectedMonth = months.find((m) => m.value === monthValue);
  return selectedMonth ? selectedMonth.label : "";
};

  return (
    <div className="budget-page">
      {/* <Sidebar/> */}
      <h1>Set Monthly Budget for Categories</h1>

      <header className="total-expense">
        <div className="total-expense-card">
          <h2>Budget for {getMonthLabel(month)} {year} </h2>
          <p className="total-amount" style={{ color: getTotalAmountColor() }}>
            {" "}
            ₹ {Number(totalBudget).toFixed(2)}
          </p>
        </div>
      </header>

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
      <form className="budget-form" >
        <div className="category-budget-cards">
          {categories.map((category, index) => (
            <div className="category-budget-card" key={index + 1}>
              {/* {console.log('categories', categories)} */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 className="category-name" style={{ margin: '0', flexGrow: 1, textAlign: 'center' }}>{category.name}</h2>
                {/* {console.log(category)} */}
                <CiEdit style={{ marginLeft: '20px' }} onClick={()=>handleEdit(category.id)} className="save-button" />
              </div>
              <br />
              {editingCategory === category.id ? (
                <div className='save-button' style={{display:'flex', fontSize:'20px', alignItems:'center'}}>
                  <input
                    type="number"
                    value={budgets[category.id] || ""}
                    onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                    placeholder="Enter budget"
                    className="budget-input"
                    min="0"
                  />
                  <IoMdCheckmarkCircleOutline
                    onClick={() => handleUpdateBudget(category.id)} // Handle budget update
                    style={{ cursor: 'pointer' }}
                  />
                </div>
              ) : (
                <>
                  {savedBudgets[index + 1] !== undefined ? (
                    <div className="saved-budget-amount">
                      <span>Budget: ₹{savedBudgets[category.id]}</span>
                    </div>
                  ) : (
                    <div style={{display:'flex', fontSize:'20px', alignItems:'center'}} className="save-button">
                    <input
                      type="number"
                      value={budgets[category.id] || ""}
                      onChange={(e) => handleBudgetChange(category.id, e.target.value)}
                      placeholder="Enter budget"
                      className="budget-input"
                      min="0"
                  />
                  <IoMdCheckmarkCircleOutline
                    onClick={() => handleSubmit(category.id)} // Handle budget update
                    style={{ cursor: 'pointer' }}
                  />
                  </div>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </form>
    </div>
  );
};

export default Budget;
