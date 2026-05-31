import { createBrowserRouter } from "react-router-dom"
import Dashboard from "../pages/main/Dashboard";
import MainLayout from "../layouts/MainLayout";
import TasksPage from "../pages/main/TasksPage";
import TaskDetail from "../pages/main/TaskDetail";
import AddTask from "../pages/main/AddTask";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import Calendar from "../pages/main/Calendar";

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
        path: "/todoapp",
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
                element: <TasksPage />
            }, 
            {
                
                path: "tasks/:id",
                element:<TaskDetail/>
            }, 
            {
                path: "newTask",
                element: <AddTask/>
            }, 
            {
                path: "calendar",
                element: <Calendar/>
            }
        ]
    }
]);

export default router;