// Buttons.js
import React, { useContext, useState } from "react";
import { FaCalendarAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { DateContext } from "../../Context/DateContext"; // Import the context
import "./buttons.css";
import dayjs from "dayjs";

const Buttons = () => {
  const { selectedDate, setSelectedDate } = useContext(DateContext); // Access context
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);

  // Open calendar modal
  const opencalender = () => {
    setIsCalendarOpen(true);
  };

  // Close calendar modal
  const closeCalendar = () => {
    setIsCalendarOpen(false);
  };

  // Handle year change
  const changeYear = (direction) => {
    const currentYear = parseInt(selectedDate.year);
    const newYear = direction === "forward" ? currentYear + 1 : currentYear - 1;
    setSelectedDate((prev) => ({ ...prev, year: newYear.toString() }));
  };

  // Handle month selection
  const handleMonthSelect = (month) => {
    setSelectedDate((prev) => ({ ...prev, month }));
    closeCalendar(); // Close the modal after selecting the month
  };

  // Array of months
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec",
  ];

  return (
    <div>
      {/* Display currently selected date */}
      <div><h3>{selectedDate.month} {selectedDate.year}</h3></div>

      <div className="calendar-icon" onClick={opencalender}>
        <FaCalendarAlt />
      </div>

      {isCalendarOpen && (
        <div className="calendar-modal">
          <div className="modal-header">
            <button onClick={closeCalendar} className="close-btn">
              <RxCross2 />
            </button>
          </div>
          <div className="modal-content">
            <div className="year-navigation">
              <button
                onClick={() => changeYear("backward")}
                className="year-btn"
              >
                {"<"}
              </button>
              <span className="selected-year">{selectedDate.year}</span>
              <button
                onClick={() => changeYear("forward")}
                className="year-btn"
              >
                {">"}
              </button>
            </div>
            <div className="months-grid">
              {months.map((month) => (
                <button
                  key={month}
                  onClick={() => handleMonthSelect(month)}
                  className={`month-btn ${
                    selectedDate.month === month ? "selected" : ""
                  }`}
                >
                  {month}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Buttons;
