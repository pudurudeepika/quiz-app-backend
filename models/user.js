const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    score: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now },
    attemptedQuestions: {type: Number, default: 0},
});

module.exports = mongoose.model("User", UserSchema);