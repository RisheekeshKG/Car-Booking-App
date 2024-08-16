const express = require('express')
const router = express.Router();
const Booking = require("../models/bookingModel");
const path = require('path');
const fs = require('fs');

router.use('/files', express.static(path.join(__dirname, 'files')));


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

router.get('/files/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join(__dirname, '..', 'files', filename);

    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (err) {
            console.error(`File not found: ${filePath}`);
            return res.status(404).json({ error: 'File not found' });
        }
        console.log(filePath)
        res.sendFile(filePath);
    });
});


module.exports = router