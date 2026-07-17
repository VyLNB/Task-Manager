import UserModel from '../model/UserModel.js';
import { WorkspaceModel } from '../model/WorkspaceModel.js';
import TaskModel from '../model/TaskModel.js';
import { TimesheetModel } from '../model/TimesheetModel.js';
import { TaskChangeRequestModel } from '../model/TaskChangeRequestModel.js';

export const getAdminDashboardStats = async (req, res) => {
    try {
        const now = new Date();
        const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
        
        // 1. Users Stats
        const totalUsers = await UserModel.countDocuments();
        const newUsers = await UserModel.countDocuments({ createdAt: { $gte: thirtyDaysAgo } });
        
        // 2. Workspaces Stats
        const totalWorkspaces = await WorkspaceModel.countDocuments();
        const unfinishedWorkspaces = await WorkspaceModel.countDocuments({ status: { $ne: 'Đã hoàn thành' } });
        
        // 3. Tasks by Status and Workspace
        const tasksRaw = await TaskModel.aggregate([
            {
                $group: {
                    _id: { status: "$status", workspaceId: "$workspaceId" },
                    count: { $sum: 1 }
                }
            }
        ]);
        
        // 4. Workspaces nearing deadline (<= 7 days from now)
        const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        const nearDeadlineWorkspaces = await WorkspaceModel.find({
            endDate: { $gte: now, $lte: sevenDaysFromNow },
            status: { $ne: 'Đã hoàn thành' }
        }).select('name endDate status leader')
          .populate('leader', 'fullName email')
          .lean();
        
        // 5. Working time by workspace (Include all workspaces, even with 0 hours)
        const allWorkspaces = await WorkspaceModel.find({}).select('name _id').lean();

        // Aggregate approved timesheets, sum hours by workspaceId
        const timesheetStats = await TimesheetModel.aggregate([
            { $match: { status: 'Approved' } },
            {
                $group: {
                    _id: "$workspaceId",
                    totalHours: { $sum: "$hours" }
                }
            }
        ]);
        
        const timesheetMap = {};
        timesheetStats.forEach(stat => {
            timesheetMap[stat._id.toString()] = stat.totalHours;
        });

        const workingTimeByWorkspace = allWorkspaces.map(ws => ({
            workspaceName: ws.name,
            hours: timesheetMap[ws._id.toString()] || 0
        }));

        // 6. Workspaces by Status
        const workspacesByStatus = await WorkspaceModel.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            },
            {
                $project: {
                    name: "$_id",
                    value: "$count",
                    _id: 0
                }
            }
        ]);

        return res.status(200).json({
            success: true,
            data: {
                users: {
                    total: totalUsers,
                    newThisMonth: newUsers
                },
                workspaces: {
                    total: totalWorkspaces,
                    unfinished: unfinishedWorkspaces
                },
                tasksRaw: tasksRaw,
                allWorkspaces: allWorkspaces,
                workspacesByStatus: workspacesByStatus,
                nearDeadlineWorkspaces: nearDeadlineWorkspaces,
                workingTimeByWorkspace: workingTimeByWorkspace
            }
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu dashboard', error: error.message });
    }
};

export const getPMDashboardStats = async (req, res) => {
    try {
        const userId = req.userId;
        const now = new Date();

        // 1. Get PM's workspaces
        const pmWorkspaces = await WorkspaceModel.find({ leader: userId }).select('name _id endDate status leader').lean();
        const pmWorkspaceIds = pmWorkspaces.map(ws => ws._id);

        const totalProjects = pmWorkspaces.length;

        // 2. Pending Timesheets
        const pendingTimesheetsCount = await TimesheetModel.countDocuments({
            workspaceId: { $in: pmWorkspaceIds },
            status: 'Pending'
        });

        // 3. Near Deadline Projects (<= 7 days and not completed)
        const sevenDaysFromNow = new Date(now.getTime() + (7 * 24 * 60 * 60 * 1000));
        const nearDeadlineProjects = await WorkspaceModel.find({
            _id: { $in: pmWorkspaceIds },
            endDate: { $gte: now, $lte: sevenDaysFromNow },
            status: { $ne: 'Đã hoàn thành' }
        }).select('name endDate status leader')
          .populate('leader', 'fullName email')
          .lean();

        // 4. Tasks Raw Data for PM's projects
        const tasksRaw = await TaskModel.aggregate([
            { $match: { workspaceId: { $in: pmWorkspaceIds } } },
            {
                $group: {
                    _id: { status: "$status", workspaceId: "$workspaceId" },
                    count: { $sum: 1 }
                }
            }
        ]);

        // 5. Working Time by Workspace for PM's projects
        const timesheetStats = await TimesheetModel.aggregate([
            { $match: { workspaceId: { $in: pmWorkspaceIds }, status: 'Approved' } },
            {
                $group: {
                    _id: "$workspaceId",
                    totalHours: { $sum: "$hours" }
                }
            }
        ]);

        const timesheetMap = {};
        timesheetStats.forEach(stat => {
            timesheetMap[stat._id.toString()] = stat.totalHours;
        });

        const workingTimeByWorkspace = pmWorkspaces.map(ws => ({
            workspaceName: ws.name,
            hours: timesheetMap[ws._id.toString()] || 0
        }));

        // 6. Pending Task Change Requests
        const pendingChangeRequests = await TaskChangeRequestModel.find({
            workspaceId: { $in: pmWorkspaceIds },
            status: 'Pending'
        }).populate('taskId', 'title')
          .populate('workspaceId', 'name')
          .populate('requestedBy', 'fullName email')
          .sort({ createdAt: -1 })
          .lean();

        return res.status(200).json({
            success: true,
            data: {
                totalProjects,
                pendingTimesheets: pendingTimesheetsCount,
                nearDeadlineProjects,
                tasksRaw,
                allWorkspaces: pmWorkspaces.map(ws => ({ _id: ws._id, name: ws.name })),
                workingTimeByWorkspace,
                pendingChangeRequests
            }
        });
    } catch (error) {
        console.error('Error fetching PM dashboard stats:', error);
        return res.status(500).json({ success: false, message: 'Lỗi server khi lấy dữ liệu dashboard PM', error: error.message });
    }
};
