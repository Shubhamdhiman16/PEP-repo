import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { getBills, deleteBill } from "../services/billingService";

function Bills() {
  const [bills, setBills] = useState([]);
  const navigate = useNavigate();

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
      alert("Bill deleted successfully");
      fetchBills();
    } catch (error) {
      alert("Failed to delete bill");
      console.error(error);
    }
  };

  return (
    <div>
      <Navbar />

      <div className="page-container">
        <div className="card">
          <h2>All Bills</h2>

          <table className="table">
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
                  <td colSpan="3" style={{ textAlign: "center" }}>
                    No bills found
                  </td>
                </tr>
              ) : (
                bills.map((bill) => (
                  <tr key={bill._id}>
                    <td>{bill.customerName}</td>
                    <td>₹{bill.totalAmount}</td>
                    <td>
                      <button
                        className="btn btn-view"
                        onClick={() =>
                          navigate(`/view-bill/${bill._id}`)
                        }
                      >
                        View
                      </button>

                      <button
                        className="btn btn-edit"
                        style={{ marginLeft: "5px" }}
                        onClick={() =>
                          navigate(`/edit-bill/${bill._id}`)
                        }
                      >
                        Edit
                      </button>

                      <button
                        className="btn btn-delete"
                        style={{ marginLeft: "5px" }}
                        onClick={() => handleDelete(bill._id)}
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
    </div>
  );
}

export default Bills;
