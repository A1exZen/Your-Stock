import mongoose from 'mongoose'

const CustomerSchema = new mongoose.Schema(
	{
		createdBy: { type: String, required: true },
		name: { type: String, required: true, unique: true },
		slug: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		image: {
			type: String,
			default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
		},
		phoneNumber: { type: String },
		address: { type: String },
		INN: { type: Number },
		discount: {type: Number, default: 0.0},
		description: { type: String }
	},
	{ timestamps: true }
)

const Customer = mongoose.model('Customer', CustomerSchema)
export default Customer