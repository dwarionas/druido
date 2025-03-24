import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { decksRouter } from './routes/decks';
import { cardsRouter } from './routes/cards';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/druido';
mongoose.connect(MONGO_URI).then(() => console.log('Connected to MongoDB'));

app.use('/api/decks', decksRouter);
app.use('/api/cards', cardsRouter);

app.get('/health', (_req, res) => res.json({ status: 'ok' }));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server on :${PORT}`));
