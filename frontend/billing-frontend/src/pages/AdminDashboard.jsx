
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

function AdminDashboard() {
    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="card">
                    <h2>Admin Dashboard</h2>
                    <p>Welcome, Admin! Manage your system here.</p>

                    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "20px", marginTop: "20px" }}>

                        <Link to="/admin/products" style={{ textDecoration: "none" }}>
                            <div className="card" style={{ background: "#f8f9fa", textAlign: "center", cursor: "pointer" }}>
                                <h3>📦 Manage Products</h3>
                                <p>Add, Edit, Delete Products</p>
                            </div>
                        </Link>

                        <Link to="/admin/reports" style={{ textDecoration: "none" }}>
                            <div className="card" style={{ background: "#f8f9fa", textAlign: "center", cursor: "pointer" }}>
                                <h3>📊 Sales Reports</h3>
                                <p>View Daily & Monthly Sales</p>
                            </div>
                        </Link>

                        <Link to="/admin/settings" style={{ textDecoration: "none" }}>
                            <div className="card" style={{ background: "#f8f9fa", textAlign: "center", cursor: "pointer" }}>
                                <h3>⚙️ Settings</h3>
                                <p>Tax Rates & Company Info</p>
                            </div>
                        </Link>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard;
