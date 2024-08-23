const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");
const path = require("path");
const fs = require("fs");
const nodemailer = require("nodemailer");
const dot = require("dotenv").config()

router.use("/files", express.static(path.join(__dirname, "files")));

// Set up Nodemailer transporter
const transporter = nodemailer.createTransport({
  service:"gmail",
  host : "smtp.gmail.com",
  port : "465", 
  secure:true,
  auth: {
    user: dot.parsed.EMAIL_USER,
    pass: dot.parsed.EMAIL_PASS,
  },
});

router.get("/dashboard", async (req, res) => {
  try {
    const ExistingBookings = await Booking.find({ Status: "Pending" });
    res.status(200).json(ExistingBookings);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.put("/decision", async (req, res) => {
  try {
    const { objectId, status, driverAlloted, driverNumber } = req.body;


    if (status === "Accepted" && (!driverAlloted || !driverNumber)) {
      return res.status(400).json({
        error: "Driver name and number must be provided when accepting a booking.",
      });
    }


    const updatedBooking = await Booking.findByIdAndUpdate(
      objectId,
      {
        Status: status,
        driverAlloted,
        driverNumber,
      },
      { new: true } 
    );

    if (!updatedBooking) {
      return res.status(404).json({ error: "Booking not found" });
    }
//updatedBooking.username
    const emailOptions = {
      from: dot.parsed.EMAIL_USER, 
      to: "rishikesh9894318193@gmail.com", 
      subject: `Booking ${status}`,
      text: `Dear ${updatedBooking.GuestName},\n\nYour booking with reference ${updatedBooking.Reference} has been ${status.toLowerCase()}.\n\n${
        status === "Accepted"
          ? `Driver Alloted: ${driverAlloted}\nDriver Number: ${driverNumber}`
          : "We apologize for the inconvenience."
      }\n\nBest Regards,\nCar Booking Service`,
    };

    transporter.sendMail(emailOptions, (error, info) => {
      if (error) {
        console.error("Error sending email: ", error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });

    res.status(200).json({ message: "Decision made successfully", booking: updatedBooking });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
});

router.get("/files/:filename", (req, res) => {
  const filename = req.params.filename;
  const filePath = path.join(__dirname, "..", "files", filename);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      console.error(`File not found: ${filePath}`);
      return res.status(404).json({ error: "File not found" });
    }
    console.log(filePath);
    res.sendFile(filePath);
  });
});

module.exports = router;
