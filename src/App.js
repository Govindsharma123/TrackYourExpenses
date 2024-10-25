import Login from "./components/Login/Login";
import { Router, Route, Routes } from "react-router";


// import Home from "./components/Home";
import HomePage from "./Pages/HomePage";
import BudgetPage from "./Pages/BudgetPage";
import ProfilePage from "./Pages/ProfilePage";
import IncomePage from "./Pages/IncomePage";
import Layout from "./components/Layout/Layout";
import LoginPage from "./Pages/LoginPage";

function App() {
  return (
    <div>
          <Routes>
            <Route path='/' element={<LoginPage/>}/>
            <Route path='/home' element = {
              <Layout>
                <HomePage/>
              </Layout>
              }/>
            <Route path='/budget' element = {
              <Layout>
                 <BudgetPage/>
              </Layout>
              }/>
            <Route path='/profile' element={
              <Layout>
                <ProfilePage/>
              </Layout>
              }/>
            <Route path='/income' element = {
              <Layout>
                <IncomePage/>
              </Layout>
              }/>
          </Routes>
      {/* </Router> */}
    </div>
  );
}

export default App;
