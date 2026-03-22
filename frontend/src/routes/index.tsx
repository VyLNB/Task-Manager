import { createBrowserRouter } from "react-router-dom"
import Dashboard from "../page/TeacherPage/Dashboard";
import TeacherLayout from "../page/TeacherPage/TeacherLayout";
import TasksPage from "../page/TeacherPage/TasksPage";
import TaskDetail from "../page/TeacherPage/TaskDetail";
import AddTask from "../page/TeacherPage/AddTask";
import LoginPage from "../page/auth/LoginPage";
import RegisterPage from "../page/auth/RegisterPage";
import Calendar from "../page/TeacherPage/Calendar";

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
            <TeacherLayout/>
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