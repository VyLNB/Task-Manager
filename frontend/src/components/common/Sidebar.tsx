import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
    List,
    ChevronDown,
    ChevronRight,
    LayoutDashboard,
    ChevronLeft,
    GraduationCap,
    UserCircle,
    Shield,
    LogOut,
    File,
    Clock
} from "lucide-react";
import { signout } from "../../services/auth";
import { usePermission } from "../../hooks/usePermission";
import LogoImage from '../../assets/Logo_Task_Manager.png';


interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    subItem?: {
        id: string;
        label: string;
    }[];
    path?: string;
}

interface SidebarProps {
    isMobileOpen: boolean;
    setIsMobileOpen: (isOpen: boolean) => void;
    onOpenCreateTask?: () => void;
}

const SideBar: React.FC<SidebarProps> = ({ isMobileOpen, setIsMobileOpen, onOpenCreateTask }) => {
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signout();
        navigate('/');
    };

    const { isAdmin } = usePermission();

    const menuItems: MenuItem[] = [
        {
            id: "dashboard",
            label: "Tổng quan",
            icon: <LayoutDashboard size={20} />,
        }
    ];

    if (!isAdmin) {
        menuItems.push(
            {
                id: "tasks",
                label: "Công việc của tôi",
                icon: <List size={20} />,
            },
            // {
            //     id: "newTask",
            //     label: "Tạo mới",
            //     icon: <LayersPlus size={20} />
            // },
            {
                id: "workspace",
                label: "Dự án",
                icon: <File size={20} />
            },
            {
                id: "timesheet",
                label: "Timesheet",
                icon: <Clock size={20} />
            }
        );
    }

    const otherItems: MenuItem[] = [
        {
            id: "me",
            label: "Tài khoản",
            icon: <UserCircle size={20} />,
            path: "/main/me"
        },
    ];

    if (isAdmin) {
        menuItems.push({
            id: "personnel",
            label: "Nhân sự",
            icon: <Shield size={20} />,
            path: "/main/personnel"
        },
        {
            id: "project",
            label: "Dự án",
            icon: <File/>,
            path: "/main/project"
        }
        );

    }

    const handleDropdownToggle = (id: string) => {
        if (isCollapsed) {
            setIsCollapsed(false); // Tự động mở rộng nếu click vào menu có dropdown khi đang collapsed
            setTimeout(
                () => setOpenDropdownId(openDropdownId === id ? null : id),
                150
            );
        } else {
            setOpenDropdownId(openDropdownId === id ? null : id);
        }
    };

    const closeMobileSidebar = () => setIsMobileOpen(false);
    const toggleCollapse = () => setIsCollapsed(!isCollapsed);


    return (
        <div className={`
                fixed lg:static inset-y-0 left-0 z-50
                flex flex-col bg-[#0f1f1b] text-white
                transition-all duration-300 ease-in-out 
                border-r border-white
                ${isMobileOpen
                ? "translate-x-0"
                : "-translate-x-full lg:translate-x-0"
            }
                ${isCollapsed ? "lg:w-20" : "lg:w-60"}
                w-72 // Width mặc định trên mobile
                `}>

            {/* Header & Toggle Button */}
            <div
                className={`flex items-center h-16 px-4 border-b border-white ${isCollapsed ? "justify-center" : "justify-between"
                    }`}
            >
                {!isCollapsed && (
                    <div className="flex items-center space-x-3 overflow-hidden">
                        <img src={LogoImage} alt="Logo" width={40} />
                        <span className="font-bold text-xl truncate">Task Manager</span>
                    </div>
                )}
                {isCollapsed && (
                    <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                        <GraduationCap color="teal" />
                    </div>
                )}

                {/* Desktop Collapse Button */}
                <button
                    onClick={toggleCollapse}
                    className="hidden lg:flex p-1.5 rounded-md hover:bg-teal-800 transition-colors absolute -right-3 top-5 bg-teal-600 border border-white shadow-sm"
                    title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
                >
                    {isCollapsed ? (
                        <ChevronRight size={16} />
                    ) : (
                        <ChevronLeft size={16} />
                    )}
                </button>
            </div>

            <div className="text-sm flex-1 overflow-y-auto py-4 scrollbar-thin scrollbar-thumb-teal-600 scrollbar-track-transparent">
                {/* Main Navigation */}
                <nav className="px-3 space-y-1">
                    {menuItems.map((item) => (
                        <div key={item.id}>
                            {item.subItem ? (
                                /* Dropdown Menu Item */
                                <div>
                                    <button
                                        onClick={() => handleDropdownToggle(item.id)}
                                        className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
                                ${openDropdownId === item.id
                                                ? "bg-teal-600"
                                                : "hover:bg-teal-800/50"
                                            }
                                ${isCollapsed ? "justify-center" : "justify-between"}
                            `}
                                        title={isCollapsed ? item.label : ""}
                                    >
                                        <div
                                            className={`flex items-center ${isCollapsed ? "" : "space-x-3"
                                                }`}
                                        >
                                            <span className="flex-shrink-0">{item.icon}</span>
                                            {!isCollapsed && (
                                                <span className="font-medium truncate ml-3">
                                                    {item.label}
                                                </span>
                                            )}
                                        </div>
                                        {!isCollapsed && (
                                            <span className="ml-auto">
                                                {openDropdownId === item.id ? (
                                                    <ChevronDown size={18} />
                                                ) : (
                                                    <ChevronRight size={18} />
                                                )}
                                            </span>
                                        )}
                                    </button>

                                    {/* Sub-menu */}
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ease-in-out ${openDropdownId === item.id && !isCollapsed
                                            ? "max-h-96 opacity-100 mt-1"
                                            : "max-h-0 opacity-0"
                                            }`}
                                    >
                                        <div className="bg-teal-900/40 rounded-lg mt-1 py-1">
                                            {item.subItem.map((sub) => (
                                                <NavLink
                                                    key={sub.id}
                                                    to={`/main/${sub.id}`}
                                                    onClick={closeMobileSidebar}
                                                    className={({ isActive }) =>
                                                        `block pl-11 pr-3 py-2 text-sm rounded-md transition-colors truncate
                                        ${isActive
                                                            ? "text-white font-medium bg-teal-600/50"
                                                            : "text-teal-100 hover:text-white hover:bg-teal-800/50"
                                                        }
                                        `
                                                    }
                                                >
                                                    {sub.label}
                                                </NavLink>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ) : item.id === "newTask" ? (
                                <button
                                    onClick={() => {
                                        closeMobileSidebar();
                                        if (onOpenCreateTask) onOpenCreateTask();
                                    }}
                                    className={`w-full flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200 hover:bg-teal-800/50 ${isCollapsed ? "justify-center" : ""}`}
                                    title={isCollapsed ? item.label : ""}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {!isCollapsed && (
                                        <span className="font-medium truncate ml-3">
                                            {item.label}
                                        </span>
                                    )}
                                </button>
                            ) : (
                                /* Normal Menu Item */
                                <NavLink
                                    to={
                                        item.id === "dashboard"
                                            ? "/main/dashboard"
                                            : `/main/${item.id}`
                                    }
                                    end={item.id === "dashboard"}
                                    onClick={closeMobileSidebar}
                                    className={({ isActive }) =>
                                        `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
                            ${isActive ? "bg-teal-600/40 text-teal-300" : "hover:bg-teal-800/50"}
                            ${isCollapsed ? "justify-center" : ""}
                            `
                                    }
                                    title={isCollapsed ? item.label : ""}
                                >
                                    <span className="flex-shrink-0">{item.icon}</span>
                                    {!isCollapsed && (
                                        <span className="font-medium truncate ml-3">
                                            {item.label}
                                        </span>
                                    )}
                                </NavLink>
                            )}
                        </div>
                    ))}
                </nav>

                {/* Divider */}
                {!isCollapsed && (
                    <div className="px-6 my-6">
                        <div className="h-px bg-white"></div>
                    </div>
                )}
                {isCollapsed && <div className="my-4 h-px bg-white mx-4"></div>}
                {/* Other Items */}
                <nav className="px-3 space-y-1">
                    {otherItems.map((item) => (
                        <NavLink
                            key={item.id}
                            to={item.path || `/main/${item.id}`}
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                                `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
                        ${isActive ? "bg-teal-600/40 text-teal-300" : "hover:bg-teal-800/50"}
                        ${isCollapsed ? "justify-center" : ""}
                        `
                            }
                            title={isCollapsed ? item.label : ""}
                        >
                            <span className="flex-shrink-0">{item.icon}</span>
                            {!isCollapsed && (
                                <span className="font-medium truncate ml-3">
                                    {item.label}
                                </span>
                            )}
                        </NavLink>
                    ))}
                </nav>

                {/* Nút Đăng Xuất */}
                <div className="px-3 mt-4 mb-6 absolute bottom-0 w-full">
                    <button
                        onClick={handleLogout}
                        className={`w-full flex items-center px-3 py-2.5 rounded-lg text-red-400 hover:text-white hover:bg-red-500/80 transition-colors duration-200
                        ${isCollapsed ? "justify-center" : ""}`}
                        title={isCollapsed ? "Đăng xuất" : ""}
                    >
                        <span className="flex-shrink-0"><LogOut size={20} /></span>
                        {!isCollapsed && (
                            <span className="font-medium truncate ml-3">Đăng xuất</span>
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SideBar;