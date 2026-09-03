import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './layouts/MainLayout';
import PartnerLayout from './layouts/PartnerLayout';
import ProtectedRoute from './components/ProtectedRoute';
import RoleRoute from './components/RoleRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import RestaurantDetail from './pages/RestaurantDetail';
import FoodDetail from './pages/FoodDetail';
import CheckoutPage from './pages/CheckoutPage';
import OrdersPage from './pages/OrdersPage';
import UserProfile from './pages/UserProfile';
import Login from './pages/Login';
import Register from './pages/Register';

// Partner Pages
import PartnerDashboard from './pages/partner/PartnerDashboard';
import FoodPortfolio from './pages/partner/FoodPortfolio';
import AddFood from './pages/partner/AddFood';
import EditFood from './pages/partner/EditFood';
import PartnerOrders from './pages/partner/PartnerOrders';
import PartnerProfile from './pages/partner/PartnerProfile';

function App() {
  return (
    <Routes>
      {/* Public & Customer Experience (MainLayout) */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/restaurant/:id" element={<RestaurantDetail />} />
        <Route path="/food/:id" element={<FoodDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Customer Protected Routes */}
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <CheckoutPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <UserProfile />
            </ProtectedRoute>
          }
        />
      </Route>

      {/* Food Partner Management Portal (PartnerLayout) */}
      <Route
        path="/partner"
        element={
          <RoleRoute allowedRoles={['foodPartner']}>
            <PartnerLayout />
          </RoleRoute>
        }
      >
        <Route index element={<Navigate to="/partner/dashboard" replace />} />
        <Route path="dashboard" element={<PartnerDashboard />} />
        <Route path="food" element={<FoodPortfolio />} />
        <Route path="add-food" element={<AddFood />} />
        <Route path="edit-food/:id" element={<EditFood />} />
        <Route path="orders" element={<PartnerOrders />} />
        <Route path="profile" element={<PartnerProfile />} />
      </Route>

      {/* 404 Catch-All */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
