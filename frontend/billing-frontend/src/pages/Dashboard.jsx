import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBills } from "../services/billingService";

function Dashboard() {
  const [bills, setBills] = useState([]);

  useEffect(() => {
    const fetchBills = async () => {
      try {
        const data = await getBills();
        setBills(data);
      } catch (error) {
        console.error("Error fetching bills", error);
      }
    };

    fetchBills();
  }, []);

  const totalBills = bills.length;
  const totalAmount = bills.reduce(
    (sum, bill) => sum + Number(bill.totalAmount),
    0
  );

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2>User Dashboard</h2>

        <div
          style={{
            display: "flex",
            gap: "20px",
            marginTop: "20px",
          }}
        >
          {/* Total Bills Card */}
          <div
            style={{
              padding: "20px",
              background: "#4a90e2",
              color: "white",
              borderRadius: "8px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <h3>Total Bills</h3>
            <p style={{ fontSize: "24px" }}>{totalBills}</p>
          </div>

          {/* Total Amount Card */}
          <div
            style={{
              padding: "20px",
              background: "#6a5acd",
              color: "white",
              borderRadius: "8px",
              width: "200px",
              textAlign: "center",
            }}
          >
            <h3>Total Amount</h3>
            <p style={{ fontSize: "24px" }}>₹{totalAmount}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
