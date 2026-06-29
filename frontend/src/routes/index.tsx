import { createBrowserRouter } from "react-router-dom"
import Dashboard from "../pages/main/Dashboard";
import MainLayout from "../layouts/MainLayout";
import TasksPage from "../pages/main/TasksPage";
import TaskDetail from "../pages/main/TaskDetail";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Calendar from "../pages/main/Calendar";
import WorkspacePage from "../pages/main/WorkspacePage";
import WorkspaceKanban from "../pages/main/WorkspaceKanban";
import { MyTimesheetPage } from "../pages/main/MyTimesheetPage";
import PersonnelPage from "../pages/main/admin/PersonnelPage";
import ProjectPage from "../pages/main/admin/ProjectPage";
import ProtectedRoute from "../components/common/ProtectedRoute";


const router = createBrowserRouter([
    {
        path: "/",
        element: <LoginPage />,
    },
    {
        path: "/register",
        element: <RegisterPage />,
    },
    {
        path: "/main",
        element: (
            <MainLayout/>
        ), 
        children: [
            {
                path: "dashboard",
                element: <Dashboard />
            }, 
            {
                path: "tasks",
                element: (
                    <ProtectedRoute requireMember={true}>
                        <TasksPage />
                    </ProtectedRoute>
                )
            }, 
            {
                
                path: "tasks/:id",
                element:(
                    <ProtectedRoute requireMember={true}>
                        <TaskDetail/>
                    </ProtectedRoute>
                )
            }, 
            {
                path: "calendar",
                element: (
                    <ProtectedRoute requireMember={true}>
                        <Calendar/>
                    </ProtectedRoute>
                )
            },
            {
                path: "workspace",
                element: (
                    <ProtectedRoute requireMember={true}>
                        <WorkspacePage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "workspace/:id",
                element: (
                    <ProtectedRoute requireMember={true}>
                        <WorkspaceKanban/>
                    </ProtectedRoute>
                )
            },
            {
                path: "timesheet",
                element: (
                    <ProtectedRoute requireMember={true}>
                        <MyTimesheetPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "personnel",
                element: (
                    <ProtectedRoute requireAdmin={true}>
                        <PersonnelPage/>
                    </ProtectedRoute>
                )
            },
            {
                path: "project",
                element: (
                    <ProtectedRoute requireAdmin={true}>
                        <ProjectPage/>
                    </ProtectedRoute>
                )
            }
        ]
    }
]);

export default router;