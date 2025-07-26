// import { useEffect, useState } from 'react';
// import { useDispatch } from 'react-redux';
// import { Outlet } from 'react-router-dom';
// import { ToastContainer } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import './App.css';
// import SummaryApi from './common';
// import Footer from './components/Footer';
// import Header from './components/Header';
// import Context from './context';
// import { setUserDetails } from './store/userSlice';

// function App() {
//   const dispatch = useDispatch()
//   const [cartProductCount,setCartProductCount] = useState(0)

//   const fetchUserDetails = async()=>{
//       const dataResponse = await fetch(SummaryApi.current_user.url,{
//         method : SummaryApi.current_user.method,
//         credentials : 'include'
//       })

//       const dataApi = await dataResponse.json()

//       if(dataApi.success){
//         dispatch(setUserDetails(dataApi.data))
//       }
//   }

//   const fetchUserAddToCart = async()=>{
//     const dataResponse = await fetch(SummaryApi.addToCartProductCount.url,{
//       method : SummaryApi.addToCartProductCount.method,
//       credentials : 'include'
//     })

//     const dataApi = await dataResponse.json()

//     setCartProductCount(dataApi?.data?.count)
//   }

//   useEffect(()=>{
//     /**user Details */
//     fetchUserDetails()
//     /**user Details cart product */
//     fetchUserAddToCart()

//   },[])
//   return (
//     <>
//       <Context.Provider value={{
//           fetchUserDetails, // user detail fetch 
//           cartProductCount, // current user add to cart product count,
//           fetchUserAddToCart
//       }}>
//         <ToastContainer 
//           position='top-center'
//         />
        
//         <Header/>
//         {/* <main className='min-h-[calc(100vh-120px)] pt-16'> */}
//         <main className="min-h-[calc(100vh-120px)] pt-[110px] sm:pt-16">
//           <Outlet/>
//         </main>
//       </Context.Provider>
//         <Footer/>
//     </>
//   );
// }

// export default App;
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { Outlet } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './App.css';
import SummaryApi from './common';
import Footer from './components/Footer';
import Header from './components/Header';
import Context from './context';
import { setUserDetails } from './store/userSlice';

function App() {
  const dispatch = useDispatch();
  const [cartProductCount, setCartProductCount] = useState(0);

  const fetchUserDetails = async () => {
    try {
      const res = await fetch(SummaryApi.current_user.url, {
        method: SummaryApi.current_user.method,
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success) dispatch(setUserDetails(data.data));
    } catch (err) {
      console.error("User fetch error:", err);
    }
  };

  const fetchUserAddToCart = async () => {
    try {
      const res = await fetch(SummaryApi.addToCartProductCount.url, {
        method: SummaryApi.addToCartProductCount.method,
        credentials: 'include',
      });
      const data = await res.json();
      setCartProductCount(data?.data?.count || 0);
    } catch (err) {
      console.error("Cart fetch error:", err);
    }
  };

  useEffect(() => {
    fetchUserDetails();
    fetchUserAddToCart();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <Context.Provider
        value={{
          fetchUserDetails,
          cartProductCount,
          fetchUserAddToCart,
        }}
      >
        <ToastContainer position="top-center" />
        <Header />
        <main className="flex-grow pt-[110px] sm:pt-16 px-2 sm:px-0">
          <Outlet />
        </main>
      </Context.Provider>
      <Footer />
    </div>
  );
}

export default App;
