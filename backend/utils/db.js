const mongoose = require('mongoose');

let connected = false;

async function connectDB() {
	if (connected) return mongoose.connection;

	const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/wellness_app';
	await mongoose.connect(uri, {
		autoIndex: true,
	});

	mongoose.connection.on('connected', () => console.log('MongoDB connected'));
	mongoose.connection.on('error', (err) => console.error('MongoDB error', err));
	mongoose.connection.on('disconnected', () => console.warn('MongoDB disconnected'));

	connected = true;
	return mongoose.connection;
}

module.exports = { connectDB };
