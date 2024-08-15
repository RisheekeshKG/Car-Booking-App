import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useState } from "react";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import History from "./components/History";
import Contact from "./components/Contact";
import About from "./components/About";
import Admin from "./components/Admin";
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.bundle.min';
import './App.css';

function App() {
    const [username, setUsername] = useState('');
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Login setUsername={setUsername} />} />
                <Route path="/Dashboard" element={<Dashboard username={username} />} />
                <Route path="/History" element={<History username={username} />} />
                <Route path="/Contact" element={<Contact />} />
                <Route path="/About" element={<About />} />
                <Route path="/Admin" element={<Admin />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
