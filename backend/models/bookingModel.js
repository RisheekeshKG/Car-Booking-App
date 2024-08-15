const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
    GuestName: { type: String },
    bookingDate: { type: Date, default: Date.now },
    bookedTimeSlots: {
        from: { type: String },
        to: { type: String }
    },
    totalHours: { type: Number },
    Reference: { type: String },
    Status: { type: String, default: "Pending" },
    username: { type: String, default: "-" },
    GuestRole: { type: String },
    DropPickupPoint: { type: String }
}, { timestamps: true });

const BookingModel = mongoose.model('bookings', bookingSchema);

module.exports = BookingModel;
