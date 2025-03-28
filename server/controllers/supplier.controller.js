import Supplier from '../models/supplier.model.js';
import User from '../models/user.model.js';
import { errorHandler } from '../utils/error.js';

export const createSupplier = async (req, res, next) => {
	if (
		!req.user.isAdmin &&
		req.user.role !== 'admin' &&
		req.user.role !== 'materialManager'
	) {
		return next(errorHandler(403, 'You are not allowed to create a supplier'));
	}
	if (!req.body.name || !req.body.email) {
		return next(errorHandler(400, 'Please provide all required fields'));
	}
	const slug = req.body.name
		.toString()
		.toLowerCase()
		.normalize('NFKD') // Нормализация символов Unicode
		.replace(/[^\w\s-]/g, '') // Удаление всех специальных символов, кроме цифр, букв, пробелов и дефисов
		.replace(/\s+/g, '-') // Замена пробелов на дефисы
		.replace(/[-\s]+/g, '-') // Замена повторяющихся дефисов и пробелов на один дефис
		.replace(/^-+/, '') // Удаление начальных дефисов
		.replace(/-+$/, ''); // Удаление конечных дефисов
	console.log(slug);

	const newSupplier = new Supplier({
		...req.body,
		slug,
		createdBy: req.user.id,
	});
	try {
		const savedSupplier = await newSupplier.save();
		res.status(201).json(savedSupplier);
	} catch (error) {
		next(error);
	}
};

export const getSuppliers = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === 'asc' ? 1 : -1;
		const suppliers = await Supplier.find({
			...(req.query.createdBy && { createdBy: req.query.createdBy }),
			...(req.query.email && { email: req.query.email }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.supplierId && { _id: req.query.supplierId }),
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

		const totalSuppliers = await Supplier.countDocuments();
		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthSuppliers = await Supplier.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			suppliers,
			totalSuppliers,
			lastMonthSuppliers,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteSupplier = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'materialManager' &&
			req.user.role !== 'admin') ||
		req.user.id !== req.params.userId
	) {
		return next(
			errorHandler(403, 'You are not allowed to delete this supplier')
		);
	}
	try {
		await Supplier.findByIdAndDelete(req.params.supplierId);
		res.status(200).json('The supplier has been deleted');
	} catch (error) {
		next(error);
	}
};

export const updateSupplier = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role === 'materialManager' &&
			req.user.role === 'admin') ||
		req.user.id !== req.params.userId
	) {
		return next(errorHandler(403, 'You are not allowed to update this post'));
	}
	try {
		const updatedSupplier = await Supplier.findByIdAndUpdate(
			req.params.supplierId,
			{
				$set: {
					name: req.body.name,
					email: req.body.email,
					phoneNumber: req.body.phoneNumber,
					address: req.body.address,
					description: req.body.description,
					image: req.body.image,
				},
			},
			{ new: true }
		);
		res.status(200).json(updatedSupplier);
	} catch (error) {
		next(error);
	}
};

export const getSupplier = async (req, res, next) => {
	try {
		const supplier = await Supplier.findById(req.params.supplierId);
		if (!supplier) {
			return next(errorHandler(404, 'Supplier not found'));
		}
		res.status(200).json(supplier._doc);
	} catch (error) {
		next(error);
	}
};
