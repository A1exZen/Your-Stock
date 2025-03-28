import Customer from '../models/customer.model.js';
import { errorHandler } from '../utils/error.js';

export const createCustomer = async (req, res, next) => {
	if (
		!req.user.isAdmin &&
		req.user.role !== 'admin' &&
		req.user.role !== 'productManager'
	) {
		return next(errorHandler(403, 'You are not allowed to create a customer'));
	}
	if (!req.body.name || !req.body.email) {
		return next(errorHandler(400, 'Please provide all required fields'));
	}
	const slug = req.body.name
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, '');

	const newCustomer = new Customer({
		...req.body,
		slug,
		createdBy: req.user.id,
	});
	try {
		const savedSupplier = await newCustomer.save();
		res.status(201).json(savedSupplier);
	} catch (error) {
		next(error);
	}
};

export const getCustomers = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === 'asc' ? 1 : -1;
		const customers = await Customer.find({
			...(req.query.createdBy && { createdBy: req.query.createdBy }),
			...(req.query.email && { email: req.query.email }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.customerId && { _id: req.query.customerId }),
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

		const totalCustomers = await Customer.countDocuments();

		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthCustomers = await Customer.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			customers,
			totalCustomers,
			lastMonthCustomers,
		});
	} catch (error) {
		next(error);
	}
};

export const getCustomer = async (req, res, next) => {
	try {
		const customer = await Customer.findById(req.params.userId);
		if (!customer) {
			return next(errorHandler(404, 'Customer not found'));
		}
		res.status(200).json(customer._doc);
	} catch (error) {
		next(error);
	}
};

export const deleteCustomer = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'admin' &&
			req.user.role !== 'productManager') ||
		req.user.id !== req.params.userId
	) {
		return next(
			errorHandler(403, 'You are not allowed to delete this Customer')
		);
	}
	try {
		await Customer.findByIdAndDelete(req.params.customerId);
		res.status(200).json('The Customer has been deleted');
	} catch (error) {
		next(error);
	}
};

export const updateCustomer = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'admin' &&
			req.user.role !== 'productManager') ||
		req.user.id !== req.params.userId
	) {
		return next(
			errorHandler(403, 'You are not allowed to update this customer')
		);
	}
	try {
		const updatedCustomer = await Customer.findByIdAndUpdate(
			req.params.customerId,
			{
				$set: {
					name: req.body.name,
					email: req.body.email,
					phoneNumber: req.body.phoneNumber,
					address: req.body.address,
					description: req.body.description,
					discount: req.body.discount,
					image: req.body.image,
				},
			},
			{ new: true }
		);
		res.status(200).json(updatedCustomer);
	} catch (error) {
		next(error);
	}
};
