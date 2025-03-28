import mongoose from 'mongoose'

const ReportSchema = new mongoose.Schema({
	action: {
		type: String,
		required: true
	},
	entity: {
		type: String,
		required: true
	},
	details: {
		type: String
	},
	productsUsed: [{
		product: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Product'
		},
		quantity: {
			type: Number
		}
	}],
	materialsUsed: [{
		material: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Material'
		},
		quantity: {
			type: Number
		}
	}],
	createdBy: { type: String, required: true },
})

export default mongoose.model('Report', ReportSchema)
