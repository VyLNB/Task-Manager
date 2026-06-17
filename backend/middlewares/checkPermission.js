import UserModel from '../model/UserModel.js';

export const checkPermission = (requiredPermissions) => {
    return async (req, res, next) => {
        try {
            const userId = req.userId;
            if (!userId) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            const user = await UserModel.findById(userId).populate('roleId');
            if (!user || !user.roleId) {
                return res.status(403).json({ message: 'Forbidden: No role assigned' });
            }

            const userPermissions = user.roleId.permissions;

            // Admin has 'ALL' permission
            if (userPermissions.includes('ALL')) {
                return next();
            }

            // If requiredPermissions is an array, check if user has AT LEAST ONE of them
            // Or if you want strict all permissions, you can use .every()
            // Here we assume if they have any of the required permissions, they pass.
            // Or typically requiredPermissions is just a single string or array of acceptable permissions.
            const hasPermission = Array.isArray(requiredPermissions)
                ? requiredPermissions.some(perm => userPermissions.includes(perm))
                : userPermissions.includes(requiredPermissions);

            if (!hasPermission) {
                return res.status(403).json({ message: 'Forbidden: Insufficient permissions' });
            }

            next();
        } catch (error) {
            console.error('Permission check error:', error);
            res.status(500).json({ message: 'Server error during permission check' });
        }
    };
};
