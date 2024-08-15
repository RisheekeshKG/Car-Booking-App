import { useState, useEffect } from 'react';

import Navbar from "./Navbar";

function History() {
    const [historyData, setHistoryData] = useState([]);
    const [loading, setLoading] = useState(true);
    const username = localStorage.getItem('username'); 

    useEffect(() => {
        const fetchHistory = async () => {
            try {
                const response = await fetch(`http://localhost:3000/api/bookings/history?user=${username}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include' 
                });
                if (response.ok) {
                    const data = await response.json();
                    setHistoryData(data);
                } else {
                    throw new Error('Failed to fetch data');
                }
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        if (username) {
            fetchHistory();
        } else {
            setLoading(false);
        }
    }, [username]);

    return (
        <div className="his1">
            <Navbar username={username} />
            <div className="table-holder">
                <h2>History</h2>
                {loading ? (
                    <p>Loading...</p>
                ) : (
                    <table className="table table-dark table-hover custom-table table-striped .table-responsive{-sm|-md|-lg|-xl}">
                        <thead>
                            <tr id="tr">
                                <th className="custom-th" scope="col">Guest Name</th>
                                <th className="custom-th" scope="col">Date</th>
                                <th className="custom-th" scope="col">Booked Time</th>
                                <th className="custom-th" scope="col">Guest Role</th>
                                <th className="custom-th" scope="col">Reference</th>
                                <th className="custom-th" scope="col">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {historyData.map((item, index) => (
                                <tr key={index} className="table-light">
                                    <td>{item.GuestName}</td>
                                    <td>{item.bookingDate.slice(0,10)}</td>
                                    <td>{`${item.bookedTimeSlots.from} - ${item.bookedTimeSlots.to}`}</td>
                                    <td>{item.GuestRole}</td>
                                    <td>{item.Reference}</td>
                                    <td>{item.Status}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    );
}

export default History;
