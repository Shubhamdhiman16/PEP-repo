import { Link, useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <nav
      style={{
        padding: "15px",
        background: "#4a90e2",
        color: "white",
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <h3>Billing System</h3>

      <div>
        <Link to="/dashboard" style={{ color: "white", marginRight: "15px" }}>
          Dashboard
        </Link>

        <Link to="/bills" style={{ color: "white", marginRight: "15px" }}>
          Bills
        </Link>

        <Link
          to="/create-bill"
          style={{ color: "white", marginRight: "15px" }}
        >
          Create Bill
        </Link>

        <button
          onClick={handleLogout}
          style={{
            background: "red",
            color: "white",
            border: "none",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
