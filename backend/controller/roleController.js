import RoleModel from '../model/RoleModel.js';
import UserModel from '../model/UserModel.js';

// Get all roles
export const getAllRoles = async (req, res) => {
    try {
        const roles = await RoleModel.find();
        res.status(200).json(roles);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi lấy danh sách Role", error: error.message });
    }
};

// Create a new role
export const createRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        
        const existingRole = await RoleModel.findOne({ name });
        if (existingRole) {
            return res.status(400).json({ message: "Role này đã tồn tại" });
        }

        const newRole = await RoleModel.create({ name, permissions: permissions || [] });
        res.status(201).json(newRole);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi tạo Role", error: error.message });
    }
};

// Update a role
export const updateRole = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        
        const updatedRole = await RoleModel.findByIdAndUpdate(
            req.params.id,
            { name, permissions },
            { new: true, runValidators: true }
        );

        if (!updatedRole) {
            return res.status(404).json({ message: "Không tìm thấy Role" });
        }

        res.status(200).json(updatedRole);
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi cập nhật Role", error: error.message });
    }
};

// Assign role to user
export const assignRoleToUser = async (req, res) => {
    try {
        const { userId, roleId } = req.body;

        const role = await RoleModel.findById(roleId);
        if (!role) {
            return res.status(404).json({ message: "Không tìm thấy Role" });
        }

        const user = await UserModel.findByIdAndUpdate(
            userId,
            { roleId },
            { new: true }
        ).populate('roleId');

        if (!user) {
            return res.status(404).json({ message: "Không tìm thấy User" });
        }

        res.status(200).json({
            message: "Phân quyền thành công",
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.roleId
            }
        });
    } catch (error) {
        res.status(500).json({ message: "Lỗi khi gán Role", error: error.message });
    }
};
