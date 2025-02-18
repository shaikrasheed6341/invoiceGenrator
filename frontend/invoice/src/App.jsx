import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import OwnerData from './Components/Ownerdata/Getownerdata'
//import Postowner from './Components/Ownerdata/Postowner'
import Sudmitownerdata from './Components/Ownerdata/Postowner'
import Postcustmer from './Components/Custmerdata/Postcustmerdata'
import Updateowner from './Components/Ownerdata/Updateowner'

function App() {
  

  return (    
    <BrowserRouter>
    <Routes>
      <Route  path='/data' element={<OwnerData />} />
      <Route path='/postowner' element={<Sudmitownerdata />}  />
      <Route path='/postcustmer' element={<Postcustmer />} />
      <Route path='/updateowner' element={<Updateowner />} />

    </Routes>

    </BrowserRouter>
    
  )
}

export default App
