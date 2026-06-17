import mongoose from 'mongoose';
import dotenv from 'dotenv';
import UserModel from '../model/UserModel.js';
import RoleModel from '../model/RoleModel.js';

dotenv.config();

const testPopulate = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager");
        
        // Find Zoe and populate roleId
        const user = await UserModel.findOne({ email: 'zoe@gmail.com' }).populate('roleId');
        
        console.log("=== POPULATED USER ===");
        console.log(JSON.stringify(user, null, 2));

        if (user && user.roleId) {
            console.log("\nRole name:", user.roleId.name);
        } else {
            console.log("\nroleId is null or not populated!");
        }

        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

testPopulate();
