import Product from '../models/product.model.js';
import { errorHandler } from '../utils/error.js';

export const createProduct = async (req, res, next) => {
	if (
		req.user.role !== 'productManager' &&
		req.user.role !== 'productionManager' &&
		req.user.role !== 'admin' &&
		!req.user.isAdmin
	) {
		return next(errorHandler(403, 'You are not allowed to create a Product'));
	}
	if (!req.body.name || !req.body.price) {
		return next(errorHandler(400, 'Please provide all required fields'));
	}
	const slug = req.body.name
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, '');

	const newProduct = new Product({
		...req.body,
		slug,
		createdBy: req.user.id,
	});
	try {
		const savedProduct = await newProduct.save();
		res.status(201).json(savedProduct);
	} catch (error) {
		next(error);
	}
};

export const getProducts = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === 'asc' ? 1 : -1;
		const products = await Product.find({
			...(req.query.createdBy && { createdBy: req.query.createdBy }),
			...(req.query.price && { price: req.query.price }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.productId && { _id: req.query.productId }),
			...(req.query.searchTerm && {
				$or: [
					{ name: { $regex: req.query.searchTerm, $options: 'i' } },
					{ description: { $regex: req.query.searchTerm, $options: 'i' } },
				],
			}),
		})
			.sort({ updatedAt: sortDirection })
			.skip(startIndex)
			.limit(limit);

		const totalProducts = await Product.countDocuments();

		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthProducts = await Product.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			products,
			totalProducts,
			lastMonthProducts,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteProduct = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'productManager' &&
			req.user.role !== 'productionManager' &&
			req.user.role !== 'admin') ||
		req.user.id !== req.params.userId
	) {
		return next(
			errorHandler(403, 'You are not allowed to delete this Product')
		);
	}
	try {
		await Product.findByIdAndDelete(req.params.productId);
		res.status(200).json('The Product has been deleted');
	} catch (error) {
		next(error);
	}
};

export const updateProduct = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'productManager' &&
			req.user.role !== 'productionManager' &&
			req.user.role === 'admin') ||
		req.user.id !== req.params.userId
	) {
		return next(
			errorHandler(403, 'You are not allowed to update this product')
		);
	}
	try {
		const updatedProduct = await Product.findByIdAndUpdate(
			req.params.productId,
			{
				$set: {
					name: req.body.name,
					price: req.body.price,
					customer: req.body.customer,
					description: req.body.description,
					image: req.body.image,
				},
			},
			{ new: true }
		);
		res.status(200).json(updatedProduct);
	} catch (error) {
		next(error);
	}
};
