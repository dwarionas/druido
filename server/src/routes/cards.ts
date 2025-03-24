import { Router } from 'express';
import { Card } from '../models/Card';

export const cardsRouter = Router();

cardsRouter.get('/', async (req, res) => {
    const { deckId } = req.query;
    const filter = deckId ? { deckId } : {};
    const cards = await Card.find(filter);
    res.json(cards);
});

cardsRouter.post('/', async (req, res) => {
    const card = await Card.create(req.body);
    res.status(201).json(card);
});

// SM-2 review
cardsRouter.post('/:id/review', async (req, res) => {
    const { quality } = req.body; // 0-5
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ error: 'not found' });

    if (quality < 3) {
        card.repetitions = 0;
        card.interval = 0;
    } else {
        card.repetitions += 1;
        if (card.repetitions === 1) card.interval = 1;
        else if (card.repetitions === 2) card.interval = 6;
        else card.interval = Math.round(card.interval * card.easeFactor);
    }

    card.easeFactor = Math.max(1.3, card.easeFactor + 0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
    card.nextReview = new Date(Date.now() + card.interval * 24 * 60 * 60 * 1000);
    await card.save();
    res.json(card);
});

cardsRouter.delete('/:id', async (req, res) => {
    await Card.findByIdAndDelete(req.params.id);
    res.status(204).send();
});
