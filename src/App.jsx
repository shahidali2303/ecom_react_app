import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
} from "react-router-dom";
import { supabase } from "./lib/supabase";
import useStore from "./store/useStore";
import { Toaster } from "react-hot-toast";

// Page Imports
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Wishlist from "./pages/Wishlist";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardLayout from "./pages/DashboardLayout";
import PersonalDetails from "./pages/dashboard/PersonalDetails";
import OrderHistory from "./pages/dashboard/OrderHistory";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminProducts from "./pages/admin/AdminProducts";

function App() {
  const setUser = useStore((state) => state.setUser);

  useEffect(() => {
    // 1. Check for an existing session when the app loads
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        setUser(session.user);
      }
    });

    // 2. Listen for Auth State changes (Login, Logout, etc.)
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => subscription.unsubscribe();
  }, [setUser]);
  return (
    <Router>
      <Toaster position="top-center" reverseOrder={false} />

      <Routes>
        {/* ROUTES WITH NAVBAR */}
        <Route
          element={
            <>
              <Navbar />
              <Outlet />
            </>
          }
        >
          <Route path="/" element={<Home />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* PROTECTED USER ROUTES */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<PersonalDetails />} />
              <Route path="details" element={<PersonalDetails />} />
              <Route path="orders" element={<OrderHistory />} />
            </Route>
          </Route>
        </Route>

        {/* ADMIN ROUTES (NO NAVBAR) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminOrders />} />
            <Route path="orders" element={<AdminOrders />} />
            <Route path="products" element={<AdminProducts />} />
          </Route>
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
