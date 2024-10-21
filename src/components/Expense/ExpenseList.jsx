import React, { useState, useEffect } from "react";
import "./expenseList.css";
import dayjs from "dayjs";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faShoppingCart,
  faLightbulb,
  faFilm,
  faCar,
  faUtensils,
  faTv,
  faHome,
  faMoneyBillWave,
  faCreditCard,
  faWallet,
  faMobileAlt,
} from "@fortawesome/free-solid-svg-icons";
import {
  deleteExpense,
  getExpenseList,
} from "../../services/HomeServices/HomeServices";
import { CiEdit } from "react-icons/ci";
import { MdDelete } from "react-icons/md";
import { toast } from "react-toastify";
import ClipLoader from "react-spinners/ClipLoader";
import { useNavigate } from "react-router";

const ExpenseList = (props) => {
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedExpense, setSelectedExpense] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const navigate = useNavigate();
  const uid = localStorage.getItem("uid");
  const name = localStorage.getItem("Name");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);

      try {
        const expenseList = await getExpenseList(uid);
        props.setExpenses(expenseList);
      } catch (error) {
        console.log("error in fetching expense list", error);
        props.setExpenses([]); // Ensure empty array in case of error
      }
      setLoading(false);
    };
    fetchExpenses();
  }, []);

  // Function to assign icons based on expense type
  const getIconForType = (category) => {
    switch (category.toLowerCase()) {
      case "groceries":
        return faShoppingCart;
      case "utilities":
        return faLightbulb;
      case "entertainment":
        return faFilm;
      case "transportation":
        return faCar;
      case "food":
        return faUtensils;
      case "subscriptions":
        return faTv;
      case "rent":
        return faHome;
      default:
        return faShoppingCart; // Default icon
    }
  };

  // Function to assign icons based on mode of expense
  const getIconForMode = (mode) => {
    switch (mode.toLowerCase()) {
      case "cash":
        return faMoneyBillWave;
      case "credit card":
        return faCreditCard;
      case "debit card":
        return faWallet;
      case "upi":
        return faMobileAlt;
      default:
        return faWallet; // Default icon for other payment modes
    }
  };

  // Calculate total expenses
  let totalExpenses = props.expenses?.reduce(
    (acc, expense) => acc + parseFloat(expense.amount) || 0,
    0
  );
  totalExpenses =
    typeof totalExpenses === "number"
      ? totalExpenses
      : parseFloat(totalExpenses) || 0;

  const getTotalAmountColor = () => {
    if (totalExpenses < 500) return "#81ecec"; // Pastel teal
    if (totalExpenses < 1000) return "#ffeaa7"; // Pastel yellow
    return "#fab1a0"; // Pastel peach
  };

  // Handle edit
  const handleEdit = (expense) => {
    props.setExpenseToEdit(expense); // Pass the selected expense to modal
    props.setShowModal(true); // Open modal
  };

  const handleDelete = (expense) => {
    setSelectedExpense(expense); // Track the selected expense for deletion
    setShowDeleteModal(true); // Show confirmation modal
  };
  const confirmDelete = async () => {
    if (selectedExpense) {
      try {
        await deleteExpense(selectedExpense.id, selectedExpense);
        toast.success("Expense deleted successfully");
        // Remove deleted expense from the list
        props.setExpenses((prevExpenses) => {
          return prevExpenses.filter(
            (expense) =>
              expense.date !== selectedExpense.date &&
              expense.id !== selectedExpense.id
          );
        });
      } catch (error) {
        console.error("Failed to delete expense:", error);
        toast.error("Error deleting expense.");
      } finally {
        setShowDeleteModal(false); // Close modal after deletion
      }
    }
  };

  const cancelDelete = () => {
    setSelectedExpense(null);
    setShowDeleteModal(false);
  };

  return (
    <div className="expense-page">
      {/* Total Expense Section */}
      <header className="total-expense">
        <div className="total-expense-card">
          <div class="floating-dollar dollar-1">₹</div>
          <div class="floating-dollar dollar-2">₹</div>
          <div class="floating-dollar dollar-3">₹</div>
          <div class="floating-dollar dollar-4">₹</div>
          {/* <h1 class="shimmer-text">Shimmering Golden Text</h1> */}
          <h2>Total Expenses</h2>
          <p className="shimmer-text"> ₹ {Number(totalExpenses).toFixed(2)}</p>
        </div>
      </header>
      {/* <button onClick={budgethandle}>
      Budget
    </button> */}

      {/* Expense List Section */}
      <section
        className="expense-list"
        // style={{ position: "relative" }}
      >
        <h3>Recent Expenses</h3>
        <div className="expense-items">
          {loading ? (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: "100px",
              }}
            >
              <ClipLoader
                color="blue"
                loading={loading}
                size={50}
                aria-label="Loading Spinner"
              />
            </div>
          ) : props.expenses.length === 0 ? (
            <p style={{ textAlign: "center", fontSize: "20px", color: "gray" }}>
              No expenses available
            </p>
          ) : (
            props.expenses.map((expense) => (
              <div className="expense-card" key={expense.id}>
                <div className="expense-icon">
                  <FontAwesomeIcon icon={getIconForType(expense.detail)} />
                </div>
                <div className="expense-info">
                  <div style={{ display: "flex" }}>
                    <div className="expense-date">
                      {dayjs(expense.date).format("DD MMM YYYY")}
                    </div>
                    <div>
                      <CiEdit
                        onClick={() => handleEdit(expense)}
                        style={{
                          cursor: "pointer",
                          marginLeft: "70px",
                          color: "green",
                        }}
                      />
                    </div>
                    <div>
                      <MdDelete
                        onClick={() => handleDelete(expense)}
                        style={{
                          cursor: "pointer",
                          marginLeft: "25px",
                          color: "red",
                        }}
                      />
                    </div>
                  </div>
                  <div className="expense-type">{expense.detail}</div>
                  <div className="expense-amount">₹ {expense.amount}</div>
                  <div style={{ display: "flex" }}>
                    <div className="expense-category"> {expense.category}</div>
                    <div
                      className="expense-mode"
                      style={{ marginLeft: "80px" }}
                    >
                      <FontAwesomeIcon
                        icon={getIconForMode(expense.modeOfExpense)}
                      />{" "}
                      {expense.modeOfExpense}
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {showDeleteModal && (
        <div className="delete-modal">
          <div className="delete-modal-content">
            <h3>Confirmation !</h3>
            <h4>Are you sure, you want to delete this expense ?</h4>
            <div className="modal-actions">
              <button onClick={confirmDelete} className="confirm-btn">
                Delete
              </button>
              <button onClick={cancelDelete} className="cancel-btn">
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExpenseList;
