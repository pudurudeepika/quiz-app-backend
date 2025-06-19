

const express = require('express');
const Quiz = require("../models/quiz");

const router = express.Router();

router.get("/", async (req, res) => {
    try {
        const quizzes = await Quiz.find();
        res.json(quizzes);
    } catch (error) {
        console.error("Error fetching quizzes:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.post("/bulk", async (req, res) => {
    try {
        const quizzes = req.body; // Expecting an array of quizzes
        if (!Array.isArray(quizzes) || quizzes.length === 0) {
            return res.status(400).json({ error: "Invalid input. Expected an array of quizzes." });
        }

        await Quiz.insertMany(quizzes); // Bulk insert all questions
        res.status(200).json({ message: "Quizzes added successfully!" });
    } catch (error) {
        console.error("Error adding quizzes:", error);
        res.status(500).json({ error: "Server error", details: error.message });
    }
});

router.get("/filter", async (req, res) => {
    const { language, category, difficulty } = req.query;

    let filter = {};
    if (language) filter.language = language;
    if (category) filter.category = category;
    if (difficulty) filter.difficulty = difficulty;

    try {
        const quizzes = await Quiz.find(filter);
        if (quizzes.length === 0) {
            return res.status(404).json({ message: "No quizzes found for the specified criteria." });
        }
        res.json(quizzes);
    } catch (error) {
        console.error("Error filtering quizzes:", error);
        res.status(500).json({ error: "Server error" });
    }
});

router.get("/:language", async (req, res) => {
    const { language } = req.params;
    
    try {
        const quizzes = await Quiz.find({ language });
        if (quizzes.length === 0) {
            return res.status(404).json({ message: `No quizzes found for language: ${language}` });
        }
        res.json(quizzes);
    } catch (error) {
        console.error(`Error fetching quizzes for language "${language}":`, error);
        res.status(500).json({ error: "Server error" });
    }
});

module.exports = router;
