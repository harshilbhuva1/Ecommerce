import { useContext, useState } from 'react';
import { FaShoppingCart } from "react-icons/fa";
import { FaRegCircleUser } from "react-icons/fa6";
import { GrSearch } from "react-icons/gr";
import { useDispatch, useSelector } from 'react-redux';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import SummaryApi from '../common';
import ROLE from '../common/role';
import Context from '../context';
import { setUserDetails } from '../store/userSlice';
import Logo from './Logo';

const Header = () => {
  const user = useSelector(state => state?.user?.user)
  const dispatch = useDispatch()
  const [menuDisplay, setMenuDisplay] = useState(false)
  const context = useContext(Context)
  const navigate = useNavigate()
  const searchInput = useLocation()
  const URLSearch = new URLSearchParams(searchInput?.search)
  const searchQuery = URLSearch.getAll("q")
  const [search, setSearch] = useState(searchQuery)

  const handleLogout = async () => {
    const fetchData = await fetch(SummaryApi.logout_user.url, {
      method: SummaryApi.logout_user.method,
      credentials: 'include'
    })

    const data = await fetchData.json()

    if (data.success) {
      toast.success(data.message)
      dispatch(setUserDetails(null))
      navigate("/")
    }

    if (data.error) {
      toast.error(data.message)
    }
  }

  const handleSearch = (e) => {
    const { value } = e.target
    setSearch(value)

    if (value) {
      navigate(`/search?q=${value}`)
    } else {
      navigate("/search")
    }
  }

  return (
    <header className='fixed w-full bg-white shadow-md z-50'>
      {/* Desktop view */}
      <div className='hidden lg:flex h-16 items-center justify-between container mx-auto px-4'>
        {/* Logo */}
        <Link to={"/"}>
          <Logo w={63} h={50} />
        </Link>

        {/* Search */}
        <div className='flex items-center w-full max-w-sm border rounded-full focus-within:shadow pl-2 mx-4'>
          <input type='text' placeholder='Search luxury watches...' className='w-full outline-none' onChange={handleSearch} value={search} />
          <div className='text-lg min-w-[50px] h-8 bg-red-600 flex items-center justify-center rounded-r-full text-white'>
            <GrSearch />
          </div>
        </div>

        {/* Icons */}
        <div className='flex items-center gap-7'>
          {/* Profile */}
          {user?._id && (
            <div className='relative flex justify-center'>
              <div className='text-3xl cursor-pointer' onClick={() => setMenuDisplay(prev => !prev)}>
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-10 h-10 rounded-full' alt={user?.name} />
                ) : (
                  <FaRegCircleUser />
                )}
              </div>
              {menuDisplay && (
                <div className='absolute bg-white top-12 right-0 p-2 shadow-lg rounded'>
                  <nav>
                    {user?.role === ROLE.ADMIN && (
                      <Link to={"/admin-panel/all-products"} className='block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(false)}>Admin Panel</Link>
                    )}
                    <Link to={"/order-status"} className='block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(false)}>My Orders</Link>
                  </nav>
                </div>
              )}
            </div>
          )}

          {/* Cart */}
          {user?._id && (
            <Link to={"/cart"} className='text-2xl relative'>
              <FaShoppingCart />
              <div className='bg-red-600 text-white w-5 h-5 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-3'>
                <p className='text-sm'>{context?.cartProductCount}</p>
              </div>
            </Link>
          )}

          {/* Login/Logout */}
          <div>
            {user?._id ? (
              <button onClick={handleLogout} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Logout</button>
            ) : (
              <Link to={"/login"} className='px-3 py-1 rounded-full text-white bg-red-600 hover:bg-red-700'>Login</Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile view */}
      <div className='lg:hidden px-4 pt-2 pb-1'>
        <div className='flex items-center justify-between'>
          {/* Logo */}
          <Link to={"/"}>
            <Logo w={60} h={48} />
          </Link>

          {/* Right icons compact */}
          <div className='flex items-center gap-6'>
            {user?._id && (
              <div className='relative' onClick={() => setMenuDisplay(prev => !prev)}>
                {user?.profilePic ? (
                  <img src={user?.profilePic} className='w-9 h-9 rounded-full cursor-pointer' alt={user?.name} />
                ) : (
                  <FaRegCircleUser className='text-2xl cursor-pointer' />
                )}
                {menuDisplay && (
                  <div className='absolute bg-white top-12 right-0 p-2 shadow-lg rounded z-50'>
                    <nav>
                      {user?.role === ROLE.ADMIN && (
                        <Link to={"/admin-panel/all-products"} className='block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(false)}>Admin Panel</Link>
                      )}
                      <Link to={"/order-status"} className='block hover:bg-slate-100 p-2' onClick={() => setMenuDisplay(false)}>My Orders</Link>
                    </nav>
                  </div>
                )}
              </div>
            )}
            {user?._id && (
              <Link to={"/cart"} className='text-xl relative'>
                <FaShoppingCart />
                <div className='bg-red-600 text-white w-4 h-4 rounded-full p-1 flex items-center justify-center absolute -top-2 -right-2 text-[10px]'>
                  {context?.cartProductCount}
                </div>
              </Link>
            )}
            <div>
              {user?._id ? (
                <button onClick={handleLogout} className='px-2 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 text-sm'>Logout</button>
              ) : (
                <Link to={"/login"} className='px-2 py-1 rounded-full text-white bg-red-600 hover:bg-red-700 text-sm'>Login</Link>
              )}
            </div>
          </div>
        </div>

        {/* Search below icons */}
        <div className='mt-2 mb-1'>
          <div className='flex items-center w-full border rounded-full pl-2 focus-within:shadow h-9'>
            <input
              type='text'
              placeholder='Search luxury watches...'
              className='w-full outline-none text-sm'
              onChange={handleSearch}
              value={search}
            />
            <div className='text-lg min-w-[40px] h-full bg-red-600 flex items-center justify-center rounded-r-full text-white'>
              <GrSearch />
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}

export default Header;
