import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getAccessToken } from "../../utils/auth";

function EditProduct() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

  const { id } = useParams();
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);

  const [form, setForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    image: null,
  });

  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchCategories();
    fetchProduct();
  }, []);

  async function fetchCategories() {
    try {
      const response = await fetch(`${BASE}/api/categories/`);
      const data = await response.json();

      if (response.ok) {
        setCategories(data);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function fetchProduct() {
    try {
      const response = await fetch(`${BASE}/api/products/${id}/`);
      const data = await response.json();

      if (response.ok) {
        setForm({
          name: data.name,
          category: data.category.id,
          description: data.description,
          price: data.price,
          image: null,
        });
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChange(e) {
    const { name, value, files } = e.target;

    if (name === "image") {
      setForm({
        ...form,
        image: files[0],
      });
    } else {
      setForm({
        ...form,
        [name]: value,
      });
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const formData = new FormData();

    formData.append("name", form.name);
    formData.append("category", form.category);
    formData.append("description", form.description);
    formData.append("price", form.price);

    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      const response = await fetch(`${BASE}/api/admin/products/${id}/`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        navigate("/admin/dashboard");
      } else {
        console.log(data);
        setMsg("Failed to update product.");
      }
    } catch (error) {
      console.log(error);
      setMsg("Something went wrong.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Edit Product</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        >
          <option value="">Select Category</option>

          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border p-2 rounded"
        />

        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          className="w-full border p-2 rounded"
          required
        />

        <div>
          <label className="block mb-2 font-medium text-gray-700">
            Product Image
          </label>

          <label
            htmlFor="image"
            className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-green-500 hover:bg-green-50 transition"
          >
            <div className="text-center">
              <p className="text-green-600 font-semibold">
                📁 Choose Product Image
              </p>

              <p className="text-sm text-gray-500 mt-1">
                {form.image ? form.image.name : "Click here to upload an image"}
              </p>
            </div>
          </label>

          <input
            id="image"
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </div>

        <button className="w-full bg-green-600 text-white py-2 rounded">
          Save Changes
        </button>
      </form>

      {msg && <p className="mt-4 text-red-600">{msg}</p>}
    </div>
  );
}

export default EditProduct;
