import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import "../App.css";

function Navbar({ username }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        try {
            const response = await fetch("http://localhost:3000/api/users/logout", {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include', // Ensure cookies are sent with the request
            });

            if (response.ok) {
                localStorage.removeItem('username');
                navigate("/", { replace: true })
            } else {
                console.log("Logout failed");
            }
        } catch (error) {
            console.log("An error occurred during logout", error);
        }
    };

    return (
        <nav className="navbar border-bottom border-body" data-bs-theme="dark">
            <div className="container-fluid">
            <Link className="navbar-brand" to="/Dashboard">Logo</Link>
                <button className="navbar-toggler border-bottom" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li className="nav-item">
                            <Link className="nav-link border-bottom active" aria-current="page" to="/Dashboard">Home</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link border-bottom" to="/History">History</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link border-bottom" to="/Contact">Contact</Link>
                        </li>
                        <li className="nav-item">
                            <Link className="nav-link" to="/About">About</Link>
                        </li>

                        <li className="nav-item">
                            <button className="nav-link btn btn-link" onClick={handleLogout} >Logout</button>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
