import React from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import './App.css'
import OwnerData from './Components/Ownerdata/Getownerdata'

function App() {
  

  return (    
    <BrowserRouter>
    <Routes>
      <Route  path='/data' element={<OwnerData />} />
    </Routes>
    </BrowserRouter>
    
  )
}

export default App
