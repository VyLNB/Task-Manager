import { createBrowserRouter } from "react-router-dom"
import Dashboard from "../page/Main/Dashboard";
import MainLayout from "../page/Main/MainLayout";
import TasksPage from "../page/Main/TasksPage";
import TaskDetail from "../page/Main/TaskDetail";
import AddTask from "../page/Main/AddTask";
import LoginPage from "../page/auth/LoginPage";
import RegisterPage from "../page/auth/RegisterPage";
import Calendar from "../page/Main/Calendar";

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