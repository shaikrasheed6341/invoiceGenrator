import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import OwnerData from './Components/Ownerdata/Getownerdata'
//import Postowner from './Components/Ownerdata/Postowner'
import Sudmitownerdata from './Components/Ownerdata/Postowner'

function App() {
  

  return (    
    <BrowserRouter>
    <Routes>
      <Route  path='/data' element={<OwnerData />} />
      <Route path='/postowner' element={<Sudmitownerdata />}  />
    </Routes>

    </BrowserRouter>
    
  )
}

export default App
