import Navbar from "../components/Navbar";

function Dashboard() {
  return (
    <div>
      <Navbar />
      <div style={{ padding: "30px" }}>
        <h2>User Dashboard</h2>
        <p>Welcome to the billing system.</p>
      </div>
    </div>
  );
}

export default Dashboard;
