// import React from 'react'
// import CategoryList from '../components/CategoryList'
// import BannerProduct from '../components/BannerProduct'
// import HorizontalCardProduct from '../components/HorizontalCardProduct'
// import VerticalCardProduct from '../components/VerticalCardProduct'

// const Home = () => {
//   return (
//     <div>
//       <CategoryList/>
//       <BannerProduct/>

//       <HorizontalCardProduct category={"airpodes"} heading={"Top's Airpodes"}/>
//       <HorizontalCardProduct category={"watches"} heading={"Popular's Watches"}/>

//       <VerticalCardProduct category={"watches"} heading={"Watches"}/>
//       <VerticalCardProduct category={"nwatches"} heading={"Rolex-Watches"}/>
//       <VerticalCardProduct category={"swatches"} heading={"SmartWatches"}/>
//       <VerticalCardProduct category={"snack"} heading={"Snack"}/>


//       {/* <VerticalCardProduct category={"Mouse"} heading={"Mouse"}/>
//       <VerticalCardProduct category={"televisions"} heading={"Televisions"}/>
//       <VerticalCardProduct category={"camera"} heading={"Camera & Photography"}/>
//       <VerticalCardProduct category={"earphones"} heading={"Wired Earphones"}/>
//       <VerticalCardProduct category={"speakers"} heading={"Bluetooth Speakers"}/>
//       <VerticalCardProduct category={"refrigerator"} heading={"Refrigerator"}/>
//       <VerticalCardProduct category={"trimmers"} heading={"Trimmers"}/> */}
//     </div>
//   )
// }

// export default Home
import React from 'react'
import CategoryList from '../components/CategoryList'
import BannerProduct from '../components/BannerProduct'
import HorizontalCardProduct from '../components/HorizontalCardProduct'
import VerticalCardProduct from '../components/VerticalCardProduct'

const Home = () => {
  return (
    <div>
      <CategoryList/>
      <BannerProduct/>

      
      <HorizontalCardProduct category={"watchesmain"} heading={"Popular's Watches"}/>

      <VerticalCardProduct category={"watches"} heading={"Watches"}/>
      <VerticalCardProduct category={"rolex"} heading={"Rolex-Watches"}/>
      <VerticalCardProduct category={"fossil"} heading={"Fossil"}/>
      <VerticalCardProduct category={"omega"} heading={"Omega x Swatchs"}/>
      <VerticalCardProduct category={"girls"} heading={"Girl's Expensive Watches"}/>


      
    </div>
  )
}

export default Home