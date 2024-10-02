import React, { useState } from "react";
import Home from "../components/Home";
import ExpenseList from "../components/Expense/ExpenseList";

const HomePage = () => {
  return (

    <>
     {/* <Home 
    date={date} 
    setDate={setDate} 
    detail={detail} setDetail={setDetail} 
    amount= {amount} setAmount={setAmount}
    /> */}
    <ExpenseList/>
    </>
  );
};

export default HomePage;
