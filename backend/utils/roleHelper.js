import { WorkspaceModel } from '../model/WorkspaceModel.js';

/**
 * Kiểm tra xem user có phải là Leader của workspace không
 * @param {string} workspaceId - ID của Workspace
 * @param {string} userId - ID của User
 * @returns {Promise<boolean>}
 */
export const checkIsWorkspaceLeader = async (workspaceId, userId) => {
    try {
        const workspace = await WorkspaceModel.findById(workspaceId);
        if (!workspace) return false;
        
        return workspace.leader.toString() === userId.toString();
    } catch (error) {
        console.error("Lỗi khi kiểm tra leader của workspace:", error);
        return false;
    }
};
