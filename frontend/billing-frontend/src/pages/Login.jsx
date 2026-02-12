<<<<<<< HEAD
function Login() {
  return (
    <div>
      <h2>Login Page</h2>
=======
import { useState } from "react";
import { Link } from "react-router-dom";
import "./Login.css";

function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="login-wrapper">
      {/* Left Side */}
      <div className="login-left">
        <h1>Billing System</h1>
        <p>Manage your invoices and billing operations efficiently.</p>
      </div>

      {/* Right Side */}
      <div className="login-right">
        <form className="login-card" onSubmit={handleSubmit}>
          <h2>Welcome Back</h2>

          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit">Login</button>

          <p className="register-text">
            Don’t have an account? <Link to="/register">Sign up</Link>
          </p>
        </form>
      </div>
>>>>>>> f9c3014ef43bfc89bcaa852c26f65b0626f714bf
    </div>
  );
}

export default Login;
