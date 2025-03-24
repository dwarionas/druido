import { Router } from 'express';
import { Deck } from '../models/Deck';

export const decksRouter = Router();

decksRouter.get('/', async (req, res) => {
    // TODO: get userId from auth
    const decks = await Deck.find({});
    res.json(decks);
});

decksRouter.post('/', async (req, res) => {
    const deck = await Deck.create({ ...req.body, userId: 'temp' });
    res.status(201).json(deck);
});

decksRouter.delete('/:id', async (req, res) => {
    await Deck.findByIdAndDelete(req.params.id);
    res.status(204).send();
});
