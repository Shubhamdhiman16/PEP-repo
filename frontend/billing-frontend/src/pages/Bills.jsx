import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBills, deleteBill } from "../services/billingService";

function Bills() {
  const [bills, setBills] = useState([]);

  const fetchBills = async () => {
    try {
      const data = await getBills();
      setBills(data);
    } catch (error) {
      console.error("Error fetching bills", error);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteBill(id);
      alert("Bill deleted");
      fetchBills(); // refresh list
    } catch (error) {
      alert("Failed to delete bill");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div style={{ padding: "30px" }}>
        <h2>All Bills</h2>

        <table
          border="1"
          cellPadding="10"
          style={{ marginTop: "20px", width: "100%" }}
        >
          <thead>
            <tr>
              <th>Customer Name</th>
              <th>Total Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="3">No bills found</td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.customerName}</td>
                  <td>{bill.totalAmount}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(bill._id)}
                      style={{
                        background: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Bills;
