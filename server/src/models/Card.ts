import mongoose from 'mongoose';

// SM-2 fields
const cardSchema = new mongoose.Schema({
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    easeFactor: { type: Number, default: 2.5 },
    interval: { type: Number, default: 0 },
    repetitions: { type: Number, default: 0 },
    nextReview: { type: Date, default: Date.now },
}, { timestamps: true });

export const Card = mongoose.model('Card', cardSchema);
