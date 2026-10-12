import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Signup() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    password2: "",
  });
  const [msg, setMsg] = useState("");
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    // prevents the browsers default form - submissions behaviour so react can handle the request using fetch().
  e.preventDefault();
  setMsg("");

  try {
    const res = await fetch(`${BASE}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json();

    if (res.ok) {
      setMsg("Account created successfully. Redirecting to Login...");

      setTimeout(() => {
        nav("/login");
      }, 1200);

      return;
    }

    // this validation is automatically called by browser before sending the fetch request. So it avoids sending fetch request if data is invalid. 
    if (data.username) {
      setMsg(data.username[0]);
    } else if (data.email) {
      setMsg(data.email[0]);
    } else if (data.password) {
      setMsg(data.password[0]);
    } else if (data.password2) {
      setMsg(data.password2[0]);
    } else if (data.non_field_errors) {
      setMsg(data.non_field_errors[0]);
    } else {
      setMsg("Signup failed. Please check your details.");
    }

  } catch (error) {
    console.error(error);
    setMsg("Unable to connect to server.");
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white p-6 rounded shadow">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>
        <form onSubmit={handleSubmit} className="space-y-3" autoComplete="off">
          <input
            name="username"
            onChange={handleChange}
            value={form.username}
            placeholder="Username"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="email"
            type="email"
            onChange={handleChange}
            value={form.email}
            placeholder="Email"
            className="w-full p-2 border rounded"
          />
          <input
            name="password"
            type="password"
            onChange={handleChange}
            autoComplete="new-password"
            value={form.password}
            placeholder="Password"
            required
            className="w-full p-2 border rounded"
          />
          <input
            name="password2"
            type="password"
            onChange={handleChange}
            value={form.password2}
            placeholder="Confirm Password"
            required
            className="w-full p-2 border rounded"
          />
          <p className="text-sm text-gray-500">
            Password must be at least 8 characters and contain:
            uppercase, lowercase, number, and special character.
            Example : Karanolt@04
          </p>
          <button className="w-full bg-blue-600 text-white py-2 rounded">
            Create Account
          </button>
        </form>
        {msg && <p className="mt-3 text-sm">{msg}</p>}
      </div>
    </div>
  );
}

export default Signup;
