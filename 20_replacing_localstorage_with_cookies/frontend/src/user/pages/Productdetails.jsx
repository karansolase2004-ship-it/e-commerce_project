
import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../context/Cartcontext";

function Productdetails() {
  const { id } = useParams();
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [adding, setAdding] = useState(false);
  const [notification, setNotification] = useState("");
  const [notificationType, setNotificationType] = useState("");

  const { addtocart } = useCart();

  // Fetch Product Details
  useEffect(() => {
    fetch(`${BASEURL}/api/products/${id}/`)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to Fetch product Details");
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [id, BASEURL]);

  const handleAddtoCart = async () => {

    setAdding(true);
    setNotification("");

    const result = await addtocart(product.id);

    if (result.success) {
      setNotification(result.message || "Product added to cart successfully!");
      setNotificationType("success");

      // Update available stock from backend response
      if (result.available_stock !== undefined) {
        setProduct((current) => ({
          ...current,
          stock: result.available_stock
        }));
      }
    }
    else {
      setNotification(result.message || "Unable to add product");
      setNotificationType("error");
    }

    setTimeout(() => {
    setNotification("");
  }, 3000);

    setAdding(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error : {error}</div>;
  }

  if (!product) {
    return <div>No Product Found</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex justify-center items-center py-10">
    {/* Floating Notification */}
        {notification && (
          <div
            className={`fixed top-25 left-1/2 -translate-x-1/2 z-50 px-6 py-3 rounded-lg shadow-lg ${
              notificationType === "success"
                ? "bg-green-600 text-white"
                : "bg-red-600 text-white"
            }`}
          >
            {notification}
          </div>
        )}
      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-3xl w-full">

        <div className="flex flex-col md:flex-row gap-8">

          <img
            src={product.image}
            alt={product.name}
            className="w-full md:w-1/2 h-auto object-cover rounded-lg"
          />

          <div className="flex-1">

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {product.name}
            </h1>

            <p className="text-gray-600 mb-4">
              {product.description}
            </p>

            <p className="text-2xl font-semibold text-green-600 mb-4">
              ₹{product.price}
            </p>

            {/* Available Stock */}
            <p className={`font-semibold mb-4 ${
              product.stock > 0 ? "text-green-600" : "text-red-600"
            }`}>
              {product.stock > 0
                ? `Available: ${product.stock} items`
                : "Out of Stock"
              }
            </p>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddtoCart}
              disabled={product.stock < 1 || adding}
              className={`text-white px-6 py-2 rounded-lg transition ${
                product.stock < 1 || adding
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {adding ? "Adding..." : "Add to Cart"}
            </button>

            <div className="mt-4">
              <a
                href="/"
                className="text-blue-600 hover:underline"
              >
                &larr; Back
              </a>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Productdetails;
