const express = require("express");
const router = express.Router();
const multer = require("multer");
const Booking = require("../models/bookingModel");

router.use(express.json());
router.use("/files", express.static("files"));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./files");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + file.originalname;
    cb(null, uniqueSuffix);
  },
});

const upload = multer({ storage: storage });

router.post("/bookcar", upload.single("file"), async (req, res) => {
  try {
    const bookedTimeSlots = {
      from: req.body.from,
      to: req.body.to,
    };

    const totalHours = calculateTotalHours(
      bookedTimeSlots.from,
      bookedTimeSlots.to
    );

    const newBooking = new Booking({
      GuestName: req.body.GuestName,
      bookingDate: req.body.bookingDate,
      bookedTimeSlots: bookedTimeSlots,
      totalHours: totalHours,
      Reference: req.body.Reference,
      Status: "Pending",
      username: req.body.username,
      GuestRole: req.body.GuestRole,
      DropPickupPoint: req.body.DropPickupPoint,
      pdfTitle: req.body.pdfTitle,
      pdfFileName: req.file.filename,
    });

    await newBooking.save();
    res.status(201).send(newBooking);
  } catch (error) {
    console.error("Booking Error: ", error);
    res.status(500).send("Booking failed");
  }
});

router.get("/history", async (req, res) => {
  try {
    const history = await Booking.find({ username: req.query.user });
    res.status(200).json(history);
  } catch (error) {
    console.error("Fetch History Error: ", error);
    res.status(400).send("History can't be fetched");
  }
});

function calculateTotalHours(from, to) {
  const fromTime = new Date(`1970-01-01T${from}:00`);
  const toTime = new Date(`1970-01-01T${to}:00`);
  const difference = (toTime - fromTime) / 1000 / 60 / 60;
  return difference > 0 ? difference : null;
}

module.exports = router;
