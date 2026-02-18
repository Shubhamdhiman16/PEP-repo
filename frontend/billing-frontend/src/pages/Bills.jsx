import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { getBills } from "../services/billingService";

function Bills() {
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
            </tr>
          </thead>
          <tbody>
            {bills.length === 0 ? (
              <tr>
                <td colSpan="2">No bills found</td>
              </tr>
            ) : (
              bills.map((bill) => (
                <tr key={bill._id}>
                  <td>{bill.customerName}</td>
                  <td>{bill.totalAmount}</td>
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
