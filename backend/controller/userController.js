import UserModel from '../model/UserModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate('roleId').select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách User", error: error.message });
    }
};
