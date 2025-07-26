import React, { useState } from 'react'
import { MdModeEditOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import AdminEditProduct from './AdminEditProduct';
import displayINRCurrency from '../helpers/displayCurrency';

const AdminProductCard = ({
    data,
    fetchdata
}) => {
    const [editProduct,setEditProduct] = useState(false)

    const handleDelete = async () => {
      if (!window.confirm('Are you sure you want to delete this product?')) return;
      // const res = await fetch(`http://localhost:5000/api/product/${data._id}`, {
      const res = await fetch(`${process.env.REACT_APP_BACKEND_URL}/api/product/${data._id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      const result = await res.json();
      if(result.success){
        fetchdata();
      } else {
        alert(result.message || 'Failed to delete product');
      }
    }

  return (
    <div className='bg-white p-4 rounded '>
       <div className='w-40'>
            <div className='w-32 h-32 flex justify-center items-center'>
              <img src={data?.productImage[0]}  className='mx-auto object-fill h-full'/>   
            </div> 
            <h1 className='text-ellipsis line-clamp-2'>{data.productName}</h1>

            <div>

                <p className='font-semibold'>
                  {
                    displayINRCurrency(data.sellingPrice)
                  }
        
                </p>

                <div className='flex justify-between items-center mt-2'>
                  <div className='w-fit p-2 bg-green-100 hover:bg-green-600 rounded-full hover:text-white cursor-pointer' onClick={()=>setEditProduct(true)}>
                      <MdModeEditOutline/>
                  </div>
                  <div className='w-fit p-2 bg-red-100 hover:bg-red-600 rounded-full hover:text-white cursor-pointer' onClick={handleDelete} title="Delete Product">
                      <MdDelete/>
                  </div>
                </div>

            </div>

          
       </div>
        
        {
          editProduct && (
            <AdminEditProduct productData={data} onClose={()=>setEditProduct(false)} fetchdata={fetchdata}/>
          )
        }
    
    </div>
  )
}

export default AdminProductCard