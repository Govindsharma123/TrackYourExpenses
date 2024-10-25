// DateContext.js
import React, { createContext, useState, useEffect } from "react";
import dayjs from "dayjs";

// Create the context
export const DateContext = createContext();

// Create the provider component
export const DateProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(() => {
    const storedYear = localStorage.getItem("selectedYear");
    const storedMonth = localStorage.getItem("selectedMonth");

    return {
      year: storedYear || dayjs().format("YYYY"),
      month: storedMonth || dayjs().format("MMM"),
    };
  });

  // Sync selectedDate to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("selectedYear", selectedDate.year);
    localStorage.setItem("selectedMonth", selectedDate.month);
  }, [selectedDate]);

  return (
    <DateContext.Provider value={{ selectedDate, setSelectedDate }}>
      {children}
    </DateContext.Provider>
  );
};
