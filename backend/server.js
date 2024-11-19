const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const mongoURI = "mongodb+srv://deekshakashyap05:deekshakashyap05@cluster0.pixmo.mongodb.net/exportgpt?retryWrites=true&w=majority"

const app = express();
const PORT = process.env.PORT || 6000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample Route
app.get('/', (req, res) => {
    res.send('Hello from ExportGPT Backend!');
});

// MongoDB Connection
mongoose.connect(mongoURI)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
