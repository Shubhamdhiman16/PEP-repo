import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBills, updateBill } from "../services/billingService";

function EditBill() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [bill, setBill] = useState({
    customerName: "",
    totalAmount: "",
  });

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const bills = await getBills();
        const currentBill = bills.find((b) => b._id === id);
        if (currentBill) setBill(currentBill);
      } catch (error) {
        console.error("Error fetching bill", error);
      }
    };

    fetchBill();
  }, [id]);

  const handleChange = (e) => {
    setBill({
      ...bill,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await updateBill(id, bill);
      alert("Bill updated successfully");
      navigate("/bills");
    } catch (error) {
      alert("Failed to update bill");
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2>Edit Bill</h2>

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
            Update Bill
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditBill;
