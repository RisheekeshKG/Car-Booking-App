const express = require("express");
const router = express.Router();
const multer = require("multer");
const Booking = require("../models/bookingModel");

router.use(express.json());
router.use("/files", express.static("files")); 

// Set up multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files"); // Save files in the 'files' directory
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix); // Create a unique filename
  },
});

const upload = multer({ storage: storage });

// Route to handle booking and PDF upload
router.post("/bookcar", upload.single("file"), async (req, res) => {
  try {
    const newBooking = new Booking({
      GuestName: req.body.GuestName,
      bookedTimeSlots: req.body.bookedTimeSlots,
      totalHours: req.body.totalHours,
      Reference: req.body.Reference,
      Status: req.body.Status,
      username: req.body.username,
      GuestRole: req.body.GuestRole,
      DropPickupPoint: req.body.DropPickupPoint,
      pdfTitle: req.body.title, // Store PDF title
      pdfFileName: req.file.filename // Store PDF filename
    });

    await newBooking.save();
    res.status(201).send(newBooking);
  } catch (error) {
    console.error("Booking Error: ", error);
    res.status(500).send("Booking failed");
  }
});

// Route to handle fetching booking history
router.get("/history", async (req, res) => {
  try {
    const history = await Booking.find({ username: req.query.user });
    res.status(200).json(history);
  } catch (error) {
    console.error("Fetch History Error: ", error);
    res.status(400).send("History can't be fetched");
  }
});

module.exports = router;
