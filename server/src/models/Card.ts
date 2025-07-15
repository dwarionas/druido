import mongoose from 'mongoose';

// migrated from SM-2 to FSRS fields
const cardSchema = new mongoose.Schema({
    deckId: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    question: { type: String, required: true },
    answer: { type: String, required: true },
    tags: [String],
    // fsrs
    stability: { type: Number, default: null },
    difficulty: { type: Number, default: null },
    elapsedDays: { type: Number, default: 0 },
    scheduledDays: { type: Number, default: 0 },
    reps: { type: Number, default: 0 },
    lapses: { type: Number, default: 0 },
    state: { type: Number, default: 0 }, // 0=new, 1=learning, 2=review, 3=relearning
    due: { type: Date, default: Date.now },
    lastReviewedAt: Date,
}, { timestamps: true });

export const Card = mongoose.model('Card', cardSchema);
