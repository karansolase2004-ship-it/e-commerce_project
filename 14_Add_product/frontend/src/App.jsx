import { Route, Routes } from "react-router-dom";
import { useEffect, useState } from "react";
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
import { useLocation } from "react-router-dom";

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
        <Route path="/" element={<Productlist search={search} />}></Route>
        <Route path="/product/:id" element={<Productdetails />}></Route>
        <Route path="/cart" element={<Cartpage />}></Route>

        <Route element={<PrivateRouter />}>
          <Route path="/checkout" element={<Checkoutpage />} />
        </Route>

        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        <Route path="/admin/dashboard" element={<Dashboard />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
      </Routes>
    </>
  );
}

export default App;
