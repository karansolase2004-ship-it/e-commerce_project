import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Productlist from '../pages/Productlist';
import Productdetails from '../pages/Productdetails';

function App(){
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Productlist/>}></Route>
        <Route path="/product/:id" element={<Productdetails/>}></Route>
      </Routes>
    </Router>
  )
}

export default App
