import mongoose from 'mongoose';
import dotenv from 'dotenv';
import RoleModel from '../model/RoleModel.js';

dotenv.config();

const getAdminId = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager");
        const adminRole = await RoleModel.findOne({ name: 'Admin' });
        if (adminRole) {
            console.log(`\n=== ADMIN ROLE ID ===\n${adminRole._id}\n=====================\n`);
        } else {
            console.log("\nAdmin role not found in DB!\n");
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

getAdminId();
