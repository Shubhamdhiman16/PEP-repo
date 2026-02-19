import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBills } from "../services/billingService";

function ViewBill() {
  const { id } = useParams();
  const [bill, setBill] = useState(null);

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const bills = await getBills();
        const currentBill = bills.find((b) => b._id === id);
        setBill(currentBill);
      } catch (error) {
        console.error("Error fetching bill", error);
      }
    };

    fetchBill();
  }, [id]);

  if (!bill) {
    return (
      <div>
        <Navbar />
        <div style={{ padding: "30px" }}>Loading bill...</div>
      </div>
    );
  }

  return (
    <div>
      <Navbar />

      <div
        style={{
          padding: "30px",
          maxWidth: "600px",
          margin: "40px auto",
          border: "1px solid #ddd",
          borderRadius: "8px",
          background: "#fff",
        }}
      >
        <h2 style={{ textAlign: "center" }}>Invoice</h2>

        <hr />

        <p>
          <strong>Customer Name:</strong> {bill.customerName}
        </p>

        <p>
          <strong>Total Amount:</strong> ₹{bill.totalAmount}
        </p>

        <hr />

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          Thank you for your business!
        </p>
      </div>
    </div>
  );
}

export default ViewBill;
