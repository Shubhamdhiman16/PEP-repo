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

      <div className="page-container">
        <div
          className="card"
          style={{
            maxWidth: "500px",
            margin: "40px auto",
          }}
        >
          <h2>Create New Bill</h2>

          <form
            onSubmit={handleSubmit}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <div>
              <label style={{ fontWeight: "bold" }}>
                Customer Name
              </label>
              <input
                type="text"
                name="customerName"
                placeholder="Enter customer name"
                value={bill.customerName}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <div>
              <label style={{ fontWeight: "bold" }}>
                Total Amount
              </label>
              <input
                type="number"
                name="totalAmount"
                placeholder="Enter total amount"
                value={bill.totalAmount}
                onChange={handleChange}
                required
                className="input"
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Save Bill
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default CreateBill;
