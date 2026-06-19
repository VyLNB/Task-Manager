import { useState } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { Menu, GraduationCap } from "lucide-react"
import Sidebar from "../components/common/Sidebar"
import { CreateTaskModal } from "../components/task/CreateTaskModal"

export default function MainLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const [isCreateTaskModalOpen, setIsCreateTaskModalOpen] = useState(false);
    const navigate = useNavigate();

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar 
                isMobileOpen={isMobileOpen} 
                setIsMobileOpen={setIsMobileOpen} 
                onOpenCreateTask={() => setIsCreateTaskModalOpen(true)}
            />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0f1f1b]">
                <header className="lg:hidden flex items-center justify-between p-4 bg-[#0f1f1b] text-white border-b border-teal-800/50">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-[#1a2f2a] border border-teal-800/50 rounded-lg flex items-center justify-center flex-shrink-0">
                            <GraduationCap color="#2dd4bf" />
                        </div>
                        <span className="font-bold text-xl">Task Manager</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(true)} className="p-1 hover:bg-teal-900/40 text-teal-400 rounded-md transition-colors">
                        <Menu size={24} />
                    </button>
                </header>
                <main className="flex-1 p-6 overflow-auto">
                    <Outlet />
                </main>
            </div>

            {isMobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            <CreateTaskModal 
                isOpen={isCreateTaskModalOpen} 
                onClose={() => setIsCreateTaskModalOpen(false)} 
                onSuccess={() => {
                    navigate('/todoapp/tasks');
                    window.dispatchEvent(new Event('task_created'));
                }} 
            />
        </div>
    )
}