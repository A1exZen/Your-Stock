import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
	{
		createdBy: { type: String, required: true },
		name: {
			type: String,
			required: true,
		},
		slug: { type: String, required: true },
		description: String,
		price: Number,
		quantity: { type: Number },
		image: {
			type: String,
			default:
				'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
		},
		customer: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Customer',
		},
		materials: [
			{
				material: {
					type: mongoose.Schema.Types.ObjectId,
					ref: 'Material',
					required: true,
				},
				quantity: {
					type: Number,
					default: 1,
				},
			},
		],
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Product', ProductSchema);
