import { Navigate, Route, Routes } from 'react-router-dom'
import AdminLayout from './components/layout/AdminLayout'
import CustomerLayout from './components/layout/CustomerLayout'
import RequireAuth from './components/layout/RouteGuards'
import AdminDashboard from './pages/admin/AdminDashboard'
import AdminFlashSales from './pages/admin/AdminFlashSales'
import AdminOrders from './pages/admin/AdminOrders'
import AdminProducts from './pages/admin/AdminProducts'
import AuthPage from './pages/AuthPage'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import Home from './pages/Home'
import OrderDetails from './pages/OrderDetails'
import Orders from './pages/Orders'
import ProductDetails from './pages/ProductDetails'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<AuthPage mode="login" />} />
      <Route path="/signup" element={<AuthPage mode="signup" />} />

      <Route element={<CustomerLayout />}>
        <Route index element={<Home />} />
        <Route path="products/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route element={<RequireAuth />}>
          <Route path="checkout" element={<Checkout />} />
          <Route path="orders" element={<Orders />} />
          <Route path="orders/:id" element={<OrderDetails />} />
          <Route path="wishlist" element={<Wishlist />} />
          <Route path="profile" element={<Profile />} />
        </Route>
      </Route>

      <Route element={<RequireAuth role="ADMIN" />}>
        <Route path="admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="flash-sales" element={<AdminFlashSales />} />
          <Route path="orders" element={<AdminOrders />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
