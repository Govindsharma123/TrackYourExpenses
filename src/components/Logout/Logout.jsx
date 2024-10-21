// import React, { useEffect, useState } from "react";
// import { useNavigate } from "react-router";
// import { auth, signOut } from "../../Firebase";
// import "../Logout/logout.css";
// import { toast } from "react-toastify";

// const Logout = () => {
//   const navigate = useNavigate();
//   const [uid, setUid] = useState(null);
//   const [showLogoutModal, setShowLogoutModal] = useState(false);
//   const [name, setName] = useState(null);

//   useEffect(() => {
//     const storedUid = localStorage.getItem("uid");
//     const storedName = localStorage.getItem("Name");
//     if (storedUid) {
//       setUid(storedUid);
//       setName(storedName);
//     } else {
//       navigate("/"); // Redirect to login if no uid is found
//     }
//   }, [navigate, setUid]);

//   const handleLogout = async () => {
//     try {
//       await signOut(auth);
//       toast.success("logged out successfully");
//       localStorage.removeItem("uid");
//       navigate("/"); // Redirect to login after logout
//     } catch (error) {
//       console.error("Error during logout", error);
//     }
//   };

//   const confirmLogout = () => {
//     setShowLogoutModal(true);
//   };

//   const cancelLogout = () => {
//     setShowLogoutModal(false);
//   };

//   return (
//     <>
//       <div className="header">
//         {uid && (
//           <div className="user-info">
//             {/* <h2 className="greeting">Hi, {name}!</h2> */}
//             <button className="logout-btn" onClick={confirmLogout}>
//               Logout
//             </button>
//           </div>
//         )}
//         {/* Confirmation Modal */}
//         {showLogoutModal && (
//           <div className="delete-modal">
//             <div className="delete-modal-content">
//               <h3>Confirm Logout</h3>
//               <p>Are you sure you want to log out?</p>
//               <div className="modal-actions">
//                 <button onClick={handleLogout} className="confirm-btn">
//                   Yes, Logout
//                 </button>
//                 <button onClick={cancelLogout} className="cancel-btn">
//                   Cancel
//                 </button>
//               </div>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// export default Logout;
