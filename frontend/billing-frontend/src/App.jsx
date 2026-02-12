import { BrowserRouter, Routes, Route } from "react-router-dom";
<<<<<<< HEAD
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";
=======
>>>>>>> f9c3014ef43bfc89bcaa852c26f65b0626f714bf
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateBill from "./pages/CreateBill";
import Bills from "./pages/Bills";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/create-bill"
          element={
            <ProtectedRoute>
              <CreateBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD
        {/* Admin Protected Routes */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
        />

=======
>>>>>>> f9c3014ef43bfc89bcaa852c26f65b0626f714bf
      </Routes>
    </BrowserRouter>
  );
}

export default App;
