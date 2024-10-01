import Login from "./components/Login";
import { Route, Routes } from "react-router";
import Home from "./components/Home";
function App() {
  return (
    <div>
      

      <Routes>
        <Route path='/' element={<Login/>}/>
        <Route path='/home' element = {<Home/>}/>
      </Routes>
    </div>
  );
}

export default App;
