
import { Navigate, Route, Routes, useLocation } from "react-router-dom";
import { useState } from "react";

import Productlist from "./user/pages/Productlist";
import Productdetails from "./user/pages/Productdetails";
import Navbar from "./user/components/Navbar";
import Cartpage from "./user/pages/Cartpage";
import Checkoutpage from "./user/pages/Checkoutpage";
import PrivateRouter from "./user/components/PrivateRouter";
import Login from "./user/pages/Login";
import Signup from "./user/pages/Signup";

import Dashboard from "./admin/pages/Dashboard";
import AddProduct from "./admin/pages/AddProduct";
import EditProduct from "./admin/pages/EditProduct";

function App() {
  const [search, setSearch] = useState("");
  const location = useLocation();

  const hideNavbar =
    location.pathname === "/login" ||
    location.pathname === "/signup" ||
    location.pathname.startsWith("/admin");

  return (
    <>
      {!hideNavbar && <Navbar search={search} setSearch={setSearch} />}

      <Routes>
        <Route
          path="/"
          element={<Productlist search={search} />}
        />

        <Route path="/product/:id" element={<Productdetails />} />
        <Route path="/cart" element={<Cartpage />} />

        <Route element={<PrivateRouter />}>
          <Route path="/checkout" element={<Checkoutpage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route element={<PrivateRouter adminOnly />}>
          <Route path="/admin/dashboard" element={<Dashboard />} />
          <Route path="/admin/add-product" element={<AddProduct />} />
          <Route path="/admin/edit-product/:id" element={<EditProduct />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;

