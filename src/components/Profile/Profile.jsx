import React, { useState, useEffect } from 'react';

import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { auth, storage } from '../../Firebase'; // Make sure you've initialized Firebase storage
import './profile.css'
import { onAuthStateChanged } from 'firebase/auth';
import { FaPlus } from 'react-icons/fa';
import { getTotalExpense } from '../../services/HomeServices/HomeServices';
import { getTotalBudget } from '../../services/HomeServices/BudgetServices';

const Profile = () => {
  const [user, setUser] = useState({});
  const [loading, setLoading] = useState(true);
  const [totalExpense, setTotalExpense] = useState(0);
  const [totalBudget, setTotalBudget] = useState(0);
  

  // console.log('auth', auth)

  useEffect(()=> {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if(user) {
        setUser({
          name : user.displayName,
          email : user.email,
          photoURL : user.photoURL || '',
        })
        setLoading(false)
      }
      else{
        setLoading(false);
      }

    })

    return () => unsubscribe();
      
  },[])

  useEffect(()=> {
    const unsubscribe = getTotalExpense(setTotalExpense);
    return () => unsubscribe();
  },[])

  useEffect(()=> {
    const unsubscribe = getTotalBudget(setTotalBudget);
    return () => unsubscribe();
  },[]);

  if(loading){
    return(
      <div className='loader'>
        <p>loading your information</p>
      </div>
    )
  }


    if(!user){
      return(
        <div className='profile-page'>
          <h2>No user signed in</h2>
        </div>
      )
    }
 
    
  
    return (
      <>
      <h2 className='header'>User Profile</h2>
      <p style={{display:'flex', justifyContent:'center'}}>page under progress</p>
      <div style={{display:'flex', flexDirection:'column'}}>
        

        <div className='profile-page'>
        <div className='profile-picture'>
          <img 
            src={user.photoURL}
            alt='profile' 
            width='200px'
            height='200px'
          />

          <label htmlFor="file-upload" className="upload-icon">
          <FaPlus />
          </label>
        </div>
        {/* {console.log('user',user.name)} */}
        <div className='profile-details'>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
        </div>
      {/* {console.log('hlo', getTotalExpense())} */}
        {/*cards section */}
        <div className='card-container'>
          <div className='card '>
            <h3>Total Expenses</h3>
            <p>₹ {totalExpense}</p>
          </div>
          <div className='card '>
            <h3>Total Budget</h3>
            <p>₹ {totalBudget}</p>
          </div>
          <div className='card '>
            <h3>Total Income</h3>
            <p>₹ </p>
          </div>
          <div className='card '>
            <h3>Total Savings</h3>
            <p>₹ </p>
          </div>
        </div>
      </div>
      </>
    )
  
}


export default Profile;
