
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { clearTokens } from "../../utils/auth.js";

function AdminNavbar({search, setSearch }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <nav className="bg-white border-b-2 border-gray-300 shadow-md px-6 py-4 fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center justify-between gap-6">

        <Link
          to="/admin/dashboard"
          className="text-2xl font-bold text-gray-800 whitespace-nowrap"
        >
          🛍️ K-Mart Admin
        </Link>

        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2 w-56 focus:outline-none focus:ring-2 focus:ring-green-500"
        />

        <Link
          to="/admin/dashboard"
          className="text-gray-800 hover:text-green-600 font-bold whitespace-nowrap bold"
        >
          My Products
        </Link>

        <Link
          to="/admin/add-product"
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium whitespace-nowrap transition"
        >
          + Add Product
        </Link>

        <button
          onClick={handleLogout}
          className="text-gray-800 hover:text-red-600 font-medium"
        >
          Logout
        </button>

      </div>
    </nav>
  );
}

export default AdminNavbar;
