const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const resultRoutes = require('./routes/resultRoutes');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api/results', resultRoutes);

const MONGO_URI = process.env.MONGO_URI;
const PORT = process.env.PORT || 5000;

if (!MONGO_URI) {
    console.error("❌ Error: MONGO_URI is not defined in .env file");
    process.exit(1);
}

mongoose.set("strictQuery", true);

mongoose.connect(MONGO_URI)
    .then(() => console.log("✅ MongoDB Connected"))
    .catch(err => {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    });

const userRoutes = require('./routes/userRoutes');
const quizRoutes = require('./routes/quizRoutes');

app.use('/api/users', userRoutes);
app.use('/api/quizzes', quizRoutes);

app.get('/', (req, res) => {
    res.send("✅ Backend is running...");
});

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
});

process.on("unhandledRejection", (reason, promise) => {
    console.error("🚨 Unhandled Promise Rejection:", reason);
});

process.on("uncaughtException", (error) => {
    console.error("🚨 Uncaught Exception:", error);
    process.exit(1);
});
