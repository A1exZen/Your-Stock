import Material from '../models/material.model.js';
import { errorHandler } from '../utils/error.js';

export const createMaterial = async (req, res, next) => {
	console.log(req.user);
	if (
		!req.user.isAdmin &&
		req.user.role !== 'materialManager' &&
		req.user.role !== 'productionManager' &&
		req.user.role !== 'admin'
	) {
		return next(errorHandler(403, 'You are not allowed to create a Material'));
	}
	if (
		!req.body.name ||
		!req.body.price ||
		!req.body.quantity ||
		!req.body.unit
	) {
		return next(errorHandler(400, 'Please provide all required fields'));
	}
	const slug = req.body.name
		.split(' ')
		.join('-')
		.toLowerCase()
		.replace(/[^a-zA-Z0-9-]/g, '');

	const newMaterial = new Material({
		...req.body,
		slug,
		createdBy: req.user.id,
	});
	try {
		const savedMaterial = await newMaterial.save();
		res.status(201).json(savedMaterial);
	} catch (error) {
		next(error);
	}
};

export const getMaterials = async (req, res, next) => {
	try {
		const startIndex = parseInt(req.query.startIndex) || 0;
		const limit = parseInt(req.query.limit) || 9;
		const sortDirection = req.query.order === 'asc' ? 1 : -1;
		const materials = await Material.find({
			...(req.query.createdBy && { createdBy: req.query.createdBy }),
			...(req.query.price && { price: req.query.price }),
			...(req.query.quantity && { quantity: req.query.quantity }),
			...(req.query.slug && { slug: req.query.slug }),
			...(req.query.materialId && { _id: req.query.materialId }),
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

		const totalMaterials = await Material.countDocuments();

		const now = new Date();
		const oneMonthAgo = new Date(
			now.getFullYear(),
			now.getMonth() - 1,
			now.getDate()
		);
		const lastMonthMaterials = await Material.countDocuments({
			createdAt: { $gte: oneMonthAgo },
		});

		res.status(200).json({
			materials,
			totalMaterials,
			lastMonthMaterials,
		});
	} catch (error) {
		next(error);
	}
};

export const deleteMaterial = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'materialManager' &&
			req.user.role !== 'productionManager' &&
			req.user.role !== 'admin') ||
		req.user.id !== req.params.userId
	) {
		return next(
			errorHandler(403, 'You are not allowed to delete this Material')
		);
	}
	try {
		await Material.findByIdAndDelete(req.params.materialId);
		res.status(200).json('The Material has been deleted');
	} catch (error) {
		next(error);
	}
};

export const updateMaterial = async (req, res, next) => {
	if (
		(!req.user.isAdmin &&
			req.user.role !== 'materialManager' &&
			req.user.role !== 'productionManager' &&
			req.user.role === 'admin') ||
		req.user.id !== req.params.userId
	) {
		return next(errorHandler(403, 'You are not allowed to update this post'));
	}
	try {
		const updatedMaterial = await Material.findByIdAndUpdate(
			req.params.materialId,
			{
				$set: {
					name: req.body.name,
					price: req.body.price,
					quantity: req.body.quantity,
					unit: req.body.unit,
					supplier: req.body.supplier,
					description: req.body.description,
					image: req.body.image,
				},
			},
			{ new: true }
		);
		res.status(200).json(updatedMaterial);
	} catch (error) {
		next(error);
	}
};

export const updateMaterialQuantity = async (req, res, next) => {
	const materials = req.body;
	try {
		for (const materialId in materials) {
			const foundMaterial = await Material.findById(materialId);
			if (foundMaterial) {
				foundMaterial.quantity -= materials[materialId];
				await foundMaterial.save();
			}
		}
		res.status(200).json({ message: 'Materials updated successfully' });
	} catch (error) {
		next(error);
	}
};
