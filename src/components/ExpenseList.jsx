import React, { useEffect, useState } from "react";
import { getExpenseList } from "../services/HomeServices/HomeServices";
import dayjs from "dayjs";

const ExpenseList = () => {
  const [expenses, setExpenses] = useState("");
  const [loading, setLoading] = useState(true);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const uid = localStorage.getItem("uid");
  const year = dayjs().format("YYYY");
  const month = dayjs().format("MMM");
  const date = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    const fetchExpenses = async () => {
      setLoading(true);

      try {
        const expenseList = await getExpenseList(uid);
        setExpenses(expenseList);
      } catch (error) {
        console.log("error in fetching expense list", error);
      }
      setLoading(false);
    };
    fetchExpenses();
  }, []);
  // console.log(expenses)

  return (
    <div>
      <h1>Your Recent Expenses</h1>
      {console.log("list", expenses)}
      {loading ? (
        <p>Loading...</p>
      ) : expenses.length > 0 ? (
        <ul>
          {expenses.map((expense) => 
            (<li key={expense.id}>
              <strong>Date:</strong> {expense.date} <br />
              <strong>Detail:</strong> {expense.detail} <br />
              <strong>Amount:</strong> {expense.amount} <br />
              <strong>Category:</strong> {expense.category} <br />
              <br />
            </li>)
          )}
        </ul>
      ) : (
        <p>No expenses found </p>
      )}
    </div>
  );
};

export default ExpenseList;
