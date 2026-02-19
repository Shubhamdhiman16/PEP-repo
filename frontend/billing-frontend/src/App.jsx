import { BrowserRouter, Routes, Route } from "react-router-dom";

<<<<<<< HEAD
// import AdminDashboard from "./pages/AdminDashboard";
// import Products from "./pages/Products";
// import Reports from "./pages/Reports";
// import Settings from "./pages/Settings";

=======
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
import EditBill from "./pages/EditBill";
import ViewBill from "./pages/ViewBill";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard"
import CreateBill from "./pages/CreateBill";
import Bills from "./pages/Bills";
import ProtectedRoute from "./components/ProtectedRoute";

<<<<<<< HEAD
=======
// Admin Pages
import AdminDashboard from "./pages/AdminDashboard";
import Products from "./pages/Products";
import CreateProduct from "./pages/CreateProduct";
import EditProduct from "./pages/EditProduct";
import Reports from "./pages/Reports";
import Settings from "./pages/Settings";

>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
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
<<<<<<< HEAD
  path="/edit-bill/:id"
  element={
    <ProtectedRoute>
      <EditBill />
    </ProtectedRoute>
  }
/>

<Route
  path="/view-bill/:id"
  element={
    <ProtectedRoute>
      <ViewBill />
    </ProtectedRoute>
  }
/>


=======
          path="/edit-bill/:id"
          element={
            <ProtectedRoute>
              <EditBill />
            </ProtectedRoute>
          }
        />

        <Route
          path="/view-bill/:id"
          element={
            <ProtectedRoute>
              <ViewBill />
            </ProtectedRoute>
          }
        />
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a

        <Route
          path="/bills"
          element={
            <ProtectedRoute>
              <Bills />
            </ProtectedRoute>
          }
        />

<<<<<<< HEAD
        {/* Admin Protected Routes
=======
        {/* Admin Protected Routes */}
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD
=======
        
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
        <Route 
          path="/admin/products"
          element={
            <ProtectedRoute>
              <Products />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD
=======
        
        <Route 
          path="/admin/create-product"
          element={
            <ProtectedRoute>
              <CreateProduct />
            </ProtectedRoute>
          }
        />
        
        <Route 
          path="/admin/edit-product/:id"
          element={
            <ProtectedRoute>
              <EditProduct />
            </ProtectedRoute>
          }
        />
        
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
        <Route 
          path="/admin/reports"
          element={
            <ProtectedRoute>
              <Reports />
            </ProtectedRoute>
          }
        />
<<<<<<< HEAD
=======
        
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
        <Route
          path="/admin/settings"
          element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          }
<<<<<<< HEAD
        /> */}
=======
        />
>>>>>>> f16144836b4f09645e574b4c3c43499b4a15368a
      </Routes>
    </BrowserRouter>
  );
}

export default App;
