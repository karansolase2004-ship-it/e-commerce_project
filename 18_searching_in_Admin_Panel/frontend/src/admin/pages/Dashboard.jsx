import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Productcard from "../../user/components/Productcard";
import { getAccessToken } from "../../utils/auth";
import AdminNavbar from "./AdminNavbar.jsx";

function Dashboard() {
  const BASE = import.meta.env.VITE_DJANGO_BASE_URL;

  const [search, setSearch] = useState("");
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

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <>
    <AdminNavbar search={search} setSearch={setSearch} />
    <div className="max-w-2xl mx-auto p-6 pt-24"> 
      
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-6">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => (
                <div key={product.id} className="w-full">
                  <Productcard
                    product={product}
                    isAdmin={true}
                    onEdit={(id) => navigate(`/admin/edit-product/${id}`)}
                    onDelete={handleDelete}
                  />
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500">
                No products found.
              </p>
            )}
          </div>
        )}

    </div>
    </>
  );
}

export default Dashboard;
