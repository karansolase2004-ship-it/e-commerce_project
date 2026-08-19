import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Productlist from './pages/Productlist';
import Productdetails from './pages/Productdetails';
import Navbar from './components/Navbar';
import Cartpage from './pages/Cartpage';
import Checkoutpage from './pages/Checkoutpage';
import PrivateRouter from './components/PrivateRouter';
import Login from './pages/Login';
import Signup from './pages/Signup';

function App(){
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Productlist/>}></Route>
        <Route path="/product/:id" element={<Productdetails/>}></Route>
        <Route path="/cart" element={<Cartpage/>}></Route>
        
        <Route element={<PrivateRouter/>}>
        <Route path="/checkout" element={<Checkoutpage/>}/>
        </Route>

        <Route path="/login" element={<Login/>}/>
        <Route path="/signup" element={<Signup/>}/>
      </Routes>
    </Router>
  )
}

export default App
