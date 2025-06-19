const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require("../models/user");

const router = express.Router();

router.post("/register", async (req, res) => {
    console.log("Received Data:", req.body);

    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).json({ message: "All fields are required" });
    }
    try {
        const user = await User.findOne({ email });
        if (user) return res.status(400).json({ message: "User already exists" });

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ username, email, password: hashedPassword });

        await newUser.save();
        console.log("New user registered:", username, email);
        res.status(201).json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Registration Error:", error);
        res.status(500).json({ message: "Server error", error: error.message });
    }
});
router.get("/profile", async (req, res) => {
    try {
        const token = req.headers.authorization.split(" ")[1]; // Extract token
        const userId = jwt.verify(token, process.env.JWT_SECRET).id; // Verify JWT token
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json({
            correct: user.correctAnswers,
            wrong: user.wrongAnswers,
            attempted: user.attemptedQuestions,
        });
    } catch (error) {
        console.error("Error fetching user profile stats:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/login", async (req, res)=>{
    const { email, password } = req.body;

    try {
        const user = await User.findOne({email});
        if (!user) return res.status(400).json({message: "User not found"});

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({message: "Invalid credentials"});

        const token = jwt.sign({id: user._id}, process.env.JWT_SECRET, { expiresIn: "1h"});
        res.json({token, user});
    } catch (error) {
        res.status(500).json({message: "Server error"});
    }
});

module.exports = router;