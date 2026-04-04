import { Outlet } from "react-router-dom"
import Sidebar from "../../components/sidebar"

export default function TeacherLayout() {
    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0f1f1b]">
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    )
}