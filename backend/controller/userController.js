import UserModel from '../model/UserModel.js';

export const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find().populate('roleId').select('-password');
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách User", error: error.message });
    }
};

export const toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await UserModel.findById(id);
        
        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy người dùng" });
        }

        // Đảo ngược trạng thái
        user.isActive = user.isActive === undefined ? false : !user.isActive;
        await user.save();

        res.status(200).json({ 
            message: `Tài khoản đã được ${user.isActive ? 'kích hoạt' : 'vô hiệu hóa'}.`,
            isActive: user.isActive 
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật trạng thái", error: error.message });
    }
};
