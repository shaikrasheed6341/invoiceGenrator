import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import OwnerData from './Components/Ownerdata/Getownerdata'
//import Postowner from './Components/Ownerdata/Postowner'
import Sudmitownerdata from './Components/Ownerdata/Postowner'
import Postcustmer from './Components/Custmerdata/Postcustmerdata'
import Updateowner from './Components/Ownerdata/Updateowner'
import Updatecustmoer from './Components/Custmerdata/Updatecustmer'
import Insertiteams from './Components/Iteams/Insertiteams'

import AllItemsTable from './Components/Iteams/SearchIteams'
import QuotationForm from './Components/Qutation/QuationTemplete'
import Bankdetails from './Components/Bankdetails/Bankdetails'
import Postquation from './Components/Qutation/Postquation'


function App() {
  

  return (    
    <BrowserRouter>
    <Routes>
      <Route  path='/data' element={<OwnerData />} />
      <Route path='/' element={<Sudmitownerdata />}  />
      <Route path='/postcustmer' element={<Postcustmer />} />
      <Route path='/updateowner' element={<Updateowner />} />
      <Route path='/updatecustmer' element= {<Updatecustmoer />} />
      <Route path='/selectiteams' element={<Insertiteams />} />
      <Route path='/getalliteams' element={<AllItemsTable />} />
      <Route path='/bankdetails' element={<Bankdetails />} />
      <Route path='/quataion' element={<QuotationForm />} />
      <Route path='/postquation' element={<Postquation />} />


    </Routes>

    </BrowserRouter>
    
  )
}

export default App
