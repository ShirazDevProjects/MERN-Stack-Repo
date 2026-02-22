const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Connect to MongoDB
const mongodb = mongoose.connect(process.env.MONGODB_URI)
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('MongoDB connection error:', err));

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MERN Server is running!');
});

app.get('/api/message', (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    res.json({ message: 'Hello from the backend!', databaseConnected: isDbConnected });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
