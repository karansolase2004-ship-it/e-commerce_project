import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcontext.jsx";
import { clearTokens, getAccessToken } from "../../utils/auth.js";

function Navbar({search, setSearch}) {
  const { cartItems } = useCart();
  const navigate = useNavigate();

  const cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  const isLoggedIn = !!getAccessToken();

  const handleLoggout = () => {
    clearTokens();
    navigate("/login");
  };

  return (
    <nav className="bg-white border border-gray-500 rounded-xl shadow-md px-6 py-4 flex items-center justify-between fixed top-0 left-0 right-0 w-full z-50">
      <Link to="/" className="text-2xl font-bold text-gray-800">
        🛍️ K-Mart
      </Link>

      <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="w-80 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      />

      <div className="flex items-center gap-6">
        {/* Login/SignUp or Logout */}
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className="text-gray-800 hover:text-gray-600 font-medium"
            >
              Login
            </Link>
            <Link
              to="/signup"
              className="text-gray-800 hover:text-gray-600 font-medium"
            >
              Sign Up
            </Link>
          </>
        ) : (
          <button
            onClick={handleLoggout}
            className="text-gray-800 hover:text-gray-600 font-medium"
          >
            Logout
          </button>
        )}
      </div>

      {/* <input
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => {
          setSearch(e.target.value);
        }}
        className="w-80 px-4 py-2 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400"
      /> */}

      <Link
        to="/cart"
        className="relative text-gray-800 hover:text-gray-600 font-medium"
      >
        🛒 Cart
        {cartCount > 0 && (
          <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs font-bold rounded-full px-2">
            {cartCount}
          </span>
        )}
      </Link>
    </nav>
  );
}

export default Navbar;
