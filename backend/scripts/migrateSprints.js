import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
dotenv.config({ path: join(__dirname, '../.env') });
dotenv.config({ path: join(__dirname, '../secrets/.env.local') });

import { WorkspaceModel } from '../model/WorkspaceModel.js';
import TaskModel from '../model/TaskModel.js';
import SprintModel from '../model/SprintModel.js';

async function migrateSprints() {
    try {
        await mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost:27017/task-manager");
        console.log("Connected to MongoDB.");

        const workspaces = await WorkspaceModel.find();
        console.log(`Found ${workspaces.length} workspaces.`);

        for (const workspace of workspaces) {
            console.log(`Processing workspace: ${workspace.name}`);
            
            // Check if there are tasks without a sprint
            const tasksWithoutSprint = await TaskModel.find({ 
                workspaceId: workspace._id, 
                sprintId: { $exists: false } 
            });

            if (tasksWithoutSprint.length > 0) {
                console.log(`Found ${tasksWithoutSprint.length} tasks without a sprint. Creating default sprint...`);
                
                // Find or create default sprint
                let defaultSprint = await SprintModel.findOne({ 
                    workspaceId: workspace._id, 
                    name: 'Default Sprint' 
                });

                if (!defaultSprint) {
                    defaultSprint = await SprintModel.create({
                        name: 'Default Sprint',
                        startDate: workspace.startDate || new Date(),
                        endDate: workspace.endDate || new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
                        workspaceId: workspace._id,
                        status: 'Active'
                    });
                    console.log(`Created new Default Sprint with ID: ${defaultSprint._id}`);
                } else {
                    console.log(`Using existing Default Sprint with ID: ${defaultSprint._id}`);
                }

                // Update tasks
                const result = await TaskModel.updateMany(
                    { workspaceId: workspace._id, sprintId: { $exists: false } },
                    { $set: { sprintId: defaultSprint._id, taskType: 'Planned' } }
                );
                console.log(`Updated ${result.modifiedCount} tasks.`);
            } else {
                console.log("No tasks without sprint found in this workspace.");
            }
        }

        console.log("Migration completed successfully.");
    } catch (error) {
        console.error("Migration failed:", error);
    } finally {
        await mongoose.disconnect();
        console.log("Disconnected from MongoDB.");
        process.exit(0);
    }
}

migrateSprints();
