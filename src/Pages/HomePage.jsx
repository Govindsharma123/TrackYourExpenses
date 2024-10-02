import React, { useState } from "react";
import Home from "../components/Home";
import { FaPlus } from "react-icons/fa";
import ExpenseList from "../components/ExpenseList";

const HomePage = () => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [date, setDate] = useState("");
  const [detail, setDetail] = useState("");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");

  const handleForm = () => {
    setIsFormOpen(true);
  };

  return (
    <div style={{display:'flex', justifyContent:'center', alignItems:'center', 
    height:'100vh', }}>
      

      <ExpenseList />

      <FaPlus onClick={handleForm} style={{backgroundColor:'blue', height:'50px', width:'50px', borderRadius:'10px', cursor:'pointer', position:'relative', marginTop:'500px'}}/>

      {isFormOpen &&
      <Home 
      date={date} 
      setDate={setDate} 
      detail={detail} setDetail={setDetail} 
      amount= {amount} setAmount={setAmount}
      category={category} setCategory={setCategory}  
      />
      
      }

       {isFormOpen && 
       <button 
       onClick={()=>setIsFormOpen(false)}
       style={{marginTop:'20px', backgroundColor:'red', height:'50px', width:'100px', borderRadius:'10px', cursor:'pointer'}}
       >
         Close
       </button>}
       
       
    </div>
  );
};

export default HomePage;
