import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Admin() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const response = await fetch('http://localhost:3000/api/admin/dashboard', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    console.log(data)
                    setBookings(data);
                } else {
                    throw new Error('Failed to fetch bookings');
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
        try {
            const response = await fetch('http://localhost:3000/api/admin/decision', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ objectId, status }),
            });

            if (response.ok) {
                const updatedBookings = bookings.map(booking => {
                    if (booking._id === objectId) {
                        return { ...booking, Status: status };
                    }
                    console.log(booking)
                    return booking;
                });
                setBookings(updatedBookings);
            } else {
                throw new Error('Failed to update status');
            }
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = async () => {
        try {
            const response = await fetch('http://localhost:3000/api/users/logout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                navigate('/');
            } else {
                throw new Error('Failed to logout');
            }
        } catch (error) {
            console.error(error);
        }
    };

    return (
        <div className="admin">
            <div className="container logout-section">
                <div>Welcome, Admin</div>
                <button className="logout-btn" onClick={handleLogout}>Logout</button>
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
                                <th scope="col">PDF</th> {/* Added PDF column */}
                                <th scope="col">Status</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="8">Loading...</td> {/* Updated colspan */}
                                </tr>
                            ) : (
                                bookings.map(booking => (
                                    <tr key={booking._id}>
                                        <td>{booking.GuestName}</td>
                                        <td>{booking.bookingDate ? booking.bookingDate.slice(0, 10) : 'N/A'}</td>
                                        <td>
                                            {booking.bookedTimeSlots && booking.bookedTimeSlots.from && booking.bookedTimeSlots.to
                                                ? `${booking.bookedTimeSlots.from} - ${booking.bookedTimeSlots.to}`
                                                : 'N/A'}
                                        </td>
                                        <td>{booking.GuestRole || 'N/A'}</td>
                                        <td>{booking.Reference || 'N/A'}</td>
                                        <td>
                                            {booking.pdfFileName ? (
                                                
                                                <a href={`http://localhost:3000/api/admin/files/${booking.pdfFileName}`} target="_blank" rel="noopener noreferrer">View PDF</a>
                                            ) : (
                                                'No PDF'
                                            )}
                                        </td>
                                        <td>{booking.Status || 'N/A'}</td>
                                        <td>
                                            <button className="btn btn-accept btn-sm" onClick={() => handleDecision(booking._id, 'Accepted')}>Accept</button>
                                            <button className="btn btn-reject btn-sm" onClick={() => handleDecision(booking._id, 'Rejected')}>Reject</button>
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
