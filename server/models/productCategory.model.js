import mongoose from 'mongoose'

const ProductCategorySchema = new mongoose.Schema({
	title: {
		type: String,
		required: true
	},
	description: String,
})

export default mongoose.model('ProductCategory', ProductCategorySchema)