
import Navbar from "./Navbar";
import "../App.css"

function Contact(){
    return(
        <div className="con1">
      <Navbar />
    <div className="container contact-section">
        <h2>Contact Us</h2>
        <div className="contact-details">
            <p><i className="bi bi-person icon"></i>Admin Name: John Doe</p>
            <p><i className="bi bi-telephone icon"></i>Phone Number: +123 456 7890</p>
        </div>
    </div>
        </div>
    )
}

export default Contact;