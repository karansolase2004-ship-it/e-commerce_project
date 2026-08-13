import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Productlist from './pages/Productlist';
import Productdetails from './pages/Productdetails';
import Navbar from './components/Navbar';
import Cartpage from './pages/Cartpage';
import Checkoutpage from './pages/Checkoutpage';

function App(){
  return (
    <Router>
      <Navbar/>
      <Routes>
        <Route path="/" element={<Productlist/>}></Route>
        <Route path="/product/:id" element={<Productdetails/>}></Route>
        <Route path="/cart" element={<Cartpage/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
