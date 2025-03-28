import mongoose from 'mongoose'

const UserSchema = new mongoose.Schema(
	{
		username: { type: String, required: true, unique: true },
		email: { type: String, required: true, unique: true },
		password: { type: String, required: true },
		profilePicture: {
			type: String,
			default: 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
		},
		phoneNumber: { type: String },
		isAdmin: {
			type: Boolean,
			default: false
		},
		role: {
			type: String,
			enum: ['admin', 'materialManager', 'productionManager', 'productManager', 'user'],
			default: 'user',
		}
	},
	{ timestamps: true }
)

const User = mongoose.model('User', UserSchema)
export default User