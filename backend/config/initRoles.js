import RoleModel from '../model/RoleModel.js';
import UserModel from '../model/UserModel.js';

export const initializeRoles = async () => {
    try {
        // Define default roles
        const defaultRoles = [
            { name: 'Admin', permissions: ['ALL'] },
            { name: 'Project Manager', permissions: ['MANAGE_PROJECTS', 'CREATE_TASK', 'UPDATE_TASK', 'DELETE_TASK'] },
            { name: 'Member', permissions: ['VIEW_TASK', 'UPDATE_TASK'] }
        ];

        // Create roles if they don't exist
        for (const roleData of defaultRoles) {
            const existingRole = await RoleModel.findOne({ name: roleData.name });
            if (!existingRole) {
                await RoleModel.create(roleData);
                console.log(`[Role Init] Created role: ${roleData.name}`);
            }
        }

        // Get the Admin role
        const adminRole = await RoleModel.findOne({ name: 'Admin' });

        if (adminRole) {
            // Assign Admin role to existing users who don't have a roleId
            const updatedUsers = await UserModel.updateMany(
                { roleId: { $exists: false } },
                { $set: { roleId: adminRole._id } }
            );

            // Also check for users where roleId is null
            const updatedUsersNull = await UserModel.updateMany(
                { roleId: null },
                { $set: { roleId: adminRole._id } }
            );

            if (updatedUsers.modifiedCount > 0 || updatedUsersNull.modifiedCount > 0) {
                console.log(`[Role Init] Assigned Admin role to ${updatedUsers.modifiedCount + updatedUsersNull.modifiedCount} existing users.`);
            }
        }

        console.log('[Role Init] Roles initialized successfully.');
    } catch (error) {
        console.error('[Role Init] Error initializing roles:', error);
    }
};
