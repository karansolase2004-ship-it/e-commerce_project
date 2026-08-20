import {useState} from "react";
import {useNavigate} from "react-router-dom";
import {useCart} from "../context/Cartcontext";
import { authFetch } from "../../utils/auth";

function Checkoutpage() {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;
  const navigate = useNavigate();
  const { Clearcart } = useCart();

  const [form , setForm] = useState({
    name : "",
    address : "",
    phone : "",
    payment_method : "COD",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    setForm({
      ...form, 
      [e.target.name] : e.target.value,
    });
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    try{
      const res = await authFetch
      (`${BASEURL}/api/order/create/`, {
        method : "POST",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify(form),
      });
      const data = await res.json();

      console.log("Status:", res.status);
      console.log("Response:", data);

      if(res.ok){
        setMessage("Order Placed Successfully");
        await authFetch(`${BASEURL}/api/cart/`)
        Clearcart();
        setTimeout(() => {
          navigate("/");
        }, 2000);
      }
      else{
        // setMessage(data.error || "Failed to place order. Please try again");
          setMessage(JSON.stringify(data));
      }
    }
    catch(error)
    {
      setMessage("An error occured. Please  try Again");
    }
  }

  return(
    <div className="pt-40 p-6">
    <div className="max-w-lg mx-auto bg-white p-6 shadow rounded">
      <h1 className="text-2xl font-bold mb-4">Checkout</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input 
        type = "text"
        name="name"
        placeholder="Full Name"
        value={form.name}
        onChange={handleChange}
        required
        className="w-full border rounded-lg p-2"
        />

        <textarea 
        name="address" 
        placeholder = "Full Address"
        value = {form.address}
        onChange={handleChange}
        required
        className="w-full border rounded-lg p-2"
        />
        
        <input 
        type="tel" 
        name="phone"
        placeholder="Phone Number"
        value={form.phone}
        onChange={handleChange}
        required
        className="w-full border rounded-lg p-2"/>

        <select name="payment_method" 
        value ={form.payment_method}
        onChange={handleChange}
        className="w-full border rounded-lg p-2"
        >
        <option value="COD">Cash on Delivery</option>
        <option value="CreditCard">Online Payment</option>
        </select>
        <button 
        type="Submit"
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-600 transition duration-300">
          {loading ? "processing..." : "Place Order"}
        </button>
        {message && (
          <p className="text-center text-green-700 font-semibold mt-4">{message}</p>
        )}
      </form>
    </div>
    </div>
  )
}

export default Checkoutpage;