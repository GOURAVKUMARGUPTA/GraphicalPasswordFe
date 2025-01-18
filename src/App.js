import React from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";


// COMPONENTS
import Navbar from "./components/Navbar";
import Signup from "./Signup";
import Login from "./Login";


const App = () => {

  const toastFunction = (message, type) => {
    if (type === 0) {
      toast.error(message, { theme: "dark" })
    } else if (type === 1) {
      toast.success(message, { theme: "dark" });
    }
  }

  return (
    <>
      <ToastContainer />
      <Navbar />
      <BrowserRouter>
        <Routes>
          <Route path="/signup" element={ <Signup toastFunction={toastFunction}/> } />
          <Route path="/login" element={ <Login toastFunction={toastFunction}/> } />
          <Route path="*" element={ <div>No page</div> } />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;