const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    language: { type: String, required: true},
    question: {type: String, required: true},
    options: {type: [String], required: true},
    correctAnswer: {type: String, required: true},
    category: {type: String, required: true},
    difficulty: { type: String,
        enum: ["Easy", "Medium", "Hard"],
        required: true
    },
    createdAt: {type: Date, default: Date.now}
});

module.exports = mongoose.model("Quiz",QuizSchema)