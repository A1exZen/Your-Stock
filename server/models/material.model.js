import mongoose from 'mongoose';

const MaterialSchema = new mongoose.Schema(
	{
		createdBy: { type: String, required: true },
		name: { type: String, required: true },
		slug: { type: String, required: true },
		image: {
			type: String,
			default:
				'https://t4.ftcdn.net/jpg/04/73/25/49/360_F_473254957_bxG9yf4ly7OBO5I0O5KABlN930GwaMQz.jpg',
		},
		description: { type: String },
		quantity: { type: Number, required: true },
		price: { type: Number },
		unit: { type: String },
		supplier: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Supplier',
		},
	},
	{
		timestamps: true,
	}
);

export default mongoose.model('Material', MaterialSchema);
