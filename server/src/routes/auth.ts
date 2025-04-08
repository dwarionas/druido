import { Router } from 'express';
import { User } from '../models/User';

export const authRouter = Router();

authRouter.post('/register', async (req, res) => {
    try {
        const { email, password, name } = req.body;
        // for now just store plain text, fix later
        const user = await User.create({ email, password, name });
        res.status(201).json({ id: user._id, email: user.email, name: user.name });
    } catch (err: any) {
        if (err.code === 11000) {
            return res.status(409).json({ error: 'Email already exists' });
        }
        res.status(500).json({ error: 'registration failed' });
    }
});

authRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || user.password !== password) {
        return res.status(401).json({ error: 'Invalid credentials' });
    }
    // TODO: return JWT token instead
    res.json({ id: user._id, email: user.email, name: user.name });
});
