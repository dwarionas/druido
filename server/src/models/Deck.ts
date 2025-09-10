import mongoose from 'mongoose';

const deckSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: String,
    language: { type: String, default: 'UK' },
    tags: [String],
    userId: { type: String, required: true },
}, { timestamps: true });

export const Deck = mongoose.model('Deck', deckSchema);
