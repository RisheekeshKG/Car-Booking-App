import { useState } from 'react';
import '../App.css';

import Navbar from './Navbar';

function Dashboard() {
    const [GuestName, setGuestName] = useState('');
    const [GuestRole, setGuestRole] = useState('');
    const [bookingDate, setBookingDate] = useState('');
    const [bookedTimeSlots, setBookingTimeSlots] = useState({ from: '', to: '' });
    const [Reference, setReference] = useState('');
    const [PickupPoint, setPickupPoint] = useState('');
    const [DropPoint, setDropPoint] = useState('');
    const [file, setFile] = useState(null); // New state for the file
    const [error, setError] = useState(null);
    const username = localStorage.getItem('username');

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        const formData = new FormData();
        formData.append("GuestName", GuestName);
        formData.append("GuestRole", GuestRole);
        formData.append("bookingDate", bookingDate);
        formData.append("from", bookedTimeSlots.from);
        formData.append("to", bookedTimeSlots.to);
        formData.append("Reference", Reference);
        formData.append("PickupPoint",PickupPoint);
        formData.append("DropPoint", DropPoint);
        formData.append("username", username);
        formData.append("file", file); // Append the file

        try {
            const response = await fetch("http://localhost:3000/api/bookings/bookcar", {
                method: 'POST',
                body: formData, // Send form data with file
            });
            if (response.ok) {
                alert("Booking successful");
                // Optionally, reset the form
                setGuestName('');
                setGuestRole('');
                setBookingDate('');
                setBookingTimeSlots({ from: '', to: '' });
                setReference('');
                setPickupPoint('');
                setDropPoint('');
                setFile(null); // Reset the file input
            } else {
                const data = await response.json();
                setError(data.message || "An error occurred. Please try again.");
            }
        } catch (error) {
            setError("An error occurred. Please try again.");
        }
    };

    return (
        <div className='dash1'>
            <Navbar />
            <form onSubmit={handleSubmit} encType="multipart/form-data"> {/* Add encType */}
                <h2 className='h2'>Booking </h2>
                <hr />
                {error && <div className="alert alert-danger">{error}</div>}
                <div className="mb-3">
                    <label htmlFor="GuestName" className="form-label">Guest Name</label>
                    <input type="text" className="form-control" id="GuestName" placeholder="Guest Name" value={GuestName} onChange={(e) => setGuestName(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="GuestRole" className="form-label">Guest Role</label>
                    <input type="text" className="form-control" id="GuestRole" placeholder="Ex: CTO of XXX company" value={GuestRole} onChange={(e) => setGuestRole(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="BookingDate" className="form-label">Booking Date</label>
                    <input type="date" className="form-control" id="BookingDate" value={bookingDate} onChange={(e) => setBookingDate(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="BookingTimefrom" className="form-label">Booking Timings</label>
                    <input type="time" className="form-control" id="BookingTimefrom" value={bookedTimeSlots.from} onChange={(e) => setBookingTimeSlots({ ...bookedTimeSlots, from: e.target.value })} required />
                    <label htmlFor="BookingTimeto" className="form-label"> To </label>
                    <input type="time" className="form-control" id="BookingTimeto" value={bookedTimeSlots.to} onChange={(e) => setBookingTimeSlots({ ...bookedTimeSlots, to: e.target.value })} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="Reference" className="form-label">Reference</label>
                    <input type="text" className="form-control" id="Reference" placeholder="Reference" value={Reference} onChange={(e) => setReference(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="DropPickupPoint" className="form-label">Pickup Point</label>
                    <input type="text" className="form-control" id="DropPickupPoint" placeholder="Place Name" value={PickupPoint} onChange={(e) => setPickupPoint(e.target.value)} required />
                </div>
                <div className="mb-3">
                    <label htmlFor="DropPickupPoint" className="form-label">Drop Point</label>
                    <input type="text" className="form-control" id="DropPickupPoint" placeholder="Place Name" value={DropPoint} onChange={(e) => setDropPoint(e.target.value)} required />
                </div>
                <div className="mb-3"> {/* New file input */}
                    <label htmlFor="file" className="form-label">Upload PDF</label>
                    <input type="file" className="form-control" id="file" onChange={(e) => setFile(e.target.files[0])} required />
                </div>
                <button type="submit" className="btn btn-dark"> Book </button>
            </form>
        </div>
    );
}

export default Dashboard;
