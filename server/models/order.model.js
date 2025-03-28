import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
	customer: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'Customer',
		required: true
	},
	products: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product',
			required: true
		},
		quantity: {
			type: Number,
			required: true
		}
	}],
	totalCost: {
		type: Number,
		required: true
	},
	completed: {
		type: Boolean,
		default: false
	}
});

export default  mongoose.model('Order', OrderSchema);
