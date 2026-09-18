import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import { AuthProvider } from "./context/AuthContext";
import { CartProvider } from "./context/CartContext";
import { OrderProvider } from "./context/OrderContext";
import Profile from "./pages/customer/Profile";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import ProtectedRoute from "./components/common/ProtectedRoute";
import Home from "./pages/customer/Home";
import ProductDetails from "./pages/customer/ProductDetails";
import Cart from "./pages/customer/Cart";
import Checkout from "./pages/customer/Checkout";
import Orders from "./pages/customer/Orders";
import OrderDetails from "./pages/customer/OrderDetails";
import { WishlistProvider } from "./context/WishlistContext";
import Wishlist from "./pages/customer/Wishlist";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProducts from "./pages/admin/AdminProducts";
function App() {
  return (
   <BrowserRouter>
      <AuthProvider>
        <CartProvider>
          <OrderProvider>
            <WishlistProvider>
              <Routes>

  {/* Public Routes */}

  <Route
    path="/"
    element={<Navigate to="/login" replace />}
  />

  <Route
    path="/login"
    element={<Login />}
  />

  <Route
    path="/signup"
    element={<Signup />}
  />


  {/* Protected Customer Routes */}

  <Route element={<ProtectedRoute />}>

    <Route
      path="/home"
      element={<Home />}
    />

    <Route
      path="/products/:productId"
      element={<ProductDetails />}
    />

    <Route
      path="/cart"
      element={<Cart />}
    />

    <Route
      path="/checkout"
      element={<Checkout />}
    />

    <Route
      path="/orders"
      element={<Orders />}
    />
    <Route
  path="/profile"
  element={<Profile />}
/>
<Route
  path="/wishlist"
  element={<Wishlist />}
/>
    <Route
      path="/orders/:orderId"
      element={<OrderDetails />}
    />
   

  </Route>
 <Route
  path="/admin"
  element={<AdminDashboard />}
/>

<Route
  path="/admin/products"
  element={<AdminProducts />}
/>

  {/* Unknown Route */}

  <Route
    path="*"
    element={<Navigate to="/login" replace />}
  />

 </Routes>
            </WishlistProvider>
          </OrderProvider>
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;