const express = require("express");
const router = express.Router();
const Booking = require("../models/bookingModel");


router.use(express.json());


router.post("/bookcar", async (req, res) => {
    try {
        console.log("Request Body: ", req.body); 
        const newBooking = new Booking(req.body); 
        await newBooking.save(); 
        res.status(201).send(newBooking); 
    } catch (error) {
        console.error("Booking Error: ", error); 
        res.status(500).send("Booking failed"); 
    }
});

// Route to handle fetching booking history
router.get("/history", async (req, res) => {
    console.log("Query Parameters: ", req.query); 
    try {
        const history = await Booking.find({ username: req.query.user }); 
        console.log("Booking History: ", history); 
        res.status(200).json(history); 
    } catch (error) {
        console.error("Fetch History Error: ", error); 
        res.status(400).send("History can't be fetched"); 
    }
});

module.exports = router;
