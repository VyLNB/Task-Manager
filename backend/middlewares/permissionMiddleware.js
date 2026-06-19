import UserModel from '../model/UserModel.js';

export const checkPermission = (requiredPermission) => {
    return async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.userId).populate('roleId');
            
            if (!user || !user.roleId) {
                return res.status(403).json({ message: 'Forbidden: No role assigned' });
            }

            const role = user.roleId;

            // Admin bypasses all checks
            if (role.name === 'Admin' || role.permissions.includes('ALL')) {
                return next();
            }

            if (role.permissions.includes(requiredPermission)) {
                return next();
            }

            return res.status(403).json({ message: `Forbidden: Requires ${requiredPermission} permission` });
        } catch (error) {
            console.error('Permission check error:', error);
            return res.status(500).json({ message: 'Server error during permission check' });
        }
    }
};

export const checkAdmin = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).populate('roleId');
        
        if (!user || !user.roleId) {
            return res.status(403).json({ message: 'Forbidden: No role assigned' });
        }

        if (user.roleId.name !== 'Admin' && !user.roleId.permissions.includes('ALL')) {
            return res.status(403).json({ message: 'Forbidden: Admin access required' });
        }

        next();
    } catch (error) {
        console.error('Admin check error:', error);
        return res.status(500).json({ message: 'Server error during admin check' });
    }
};

export const checkMember = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).populate('roleId');
        
        if (!user || !user.roleId) {
            return res.status(403).json({ message: 'Forbidden: No role assigned' });
        }

        // Admin ko được phép gọi API của Member (Workspace, CRUD Task)
        if (user.roleId.name === 'Admin' || user.roleId.permissions.includes('ALL')) {
            return res.status(403).json({ message: 'Forbidden: Admin cannot perform member actions' });
        }

        // Member hoặc Project Manager thì cho qua
        next();
    } catch (error) {
        console.error('Member check error:', error);
        return res.status(500).json({ message: 'Server error during member check' });
    }
};

export const checkProjectManager = async (req, res, next) => {
    try {
        const user = await UserModel.findById(req.userId).populate('roleId');
        
        if (!user || !user.roleId) {
            return res.status(403).json({ message: 'Forbidden: No role assigned' });
        }

        if (user.roleId.name !== 'Project Manager') {
            return res.status(403).json({ message: 'Forbidden: Project Manager access required' });
        }

        next();
    } catch (error) {
        console.error('Project Manager check error:', error);
        return res.status(500).json({ message: 'Server error during PM check' });
    }
};
