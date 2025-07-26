import React, { useContext, useEffect, useRef, useState } from 'react';
import fetchCategoryWiseProduct from '../helpers/fetchCategoryWiseProduct';
import displayINRCurrency from '../helpers/displayCurrency';
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa6';
import { Link } from 'react-router-dom';
import addToCart from '../helpers/addToCart';
import Context from '../context';

const VerticalCardProduct = ({ category, heading }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const loadingList = new Array(12).fill(null);

  const scrollElement = useRef();

  const { fetchUserAddToCart } = useContext(Context);

  const handleAddToCart = async (e, id) => {
    e.preventDefault(); // Prevent redirect on button click inside Link
    await addToCart(e, id);
    fetchUserAddToCart();
  };

  const fetchData = async () => {
    setLoading(true);
    const categoryProduct = await fetchCategoryWiseProduct(category);
    setLoading(false);
    setData(categoryProduct?.data || []);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const scrollRight = () => {
    scrollElement.current.scrollBy({ left: 300, behavior: 'smooth' });
  };
  const scrollLeft = () => {
    scrollElement.current.scrollBy({ left: -300, behavior: 'smooth' });
  };

  return (
    <div className="container mx-auto px-4 my-8 relative">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">{heading}</h2>
        <div className="hidden md:flex gap-2">
          <button onClick={scrollLeft} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 text-xl">
            <FaAngleLeft />
          </button>
          <button onClick={scrollRight} className="p-2 rounded-full bg-white shadow hover:bg-gray-100 text-xl">
            <FaAngleRight />
          </button>
        </div>
      </div>

      <div
        ref={scrollElement}
        className="flex gap-5 overflow-x-auto scrollbar-thin scrollbar-thumb-gray-300 pb-2 scroll-smooth"
      >
        {loading
          ? loadingList.map((_, index) => (
              <div
                key={index}
                className="w-[220px] md:w-[280px] flex-shrink-0 bg-white rounded-lg shadow-md animate-pulse"
              >
                <div className="bg-gray-200 h-40 rounded-t-lg"></div>
                <div className="p-4 space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="flex gap-2">
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded w-full"></div>
                </div>
              </div>
            ))
          : data.map((product) => (
              <Link
                to={`product/${product?._id}`}
                key={product?._id}
                className="w-[220px] md:w-[280px] flex-shrink-0 bg-white rounded-lg shadow hover:shadow-lg transition duration-300"
              >
                <div className="h-40 p-3 flex justify-center items-center bg-gray-100 rounded-t-lg">
                  <img
                    src={product.productImage[0]}
                    alt={product.productName}
                    className="object-contain h-full hover:scale-105 transition-transform duration-300 mix-blend-multiply"
                  />
                </div>
                <div className="p-4 space-y-2">
                  <h3 className="text-sm md:text-base font-semibold line-clamp-1">{product.productName}</h3>
                  <p className="text-xs text-gray-500 capitalize">{product.category}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-red-600 font-semibold">{displayINRCurrency(product.sellingPrice)}</p>
                    <p className="text-xs text-gray-500 line-through">{displayINRCurrency(product.price)}</p>
                  </div>
                  <button
                    className="mt-2 text-sm bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-full w-full"
                    onClick={(e) => handleAddToCart(e, product._id)}
                  >
                    Add to Cart
                  </button>
                </div>
              </Link>
            ))}
      </div>
    </div>
  );
};

export default VerticalCardProduct;
