import { Route, Routes } from 'react-router-dom';
import Layout from './Components/Navbar/Layout.jsx';
import Dashboard from './Components/Navbar/Dashboard';
import Submitownerdata from './Components/Ownerdata/Postowner';
import Postcustomer from './Components/Custmerdata/Postcustmerdata';
import Updateowner from './Components/Ownerdata/Updateowner';
import Updatecustomer from './Components/Custmerdata/Updatecustmer';
import Insertitems from './Components/Iteams/Insertiteams';
import AllItemsTable from './Components/Iteams/SearchIteams';
import Bankdetails from './Components/Bankdetails/Bankdetails';
import PostQuotation from './Components/Qutation/Postquation';
import FetchQuotation from './Components/Invoice/FetchQuotation';
import Invoice from './Components/Invoice/Invoice';
import Signup from './Components/Singnup/Signup.jsx';
import Login from './Components/Singnup/Login.jsx';

function App() {
  return (
    <Routes>
      <Route path='/signup' element={<Layout><Signup /></Layout>} />
      <Route path='/login' element={<Layout><Login /></Layout>} />
      <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
      <Route path="/submitownerdata" element={<Layout><Submitownerdata /></Layout>} />
      <Route path="/postcustmer" element={<Layout><Postcustomer /></Layout>} />
      <Route path="/updateowner" element={<Layout><Updateowner /></Layout>} />
      <Route path="/updatecustmer" element={<Layout><Updatecustomer /></Layout>} />
      <Route path="/selectiteams" element={<Layout><Insertitems /></Layout>} />
      <Route path="/getalliteams" element={<Layout><AllItemsTable /></Layout>} />
      <Route path="/bankdetails" element={<Layout><Bankdetails /></Layout>} />
      <Route path="/postquation" element={<Layout><PostQuotation /></Layout>} />
      <Route path="/fetch" element={<Layout><FetchQuotation /></Layout>} />
      <Route path="/invoice" element={<Layout><Invoice /></Layout>} />
    </Routes>
  );
}

export default App;
