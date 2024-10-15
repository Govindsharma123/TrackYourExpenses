import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router'
import { auth, provider, signOut } from "../Firebase";
import './logout.css';
import { toast } from 'react-toastify';

const Logout = () => {
  const navigate = useNavigate();
  const [uid, setUid] = useState(null);
  const [showLogoutModal, setShowLogoutModal] = useState(false);

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
      toast.success('logged out successfully')
      localStorage.removeItem("uid");
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const confirmLogout = () => {
    setShowLogoutModal(true);
  }

  const cancelLogout = () => {
    setShowLogoutModal(false);
  }

  return (
    <div>
      {uid && 
      <button
      onClick={confirmLogout}
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
     {/* Confirmation Modal */}
     {showLogoutModal && (
            <div className="delete-modal">
              <div className="delete-modal-content">
                <h3>Confirm Logout</h3>
                <p>Are you sure you want to log out?</p>
                <div className="modal-actions">
                <button onClick={handleLogout} className="confirm-btn">Yes, Logout</button>
                <button onClick={cancelLogout} className="cancel-btn">Cancel</button>
                </div>
              </div>
            </div>
          )}
    </div>
  );
};

const modalStyles = {
  position: 'absolute',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContentStyles = {
  backgroundColor: 'white',
  padding: '20px',
  borderRadius: '8px',
  boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)',
};

const confirmButtonStyles = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#ff4d4d',
  color: 'white',
  border: 'none',
  borderRadius: '5px',
  marginRight: '10px',
};

const cancelButtonStyles = {
  padding: '10px 15px',
  fontSize: '16px',
  cursor: 'pointer',
  backgroundColor: '#ccc',
  border: 'none',
  borderRadius: '5px',
};

export default Logout
