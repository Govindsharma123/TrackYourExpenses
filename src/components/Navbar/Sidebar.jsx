import React, { useEffect, useState } from 'react';
import { FaHome, FaTachometerAlt, FaCalendarAlt, FaThLarge, FaUser } from 'react-icons/fa';
import { TbBrandWindows } from "react-icons/tb";
import './Sidebar.css';  // Import the CSS file
import './logout.css'
import { useNavigate } from 'react-router';
import logo from './logo.jpg'
import { IoLogOutOutline } from "react-icons/io5";
import { auth, signOut } from "../../Firebase";
import { toast } from 'react-toastify';

const Sidebar = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [uid, setUid] = useState(null);
  const [name, setName] = useState(null);
  const navigate = useNavigate();  // Use the Navigate hook from react-router-dom to navigate to other pages

  useEffect(() => {
    const storedUid = localStorage.getItem("uid");
    const storedName = localStorage.getItem("Name");
    if (storedUid) {
      setUid(storedUid);
      setName(storedName);
    } else {
      navigate("/"); // Redirect to login if no uid is found
    }
  }, [navigate, setUid]);

  const toggleSidebar = () => {
    setIsExpanded(!isExpanded);
  };

  const budgethandle = () => {
    navigate('/budget');
  }

  const homehandle = () => {
    navigate('/');
  }

  const confirmLogout = () => {
    setShowLogoutModal(true);
  };

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("logged out successfully");
      localStorage.removeItem("uid");
      navigate("/"); // Redirect to login after logout
    } catch (error) {
      console.error("Error during logout", error);
    }
  };

  const cancelLogout = () => {
    setShowLogoutModal(false);
  };

  return (
    <div className={`sidebar ${isExpanded ? 'expanded' : 'collapsed'}`}>
            

      <div className="menu-items">
      {/* <div className="menu-item" onClick={homehandle}>
          <img src={logo} alt="" style={{tabSize:'10px'}}/>
          
        </div> */}
        <div className="menu-item" onClick={homehandle}>
          <FaHome />
          {isExpanded && <span>Home</span>}
        </div>
        {/* <div className="menu-item">
          <FaTachometerAlt />
          {isExpanded && <span>Dashboard</span>}
        </div> */}
        {/* <div className="menu-item">
          <FaCalendarAlt />
          {isExpanded && <span>Calendar</span>}
        </div> */}
        <div className="menu-item" onClick={budgethandle}>
          <FaThLarge />
          {isExpanded && <span>Budget</span>}
        </div>
        {/* <div className="menu-item">
          <FaUser />
          {isExpanded && <span>Profile</span>}
        </div> */}
      </div>
      {/* Footer Section */}
      <div className="sidebar-footer">
        <div className="menu-item" onClick={toggleSidebar}>
          <TbBrandWindows />
          {isExpanded && <span>Settings</span>}
        </div>
        <div className="menu-item" onClick={confirmLogout}>
          <IoLogOutOutline />
          {isExpanded && <span>Logout</span>}
        </div>
      </div>

      {/* Confirmation Modal */}
      {showLogoutModal && (
          <div className="delete-modal">
            <div className="delete-modal-content">
              <h3>Confirm Logout</h3>
              <p>Are you sure you want to log out?</p>
              <div className="modal-actions">
                <button onClick={handleLogout} className="confirm-btn">
                  Yes, Logout
                </button>
                <button onClick={cancelLogout} className="cancel-btn">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
    </div>
  );
};

export default Sidebar;
