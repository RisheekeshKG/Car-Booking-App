const express = require("express");
const router = express.Router();
const User = require("../models/userModel");

router.post("/login", async (req, res) => {
    const { username, password } = req.body;
    try {
        const user = await User.findOne({ username, password });
        if (user) {
            req.session.user = { username: user.username, role: user.role };
            console.log(req.session.user);
            console.log(`User Logging In as ${user.role}`);

            res.status(200).json({ user: user.username, role: user.role });
        } else {
            console.log("Username or Password Incorrect");
            return res.status(401).json({ message: "Username or Password is incorrect" });
        }
    } catch (error) {
        console.log(`User didn't log in: ${error}`);
        return res.status(400).json({ message: "Login failed", error });
    }
});

router.post("/register", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await User.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ message: "Username already exists" });
        }

        const newUser = new User({ username, password });
        await newUser.save();
        console.log("Registering");
        res.status(200).json({ message: "Registered successfully" });
    } catch (error) {
        console.log(`Registration failed: ${error}`);
        return res.status(400).json({ message: "Registration failed", error });
    }
});

router.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log(`Logout failed: ${err}`);
            return res.status(500).json({ message: "Logout failed", error: err });
        }
        res.clearCookie("connect.sid"); 
        res.status(200).json({ message: "Logged out successfully" });
    });
});

module.exports = router;
