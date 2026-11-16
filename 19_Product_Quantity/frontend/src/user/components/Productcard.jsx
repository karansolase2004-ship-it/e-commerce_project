import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

function Productcard({
  product,
  isAdmin = false,
  onEdit,
  onDelete,
  onStockChange
}) {
  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  const [stockValue, setStockValue] = useState(product.stock);

  useEffect(() => {
    setStockValue(product.stock);
  }, [product.stock]);

  // Save manually entered stock value
  const handleStockUpdate = () => {
    if (
      stockValue === "" ||
      !Number.isInteger(Number(stockValue)) ||
      Number(stockValue) < 0
    ) {
      setStockValue(product.stock);
      return;
    }

    onStockChange(product.id, "set", Number(stockValue));
  };

  const card = (
    <div
      className={`bg-white rounded-xl shadow-md hover:shadow-lg hover:scale-[1.02] transition-transform p-4 ${
        isAdmin ? "flex gap-6 items-center w-full" : ""
      }`}
    >
      <img
        src={`${BASEURL}${product.image}`}
        alt={product.name}
        className={`object-cover rounded-lg ${
          isAdmin ? "w-40 h-40 flex-shrink-0" : "w-full h-56 mb-4"
        }`}
      />

      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800 truncate">
          {product.name}
        </h2>

        <p className="text-gray-600 font-medium mb-3">
          ₹{product.price}
        </p>

        {isAdmin && (
          <>
            <div className="mb-4">
              <p className="text-gray-700 font-medium mb-2">
                Available Stock
              </p>

              <div className="flex items-center gap-3 mb-3">
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={stockValue}
                  onChange={(e) => setStockValue(e.target.value)}
                  onBlur={handleStockUpdate}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.target.blur();
                    }
                  }}
                  className="w-16 text-center font-semibold border border-gray-300 rounded py-1"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={(e) => {
                  e.preventDefault();
                  onEdit(product.id);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2 rounded"
              >
                Edit
              </button>

              <button
                onClick={(e) => {
                  e.preventDefault();
                  onDelete(product.id);
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 rounded"
              >
                Delete
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );

  if (isAdmin) {
    return card;
  }

  return (
    <Link to={`/product/${product.id}`}>
      {card}
    </Link>
  );
}

export default Productcard;