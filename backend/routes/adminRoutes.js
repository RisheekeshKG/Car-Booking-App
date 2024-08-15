const express = require('express')
const router = express.Router();
const Booking = require("../models/bookingModel");



router.get('/dashboard',async (req, res) => {
    try {
        
        const ExistingBookings = await Booking.find({ Status: "Pending" })
        res.status(200).json(ExistingBookings)

        } 
        
    catch (error) 
    {
        console.log(error)
        res.status(500).json({ error: 'Server error' }); 
    }
});

  router.put('/decision', async (req, res) => {
    try {
        const { objectId, status } = req.body;
        await Booking.findByIdAndUpdate(objectId, { Status: status });
        console.log("YES")
        res.status(200).json({ message: 'Decision made successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Server error' });
    }
});


module.exports = router