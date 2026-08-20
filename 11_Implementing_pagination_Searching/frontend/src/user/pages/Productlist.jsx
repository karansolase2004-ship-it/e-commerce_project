import { useEffect, useState } from "react";
import Productcard from "../components/Productcard";
import Pagepagination from "../components/Pagepagination";

function Productlist({search}) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);

  const [page, setPage] = useState(1);
  function increasePageValue() {
    if (page < numOfPages) {
      setPage((curr) => curr + 1);
    }
  }

  function decreasePageValue() {
    if (page > 1) {
      setPage((curr) => curr - 1);
    }
  }
  const numOfProductPerPage = 3;

  const BASEURL = import.meta.env.VITE_DJANGO_BASE_URL;

  useEffect(() => {
    // fetch(`${BASEURL}/api/products/?page=${page}`)
    fetch(
      `${BASEURL}/api/products/?page=${page}&search=${encodeURIComponent(search)}`,
    )
      .then((response) => {
        if (!response.ok) {
          throw new Error("Failed to fetch products");
        }
        return response.json();
      })
      .then((data) => {
        console.log(data.results);
        setProducts(data.results);
        setCount(data.count);
        setLoading(false);
      })
      .catch((error) => {
        setError(error.message);
        setLoading(false);
      });
  }, [page, search]);

  const numOfPages = Math.ceil(count / numOfProductPerPage);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (error) {
    return <div>Error : {error}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <h1 className="text-3xl font-bold text-center py-6 bg-white shadow-md">
        Product List
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 p-6">
        {products.length > 0 ? (
          products.map((product) => (
            <Productcard key={product.id} product={product}></Productcard>
          ))
        ) : (
          <p className="col-span-full text-center text-gray-500">
            No product available
          </p>
        )}
      </div>

      <Pagepagination
        page={page}
        numOfPages={numOfPages}
        increasePageValue={increasePageValue}
        decreasePageValue={decreasePageValue}
      />
    </div>
  );
}

export default Productlist;
