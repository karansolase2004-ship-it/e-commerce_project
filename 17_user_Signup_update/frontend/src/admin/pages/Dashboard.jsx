import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Productcard from "../../user/components/Productcard";
import { getAccessToken } from "../../utils/auth";

function Dashboard() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const response = await fetch(`${BASE}/api/admin/products/`, {
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts(data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }

  function handleEdit(id) {
    navigate(`/admin/edit-product/${id}`);
  }

  async function handleDelete(id) {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this product?",
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(`${BASE}/api/admin/products/${id}/delete/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`,
        },
      });

      const data = await response.json();

      if (response.ok) {
        setProducts((prevProducts) =>
          prevProducts.filter((product) => product.id !== id),
        );
      } else {
        console.log(data);
        alert("Failed to delete product.");
      }
    } catch (error) {
      console.log(error);
      alert("Something went wrong.");
    }
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Products</h1>

        <button
          onClick={() => navigate("/admin/add-product")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          + Add Product
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-6">
          {products.map((product) => (
            <div key={product.id} className="w-full">
              <Productcard
                product={product}
                isAdmin={true}
                onEdit={(id) => navigate(`/admin/edit-product/${id}`)}
                onDelete={handleDelete}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
