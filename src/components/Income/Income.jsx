import React, { useContext, useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoMdCheckmarkCircleOutline } from "react-icons/io";
import Modal from "react-modal";
import { MdOutlineCancel } from "react-icons/md";
import { getAllIncome, saveIncome } from "../../services/IncomeServices/IncomeServices";
import { toast } from "react-toastify";
import "./income.css"; // Optional: For styling if needed
import { DateContext } from "../../Context/DateContext";

// // Modal Styling (optional)
// const customModalStyles = {
//   content: {
//     top: "50%",
//     left: "50%",
//     right: "auto",
//     bottom: "auto",
//     marginRight: "-50%",
//     transform: "translate(-50%, -50%)",
//     width: "400px",
//     borderRadius: "10px",
//   },
// };

const Income = () => {
  // State to track income sources
  const [incomeSources, setIncomeSources] = useState([]);
  const [loading, setLoading] = useState(true);
  const {selectedDate} = useContext(DateContext);
  // State to track new income source inputs
  const [newSource, setNewSource] = useState("");
  const [newAmount, setNewAmount] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchIncome = async () => {
      setLoading(true);
      try {
        const incomeList = await getAllIncome(selectedDate.year , selectedDate.month);
        setIncomeSources(incomeList);
      } catch (error) {
        console.error("Error fetching income list", error);
      }
      setLoading(false);
    };
    fetchIncome();
  }, [selectedDate]);

  // Handle adding new income source
  const handleAddIncome = () => {
    const newIncome = {
      By: newSource,
      Amount: newAmount,
    };

    if (newIncome) {
      saveIncome(newIncome, selectedDate.year, selectedDate.month)
        .then(() => {
          setIncomeSources((prev) => [...prev, newIncome]);
          toast.success("New income added successfully");
          clearForm();
        })
        .catch((error) => {
          toast.error("Failed to add new income");
          console.error("Error saving income", error);
        });
      setIsModalOpen(false);
    }
  };

  const clearForm = () => {
    setNewSource("");
    setNewAmount("");
  };

  // Function to open modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close modal
  const closeModal = () => {
    setIsModalOpen(false);
    clearForm();
  };

  return (
    <div className="income-page">
      <h1>Income Sources</h1>

      {/* Display loading indicator while fetching income */}
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="income-cards">
          {/* Display existing income sources */}
          {incomeSources.length > 0 ? (
            incomeSources.map((income, id) => (
              <div key={id} className="income-card">
                <h3>{income.By}</h3>
                <p>Amount: ₹{income.Amount}</p>
              </div>
            ))
          ) : (
            <p>No income sources available.</p>
          )}

          {/* Last card with "+" button to open modal for adding new income */}
          <div className="income-card add-income-card">
            <IoMdAddCircleOutline
              onClick={openModal}
              style={{ cursor: "pointer", fontSize: "40px" }}
            />
          </div>
        </div>
      )}

      {/* Modal for adding new income */}
      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        className='income-modal'
        contentLabel="Add New Income"
        ariaHideApp={false} // Make sure it's false for testing purposes
        overlayClassName="modal-overlay"  
      >
        <h2>Add New Income</h2>
        <form className="new-income-form">
          <div className="form-group">
            <label htmlFor="newSource">Income Source</label>
            <input
              type="text"
              placeholder="Enter income source"
              name="newSource"
              value={newSource}
              onChange={(e) => setNewSource(e.target.value)}
              required
              className="input-source"
            />
          </div>

          <div className="form-group">
            <label htmlFor="newAmount">Amount</label>
            <input
              type="number"
              placeholder="Enter amount"
              name="newAmount"
              value={newAmount}
              onChange={(e) => setNewAmount(e.target.value)}
              required
              className="input-amount"
            />
          </div>

          <div className="form-actions">
            <IoMdCheckmarkCircleOutline
              onClick={handleAddIncome}
              className="save-btn"
              style={{ cursor: "pointer", fontSize: "24px", marginRight: "10px", color: 'green' }}
            />
            <MdOutlineCancel
              onClick={closeModal}
              className="cancel-btn"
              style={{ cursor: "pointer", fontSize: "24px", color: 'red' }}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Income;
