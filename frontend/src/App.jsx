import { Route, Routes, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Layout from './Components/Navbar/Layout.jsx';
import Dashboard from './Components/Navbar/Dashboard';
import Submitownerdata from './Components/Ownerdata/Postowner';
import Postcustomer from './Components/Custmerdata/Postcustmerdata';
import Updateowner from './Components/Ownerdata/Updateowner';
import Updatecustomer from './Components/Custmerdata/Updatecustmer';
import CustomerList from './Components/Custmerdata/CustomerList';
import Insertitems from './Components/Iteams/Insertiteams';
import AllItemsTable from './Components/Iteams/SearchIteams';
import ViewProducts from './Components/Iteams/ViewProducts';
import Bankdetails from './Components/Bankdetails/Bankdetails';
import BankDetailsList from './Components/Bankdetails/BankDetailsList';
import PostQuotation from './Components/Qutation/Postquation';
import CreateQuotationFlow from './Components/Qutation/CreateQuotationFlow';
import StreamlinedQuotation from './Components/Qutation/StreamlinedQuotation';
import LiveQuotationBuilder from './Components/Qutation/LiveQuotationBuilder';
import FetchQuotation from './Components/Invoice/FetchQuotation';
import Invoice from './Components/Invoice/Invoice';
import Landingpage from './Components/Landingpage/Landingpage.jsx';
import TemplatetTwo from './Components/Invoice/TemplatetTwo.jsx';
import Login from './Components/Singnup/Login.jsx';
import AuthCallback from './Components/Singnup/AuthCallback.jsx';
import ProtectedRoute from './Components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext';

// Analytics Components
import OwnerDashboard from './Components/Dashboard/OwnerDashboard';
import PaymentTracking from './Components/Dashboard/PaymentTracking';
import MonthlyAnalytics from './Components/Dashboard/MonthlyAnalytics';
import RevenueTracking from './Components/Dashboard/RevenueTracking';
import AnalyticsDebug from './Components/Dashboard/AnalyticsDebug';

function AppRoutes() {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={
        isAuthenticated ? <Navigate to="/dashboard" replace /> : <Layout><Landingpage /></Layout>
      } />
      <Route path="/login" element={<Layout><Login /></Layout>} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      
      {/* Protected Routes */}
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <Layout><Dashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path='/Landinpage' element={
        <ProtectedRoute>
          <Layout><Landingpage /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/submitownerdata" element={
        <ProtectedRoute>
          <Layout><Submitownerdata /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/postcustmer" element={
        <ProtectedRoute>
          <Layout><Postcustomer /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/updateowner" element={
        <ProtectedRoute>
          <Layout><Updateowner /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/updatecustmer" element={
        <ProtectedRoute>
          <Layout><Updatecustomer /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/customers" element={
        <ProtectedRoute>
          <Layout><CustomerList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/selectiteams" element={
        <ProtectedRoute>
          <Layout><Insertitems /></Layout>
        </ProtectedRoute>
      } />

      <Route path="/viewproducts" element={
        <ProtectedRoute>
          <Layout><ViewProducts /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/bankdetails" element={
        <ProtectedRoute>
          <Layout><Bankdetails /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/bankdetails/list" element={
        <ProtectedRoute>
          <Layout><BankDetailsList /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/postquation" element={
        <ProtectedRoute>
          <Layout><PostQuotation /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/create-quotation" element={
        <ProtectedRoute>
          <Layout><CreateQuotationFlow /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/streamlined-quotation" element={
        <ProtectedRoute>
          <Layout><StreamlinedQuotation /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/live-quotation" element={
        <ProtectedRoute>
          <Layout><LiveQuotationBuilder /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/fetch" element={
        <ProtectedRoute>
          <Layout><FetchQuotation /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/invoice" element={
        <ProtectedRoute>
          <Invoice />
        </ProtectedRoute>
      } />
      <Route path='/template' element={
        <ProtectedRoute>
          <TemplatetTwo />
        </ProtectedRoute>
      } />
      
      {/* Analytics Routes */}
      <Route path="/owner-dashboard" element={
        <ProtectedRoute>
          <Layout><OwnerDashboard /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/payment-tracking" element={
        <ProtectedRoute>
          <Layout><PaymentTracking /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/monthly-analytics" element={
        <ProtectedRoute>
          <Layout><MonthlyAnalytics /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/revenue-tracking" element={
        <ProtectedRoute>
          <Layout><RevenueTracking /></Layout>
        </ProtectedRoute>
      } />
      <Route path="/analytics-debug" element={
        <ProtectedRoute>
          <Layout><AnalyticsDebug /></Layout>
        </ProtectedRoute>
      } />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
