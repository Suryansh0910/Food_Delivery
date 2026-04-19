import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Auth from './pages/Auth';

import CustomerDashboard from './pages/CustomerDashboard';
import CustomerRestaurants from './pages/CustomerRestaurants';
import CustomerDeals from './pages/CustomerDeals.tsx';
import CustomerOrders from './pages/CustomerOrders.tsx';

import OwnerDashboard from './pages/OwnerDashboard';
import OwnerOrders from './pages/OwnerOrders';
import OwnerMenu from './pages/OwnerMenu.tsx';

import AdminDashboard from './pages/AdminDashboard';
import AdminApprovals from './pages/AdminApprovals';
import AdminRestaurants from './pages/AdminRestaurants.tsx';

import { MainLayout } from './components/MainLayout';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={<Auth />} />

        {/* Routes under Navbar Layout */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          
          {/* Customer only route */}
          <Route element={<ProtectedRoute allowedRoles={['customer']} />}>
            <Route path="/customer/dashboard" element={<CustomerDashboard />} />
            <Route path="/customer/restaurants" element={<CustomerRestaurants />} />
            <Route path="/customer/deals" element={<CustomerDeals />} />
            <Route path="/customer/orders" element={<CustomerOrders />} />
          </Route>

          {/* Owner only route */}
          <Route element={<ProtectedRoute allowedRoles={['owner']} />}>
            <Route path="/owner/dashboard" element={<OwnerDashboard />} />
            <Route path="/owner/orders" element={<OwnerOrders />} />
            <Route path="/owner/menu" element={<OwnerMenu />} />
          </Route>

          {/* Admin only route */}
          <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
            <Route path="/admin/approvals" element={<AdminApprovals />} />
            <Route path="/admin/restaurants" element={<AdminRestaurants />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

