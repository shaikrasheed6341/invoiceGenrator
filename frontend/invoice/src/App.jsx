import React from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Layout from './Components/Navbar/Layout.jsx'
import Dashboard from './Components/Navbar/Dashboard'
import Sudmitownerdata from './Components/Ownerdata/Postowner'
import Postcustmer from './Components/Custmerdata/Postcustmerdata'
import Updateowner from './Components/Ownerdata/Updateowner'
import Updatecustmoer from './Components/Custmerdata/Updatecustmer'
import Insertiteams from './Components/Iteams/Insertiteams'
import AllItemsTable from './Components/Iteams/SearchIteams'
import Bankdetails from './Components/Bankdetails/Bankdetails'
import PostQuotation from './Components/Qutation/Postquation'
import FetchQuotation from './Components/Invoice/FetchQuotation'
import Invoice from './Components/Invoice/Invoice'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Dashboard /></Layout>} />
        <Route path="/submitownerdata" element={<Layout><Sudmitownerdata /></Layout>} />
        <Route path="/postcustmer" element={<Layout><Postcustmer /></Layout>} />
        <Route path="/updateowner" element={<Layout><Updateowner /></Layout>} />
        <Route path="/updatecustmer" element={<Layout><Updatecustmoer /></Layout>} />
        <Route path="/selectiteams" element={<Layout><Insertiteams /></Layout>} />
        <Route path="/getalliteams" element={<Layout><AllItemsTable /></Layout>} />
        <Route path="/bankdetails" element={<Layout><Bankdetails /></Layout>} />
        <Route path="/postquation" element={<Layout><PostQuotation /></Layout>} />
        <Route path="/fetch" element={<Layout><FetchQuotation /></Layout>} />
        <Route path="/invoice" element={<Layout><Invoice /></Layout>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App