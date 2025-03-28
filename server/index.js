import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import express from 'express';
import mongoose from 'mongoose';
import authRoutes from './routes/auth.route.js';
import userRoutes from './routes/user.route.js';
import supplierRoutes from './routes/supplier.route.js';
import customerRoutes from './routes/customer.route.js';
import materialRoutes from './routes/material.route.js';
import productRoutes from './routes/product.route.js';
import path from 'path';

dotenv.config();

mongoose
	.connect(process.env.MONGO)
	.then(() => {
		console.log('MongoDB Connected!');
	})
	.catch(err => {
		console.error(err);
	});

const __dirname = path.resolve();

const app = express();
app.use(express.json());
app.use(cookieParser());

app.listen(process.env.PORT, () => {
	console.log('Server started on port 5001');
});

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/supplier', supplierRoutes);
app.use('/api/customer', customerRoutes);
app.use('/api/material', materialRoutes);
app.use('/api/product', productRoutes);

app.use(express.static(path.join(__dirname, '/client/dist')));

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, 'client', 'dist', 'index.html'));
});

app.use((err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || 'Internal Server Error';
	res.status(statusCode).json({
		success: false,
		statusCode,
		message,
	});
});
