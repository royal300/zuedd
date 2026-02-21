import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import { AdminAuthProvider } from "@/context/AdminAuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/admin/AdminRoute";
import Landing from "./pages/Landing";
import TShirts from "./pages/TShirts";
import TShirtDetail from "./pages/TShirtDetail";
import Jewellery from "./pages/Jewellery";
import JewelleryDetail from "./pages/JewelleryDetail";
import Cart from "./pages/Cart";
import Checkout from "./pages/Checkout";
import Login from "./pages/Login";
import NotFound from "./pages/NotFound";
// Admin
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import Dashboard from "./pages/admin/Dashboard";
import OrderManagement from "./pages/admin/OrderManagement";
import CategoryManagement from "./pages/admin/CategoryManagement";
import ProductManagement from "./pages/admin/ProductManagement";
import AddTshirt from "./pages/admin/AddTshirt";
import AddJewellery from "./pages/admin/AddJewellery";
import PromoManagement from "./pages/admin/PromoManagement";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AdminAuthProvider>
        <AuthProvider>
          <CartProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                {/* Customer routes */}
                <Route path="/" element={<Landing />} />
                <Route path="/tshirts" element={<TShirts />} />
                <Route path="/tshirts/:id" element={<TShirtDetail />} />
                <Route path="/jewellery" element={<Jewellery />} />
                <Route path="/jewellery/:id" element={<JewelleryDetail />} />
                <Route path="/login" element={<Login />} />
                <Route path="/cart" element={<ProtectedRoute><Cart /></ProtectedRoute>} />
                <Route path="/checkout" element={<ProtectedRoute><Checkout /></ProtectedRoute>} />

                {/* Admin routes */}
                <Route path="/admin/login" element={<AdminLogin />} />
                <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                  <Route index element={<Dashboard />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="orders" element={<OrderManagement />} />
                  <Route path="categories" element={<CategoryManagement />} />
                  <Route path="products/:type" element={<ProductManagement />} />
                  <Route path="products/:type/add" element={<AddTshirt />} />
                  <Route path="products/:type/edit/:id" element={<AddTshirt />} />
                  <Route path="promos" element={<PromoManagement />} />
                </Route>

                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </CartProvider>
        </AuthProvider>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
