import React from "react";
import { NavLink } from "react-router-dom";
import { 
    List, 
    ChevronDown, 
    ChevronRight,  
    LayoutDashboard, 
    ChevronLeft,
    GraduationCap,
    Calendar,
    UserCircle,
    LayersPlus
} from "lucide-react";


interface MenuItem {
    id: string;
    label: string;
    icon: React.ReactNode;
    subItem?: {
        id: string;
        label: string;
    }[];
}

const SideBar: React.FC = () => {
    const [isMobileOpen, setIsMobileOpen] = React.useState(false);
    const [isCollapsed, setIsCollapsed] = React.useState(false);
    const [openDropdownId, setOpenDropdownId] = React.useState<string | null>(null);

    const menuItems: MenuItem[] = [
        {
            id: "dashboard",
            label: "Tổng quan",
            icon: <LayoutDashboard size={20} />,
        },
        {
            id: "tasks",
            label: "Công việc của tôi",
            icon: <List size={20} />,
        }, 
        {
            id: "newTask",
            label: "Tạo mới",
            icon: <LayersPlus size={20}/>
        }, 
        {
            id: "calendar",
            label: "Lịch",
            icon: <Calendar size={20}/>
        }
    ]

    const otherItems: MenuItem[] = [
        {
        id: "me",
        label: "Tài khoản",
        icon: <UserCircle size={20} />,
        },
    ];

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
                ${
                    isMobileOpen
                    ? "translate-x-0"
                    : "-translate-x-full lg:translate-x-0"
                }
                ${isCollapsed ? "lg:w-20" : "lg:w-60"}
                w-72 // Width mặc định trên mobile
                `}>

                    {/* Header & Toggle Button */}
            <div
            className={`flex items-center h-16 px-4 border-b border-white ${
                isCollapsed ? "justify-center" : "justify-between"
            }`}
            >
            {!isCollapsed && (
                <div className="flex items-center space-x-3 overflow-hidden">
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap color="green"/>
                </div>
                <span className="font-bold text-xl truncate">To-do App</span>
                </div>
            )}
            {isCollapsed && (
                <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center flex-shrink-0">
                    <GraduationCap color="green"/>
                </div>
            )}

            {/* Desktop Collapse Button */}
            <button
                onClick={toggleCollapse}
                className="hidden lg:flex p-1.5 rounded-md hover:bg-green-600 transition-colors absolute -right-3 top-5 bg-green-500 border border-white shadow-sm"
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
                                ${
                                openDropdownId === item.id
                                    ? "bg-teal-600"
                                    : "hover:bg-green-700"
                                }
                                ${isCollapsed ? "justify-center" : "justify-between"}
                            `}
                            title={isCollapsed ? item.label : ""}
                            >
                            <div
                                className={`flex items-center ${
                                isCollapsed ? "" : "space-x-3"
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
                            className={`overflow-hidden transition-all duration-300 ease-in-out ${
                                openDropdownId === item.id && !isCollapsed
                                ? "max-h-96 opacity-100 mt-1"
                                : "max-h-0 opacity-0"
                            }`}
                            >
                            <div className="bg-teal-600/30 rounded-lg mt-1 py-1">
                                {item.subItem.map((sub) => (
                                <NavLink
                                    key={sub.id}
                                    to={`/todoapp/${sub.id}`}
                                    onClick={closeMobileSidebar}
                                    className={({ isActive }) =>
                                    `block pl-11 pr-3 py-2 text-sm rounded-md transition-colors truncate
                                        ${
                                        isActive
                                            ? "text-white font-medium bg-teal-600/50"
                                            : "text-teal-100 hover:text-white hover:bg-green-700"
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
                        ) : (
                        /* Normal Menu Item */
                        <NavLink
                            to={
                            item.id === "dashboard"
                                ? "/todoapp/dashboard"
                                : `/todoapp/${item.id}`
                            }
                            end={item.id === "dashboard"}
                            onClick={closeMobileSidebar}
                            className={({ isActive }) =>
                            `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
                            ${isActive ? "bg-green-600" : "hover:bg-green-700"}
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
                        to={`/admin/${item.id}`}
                        onClick={closeMobileSidebar}
                        className={({ isActive }) =>
                        `flex items-center px-3 py-2.5 rounded-lg transition-colors duration-200
                        ${isActive ? "bg-green-600" : "hover:bg-green-700"}
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
            </div>
        </div>    
    );
};

export default SideBar;