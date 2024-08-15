
import Navbar from "./Navbar";
import "../App.css"

function About(){
    return(
        <div className="about1">
        <Navbar />
    <div className="container about-section">
        <h2>About Us</h2><hr/>
        <h3>Our Mission</h3>
        <p>Our mission is to build a car booking app for guests who are visiting our college.</p>
        <div className="row justify-content-center">
            <div className="col-md-3 col-sm-6 team-profile">
                <img src="https://via.placeholder.com/150" alt="Team Member"/>
                <h5>Risheekesh K G</h5>
                <p>Backend-Dev</p>
            </div>
            <div className="col-md-3 col-sm-6 team-profile">
                <img src="https://via.placeholder.com/150" alt="Team Member"/>
                <h5>Harikrishna S</h5>
                <p>Frontend-Dev</p>
            </div>
            <div className="col-md-3 col-sm-6 team-profile">
                <img src="https://via.placeholder.com/150" alt="Team Member"/>
                <h5>Gautham Prasath S</h5>
                <p>XXXXX</p>
            </div>
            <div className="col-md-3 col-sm-6 team-profile">
                <img src="https://via.placeholder.com/150" alt="Team Member"/>
                <h5>Chandhru R</h5>
                <p>XXXXX</p>
            </div>
        </div>
    </div></div>
    )
}
export default About;