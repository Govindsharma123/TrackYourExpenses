import React from 'react';
import { saveExpense } from "../services/HomeServices/HomeServices";

const Home = (props) => {
  // console.log("props", props);

  const handleSave=()=>{
    const newExpense = {
      date : props.date,
      detail : props.detail,
      amount : props.amount
    }
    console.log('newExpense', newExpense);
    saveExpense(newExpense);
    clearForm();
  }

  const clearForm = ()=>{
    props.setDate('');
    props.setDetail('');
    props.setAmount('');
  }

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        height: "100vh",
        alignItems: "center",
        flexDirection: "column",
      }}
    >
      <h1>Track your Expenses here</h1>
      <form action="" style={{ display: "flex", flexDirection: "column" }}>
        <input 
          type="date" 
          style={{ marginBottom: "10px" }}
          value={props.date}
          onChange={(e)=>props.setDate(e.target.value)} 
        />
        <input
          type="text"
          placeholder="Enter Details"
          style={{ marginBottom: "10px" }}
          value={props.detail}
          onChange={(e)=>props.setDetail(e.target.value)}
        />
        <input
          type="number"
          placeholder="Enter Amount"
          style={{ marginBottom: "10px" }}
          value={props.amount}
          onChange={(e)=>props.setAmount(e.target.value)}
        />

        <button type='button' onClick={handleSave}>Add Expense</button>
      </form>
    </div>
  );
};

export default Home;
