const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
dotenv.config();

const { connectDB } = require('./utils/db');

const authRoutes = require('./routes/auth');
const sessionRoutes = require('./routes/sessions');

const app = express();

// Middlewares
app.use(cors({
	origin: process.env.FRONTEND_ORIGIN || 'http://localhost:5173',
	credentials: true,
}));
app.use(express.json({ limit: '1mb' }));

// Healthcheck
app.get('/health', (req, res) => {
	res.json({ ok: true, time: new Date().toISOString() });
});

// Routes
app.use('/api', authRoutes);
app.use('/api', sessionRoutes);

// 404 handler
app.use((req, res) => {
	res.status(404).json({ error: 'Not Found' });
});

const PORT = process.env.PORT || 3000;
connectDB()
	.then(() => {
		app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
	})
	.catch((err) => {
		console.error('Failed to start server:', err);
		process.exit(1);
	});
