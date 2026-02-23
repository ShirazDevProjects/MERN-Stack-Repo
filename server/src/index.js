const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const mongoose = require('mongoose');

dotenv.config();

const app = express();
const port = process.env.PORT || 4000;

// Store database connection error
let dbError = null;

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log('Connected to MongoDB');
        dbError = null;
    })
    .catch((err) => {
        console.error('MongoDB initial connection error:', err);
        dbError = err.message || String(err);
    });

mongoose.connection.on('error', err => {
    console.error('MongoDB runtime error:', err);
    dbError = err.message || String(err);
});

mongoose.connection.on('disconnected', () => {
    console.log('MongoDB disconnected');
    if (!dbError) dbError = 'MongoDB disconnected unexpectedly.';
});

mongoose.connection.on('connected', () => {
    dbError = null;
});

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('MERN Server is running!');
});

app.get('/api/message', async (req, res) => {
    const isDbConnected = mongoose.connection.readyState === 1;
    let localError = dbError;

    try {
        if (isDbConnected) {
            const Dummy = mongoose.models.Dummy || mongoose.model('Dummy', new mongoose.Schema({ content: String }));
            await Dummy.create({ content: 'Sample dummy data' });
        }
    } catch (err) {
        console.error('Error inserting dummy data:', err);
        localError = err.message || String(err);
    }

    res.json({
        message: 'Hello from the backend!',
        databaseConnected: isDbConnected,
        error: localError
    });
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
