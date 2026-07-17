import jwt from 'jsonwebtoken';
import UserModel from '../model/UserModel.js';

export const verifyToken = (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')){
            return res.status(401).json({message: 'Unauthorized'})
        }

        const token = authHeader.split(' ')[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        req.userId = decodedToken.userId;
        if (!req.userId){
            return res.status(401).json({message: 'Unauthorized'})
        }
        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'});
    }
}

export const checkRole = (roles) => {
    return async (req, res, next) => {
        try {
            const user = await UserModel.findById(req.userId).populate('roleId');
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            if (!user.roleId || !roles.includes(user.roleId.name)) {
                return res.status(403).json({ message: 'Access denied. You do not have the required role.' });
            }
            next();
        } catch (error) {
            return res.status(500).json({ message: 'Error checking role', error: error.message });
        }
    };
};