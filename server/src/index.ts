import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import recipesRouter from './routes/recipes.js';
import usersRouter from './routes/users.js';
import uploadRouter from './routes/upload.js';
import scanRouter from './routes/scan.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));

// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/healthy-diet-kids')
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

app.use('/api/recipes', recipesRouter);
app.use('/api/users', usersRouter);
app.use('/api/upload', uploadRouter);
app.use('/api/scan', scanRouter);

app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

const numPort = typeof PORT === 'string' ? parseInt(PORT, 10) : PORT;
app.listen(numPort, "0.0.0.0", () => {
    console.log(`Server running on port ${numPort} and accepting local network traffic`);
});
