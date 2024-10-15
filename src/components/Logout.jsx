import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { auth, provider, signOut } from "../Firebase";

const Logout = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);

  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    if(storedUid){
      setUid(storedUid);
    }
    else {
      navigate("/"); // Redirect to login if no uid is found
    }
  },[navigate, setUid])


  const handleLogout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem("uid");
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  return (
    <div>
      {uid && 
      <button
      onClick={handleLogout}
      style={{
        padding: "10px 20px",
        fontSize: '16px',
        cursor:'pointer',
        backgroundColor:'#ff4d4d',
        color: 'white',
        border: "none",
        borderRadius: "5px",
      }}
      >
        Logout
      </button>}
    </div>
  )
}

export default Logout
