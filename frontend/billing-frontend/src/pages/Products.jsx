import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import axios from "axios";

function Products() {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({ name: "", price: "", stock: "", description: "" });
    const [editingId, setEditingId] = useState(null);

    const API_URL = "http://localhost:5000/api/products";
    const token = localStorage.getItem("token");

    // Fetch all products
    const fetchProducts = async () => {
        try {
            const res = await axios.get(API_URL, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setProducts(res.data);
        } catch (err) {
            console.error("Error fetching products", err);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle input change
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Submit form (Create or Update)
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (editingId) {
                await axios.put(`${API_URL}/${editingId}`, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Product updated successfully");
            } else {
                await axios.post(API_URL, form, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                alert("Product created successfully");
            }
            setForm({ name: "", price: "", stock: "", description: "" });
            setEditingId(null);
            fetchProducts();
        } catch (err) {
            console.error("Error saving product", err);
            alert("Failed to save product");
        }
    };

    // Edit product
    const handleEdit = (product) => {
        setForm({
            name: product.name,
            price: product.price,
            stock: product.stock,
            description: product.description,
        });
        setEditingId(product._id);
    };

    // Delete product
    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure?")) return;
        try {
            await axios.delete(`${API_URL}/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Product deleted");
            fetchProducts();
        } catch (err) {
            console.error("Error deleting product", err);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="page-container">
                <div className="card">
                    <h2>Manage Products</h2>
                    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "10px", flexWrap: "wrap", marginBottom: "20px" }}>
                        <input className="input" name="name" placeholder="Name" value={form.name} onChange={handleChange} required />
                        <input className="input" type="number" name="price" placeholder="Price" value={form.price} onChange={handleChange} required />
                        <input className="input" type="number" name="stock" placeholder="Stock" value={form.stock} onChange={handleChange} required />
                        <input className="input" name="description" placeholder="Description" value={form.description} onChange={handleChange} />
                        <button className="btn btn-primary" type="submit">{editingId ? "Update" : "Add"}</button>
                    </form>

                    <table className="table">
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Price</th>
                                <th>Stock</th>
                                <th>Description</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.map((p) => (
                                <tr key={p._id}>
                                    <td>{p.name}</td>
                                    <td>₹{p.price}</td>
                                    <td>{p.stock}</td>
                                    <td>{p.description}</td>
                                    <td>
                                        <button className="btn btn-edit" onClick={() => handleEdit(p)}>Edit</button>
                                        <button className="btn btn-delete" onClick={() => handleDelete(p._id)} style={{ marginLeft: "5px" }}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Products;
