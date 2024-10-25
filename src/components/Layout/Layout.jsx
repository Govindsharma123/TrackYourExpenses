import React from 'react'
import Sidebar from '../Navbar/Sidebar'
import Buttons from '../Buttons/Buttons'
import './layout.css'


const Layout = ({children}) => {
  return (
    <div className="layout-container">
      
      <div className="sidebar">
      <Sidebar/>
      </div>

      {/* main content area */}
      <div  className="main-content">
      <div className="buttons-container">
          <Buttons />
        </div>
       {/* Page content */}
       <div>
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;