import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createBill } from "../services/billingService";

function CreateBill() {
  const [bill, setBill] = useState({
    customerName: "",
    totalAmount: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setBill({
      ...bill,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await createBill(bill);
      alert("Bill created successfully!");
      navigate("/bills");
    } catch (error) {
      alert("Failed to create bill");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2>Create Bill</h2>

        <form
          onSubmit={handleSubmit}
          style={{
            maxWidth: "400px",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <input
            type="text"
            name="customerName"
            placeholder="Customer Name"
            value={bill.customerName}
            onChange={handleChange}
            required
          />

          <input
            type="number"
            name="totalAmount"
            placeholder="Total Amount"
            value={bill.totalAmount}
            onChange={handleChange}
            required
          />

          <button
            type="submit"
            style={{
              padding: "10px",
              background: "#4a90e2",
              color: "white",
              border: "none",
              cursor: "pointer",
            }}
          >
            Save Bill
          </button>
        </form>
      </div>
    </div>
  );
}

export default CreateBill;
