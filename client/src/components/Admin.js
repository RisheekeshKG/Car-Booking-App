import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBookingId, setEditingBookingId] = useState(null);
  const [driverDetails, setDriverDetails] = useState({
    driverAlloted: "",
    driverNumber: "",
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/dashboard",
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
          setBookings(data);
        } else {
          throw new Error("Failed to fetch bookings");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const handleDecision = async (objectId, status) => {
    if (status === "Accepted" && editingBookingId === objectId) {
      const { driverAlloted, driverNumber } = driverDetails;

      if (!driverAlloted || !driverNumber) {
        alert(
          "Both driver name and number must be provided before accepting the booking."
        );
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/decision",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              objectId,
              status,
              driverAlloted,
              driverNumber,
            }),
          }
        );

        if (response.ok) {
          const updatedBookings = bookings.map((booking) => {
            if (booking._id === objectId) {
              return {
                ...booking,
                Status: status,
                driverAlloted,
                driverNumber,
              };
            }
            return booking;
          });
          setBookings(updatedBookings);
          setEditingBookingId(null);
          setDriverDetails({ driverAlloted: "", driverNumber: "" });
        } else {
          throw new Error("Failed to update status");
        }
      } catch (error) {
        console.error(error);
      }
    } else if (status === "Rejected") {
      // Handle rejection without needing driver details
      try {
        const response = await fetch(
          "http://localhost:3000/api/admin/decision",
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ objectId, status }),
          }
        );

        if (response.ok) {
          const updatedBookings = bookings.map((booking) => {
            if (booking._id === objectId) {
              return { ...booking, Status: status };
            }
            return booking;
          });
          setBookings(updatedBookings);
        } else {
          throw new Error("Failed to update status");
        }
      } catch (error) {
        console.error(error);
      }
    }
  };

  const handleEdit = (objectId) => {
    setEditingBookingId(objectId);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setDriverDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/api/users/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        navigate("/");
      } else {
        throw new Error("Failed to logout");
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="admin">
      <div className="container logout-section">
        <div>Welcome, Admin</div>
        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
      <div className="container dashboard-section">
        <h2>Admin Dashboard</h2>
        <div className="table-responsive">
          <table className="table table-dark table-hover">
            <thead>
              <tr>
                <th scope="col">Guest Name</th>
                <th scope="col">Date</th>
                <th scope="col">Booking Timings</th>
                <th scope="col">Guest Role</th>
                <th scope="col">Reference</th>
                <th scope="col">PDF</th>
                <th scope="col">Status</th>
                <th scope="col">Driver Allotted</th>
                <th scope="col">Driver Number</th>
                <th scope="col">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="10">Loading...</td>
                </tr>
              ) : (
                bookings.map((booking) => (
                  <tr key={booking._id}>
                    <td>{booking.GuestName}</td>
                    <td>
                      {booking.bookingDate
                        ? booking.bookingDate.slice(0, 10)
                        : "N/A"}
                    </td>
                    <td>
                      {booking.bookedTimeSlots &&
                      booking.bookedTimeSlots.from &&
                      booking.bookedTimeSlots.to
                        ? `${booking.bookedTimeSlots.from} - ${booking.bookedTimeSlots.to}`
                        : "N/A"}
                    </td>
                    <td>{booking.GuestRole || "N/A"}</td>
                    <td>{booking.Reference || "N/A"}</td>
                    <td>
                      {booking.pdfFileName ? (
                        <a
                          href={`http://localhost:3000/api/admin/files/${booking.pdfFileName}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          View PDF
                        </a>
                      ) : (
                        "No PDF"
                      )}
                    </td>
                    <td>{booking.Status || "N/A"}</td>
                    <td>
                      {editingBookingId === booking._id ? (
                        <input
                          type="text"
                          name="driverAlloted"
                          value={driverDetails.driverAlloted}
                          onChange={handleInputChange}
                          placeholder="Enter driver name"
                        />
                      ) : (
                        booking.driverAlloted || "N/A"
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking._id ? (
                        <input
                          type="text"
                          name="driverNumber"
                          value={driverDetails.driverNumber}
                          onChange={handleInputChange}
                          placeholder="Enter driver number"
                        />
                      ) : (
                        booking.driverNumber || "N/A"
                      )}
                    </td>
                    <td>
                      {editingBookingId === booking._id ? (
                        <button
                          className="btn btn-save btn-sm"
                          onClick={() =>
                            handleDecision(booking._id, "Accepted")
                          }
                        >
                          Save & Accept
                        </button>
                      ) : (
                        <>
                          <button
                            className="btn btn-accept btn-sm"
                            onClick={() => handleEdit(booking._id)}
                          >
                            Assign & Accept
                          </button>
                          <button
                            className="btn btn-reject btn-sm"
                            onClick={() =>
                              handleDecision(booking._id, "Rejected")
                            }
                          >
                            Reject
                          </button>
                        </>
                      )}
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

export default Admin;
