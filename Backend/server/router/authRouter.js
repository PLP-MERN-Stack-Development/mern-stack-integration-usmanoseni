const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/Users'); // adjust path if your model filename/exports differ
require('dotenv').config();

// /server/router/auth.js

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const TOKEN_EXPIRY = process.env.JWT_EXPIRES_IN;

// simple token middleware
function authenticateToken(req, res, next) {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (!authHeader) return res.status(401).json({ message: 'No token provided' });

    const parts = authHeader.split(' ');
    const token = parts.length === 2 ? parts[1] : parts[0];

    jwt.verify(token, JWT_SECRET, (err, payload) => {
        if (err) return res.status(401).json({ message: 'Invalid token' });
        req.user = payload; // contains id and email below
        next();
    });
}

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body || {};
        if (!name || !email || !password) return res.status(400).json({ message: 'Name, email and password are required' });

        const existing = await User.findOne({ email: email.toLowerCase() });
        if (existing) return res.status(409).json({ message: 'Email already registered' });

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({ name, email: email.toLowerCase(), password: hashed });
        await user.save();

        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        const userObj = user.toObject();
        delete userObj.password;

        res.status(201).json({ user: userObj, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body || {};
        if (!email || !password) return res.status(400).json({ message: 'Email and password are required' });

        const user = await User.findOne({ email: email.toLowerCase() });
        if (!user) return res.status(401).json({ message: 'Invalid credentials' });

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: 'Invalid credentials' });

        const payload = { id: user._id, email: user.email };
        const token = jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });

        const userObj = user.toObject();
        delete userObj.password;

        res.json({ user: userObj, token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/auth/me  (protected)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json({ user });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;