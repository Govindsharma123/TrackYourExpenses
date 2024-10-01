import React, { useState } from "react";
import Home from "../components/Home";

const HomePage = () => {
  const [date, setDate] = useState("");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");

  return (
    <Home 
    date={date} 
    setDate={setDate} 
    detail={detail} setDetail={setDetail} 
    amount= {amount} setAmount={setAmount}
    />
  );
};

export default HomePage;
