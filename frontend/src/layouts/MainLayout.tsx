import { useState } from "react"
import { Outlet } from "react-router-dom"
import { Menu, GraduationCap } from "lucide-react"
import Sidebar from "../components/common/Sidebar"

export default function MainLayout() {
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    return (
        <div className="flex h-screen bg-gray-50">
            <Sidebar isMobileOpen={isMobileOpen} setIsMobileOpen={setIsMobileOpen} />
            <div className="flex-1 flex flex-col min-w-0 bg-[#0f1f1b]">
                <header className="lg:hidden flex items-center justify-between p-4 bg-[#0f1f1b] text-white border-b border-white">
                    <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                            <GraduationCap color="green" />
                        </div>
                        <span className="font-bold text-xl">Task Manager</span>
                    </div>
                    <button onClick={() => setIsMobileOpen(true)} className="p-1 hover:bg-green-700 rounded-md transition-colors">
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
        </div>
    )
}