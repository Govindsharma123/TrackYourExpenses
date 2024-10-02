import React, { useState } from "react";
import Home from "../components/Home";
<<<<<<< HEAD
import ExpenseList from "../components/Expense/ExpenseList";
=======
import { FaPlus } from "react-icons/fa";
import ExpenseList from "../components/ExpenseList";
>>>>>>> 3c459e68c7fcf4c7f7556e4ff0fa63b37cd17767

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
<<<<<<< HEAD
    <>
     {/* <Home 
    date={date} 
    setDate={setDate} 
    detail={detail} setDetail={setDetail} 
    amount= {amount} setAmount={setAmount}
    /> */}
    <ExpenseList/>
    </>
   
=======
    <div 
    // style={{display:'flex', justifyContent:'center', alignItems:'center', 
    // height:'100vh', }}
    >
      

      <ExpenseList />

      <button onClick={handleForm} style={{backgroundColor:'#79d9792e',height:'20px', borderRadius:'10px', cursor:'pointer', position:'relative',  marginTop:'300px', marginLeft:'1400px',}} >Add Expense</button>

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
>>>>>>> 3c459e68c7fcf4c7f7556e4ff0fa63b37cd17767
  );
};

export default HomePage;
