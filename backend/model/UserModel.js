import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
    {
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        }, 
        refreshToken: {
            type: String,
            default: null
        }
    },
    { timestamps: true }
);

export default mongoose.model("Users", UserSchema);