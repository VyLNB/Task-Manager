import React from 'react';
import type { WorkspaceInterface, UserInterface } from '../../interfaces/workspace';

interface WorkspaceCardProps {
    workspace: WorkspaceInterface;
    category?: string;
    leader: UserInterface;
    activeTasks?: number;
    onOpen?: (workspaceId: string) => void;
}

export const WorkspaceCard: React.FC<WorkspaceCardProps> = ({
    workspace,
    category,
    leader,
    activeTasks = 0,
    onOpen,
}) => {
    const allUsersMap = new Map<string, UserInterface>();
    allUsersMap.set(workspace.leader._id, workspace.leader);
    workspace.members.forEach(member => allUsersMap.set(member._id, member));

    const allUniqueUsers = Array.from(allUsersMap.values());

    const displayUsers = allUniqueUsers.slice(0, 2);

    const extraMembersCount = allUniqueUsers.length > 2 ? allUniqueUsers.length - 2 : 0;

    return (
        <div className="w-full max-w-md bg-[#1a261e] rounded-3xl p-6 font-sans shadow-lg">

            {/* --- Top Section: Icon & Badge --- */}
            <div className="flex items-start justify-between mb-6">
                <div className="w-14 h-14 rounded-full bg-[#283b2e] flex items-center justify-center text-[#7bf192]">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="10" y="3" width="4" height="4" rx="1" />
                        <path d="M12 7v4" />
                        <path d="M6 11h12" />
                        <path d="M6 11v4" />
                        <rect x="4" y="15" width="4" height="4" rx="1" />
                        <path d="M12 11v4" />
                        <rect x="10" y="15" width="4" height="4" rx="1" />
                        <path d="M18 11v4" />
                        <rect x="16" y="15" width="4" height="4" rx="1" />
                    </svg>
                </div>

                <div className="bg-[#213526] px-3 py-1.5 rounded-full">
                    <span className="text-[#7bf192] text-[11px] font-black tracking-widest uppercase">
                        {category}
                    </span>
                </div>
            </div>

            {/* --- Middle Section: Title & Description --- */}
            <div className="mb-8">
                <h2 className="text-white text-2xl font-bold mb-2 tracking-wide truncate">
                    {workspace.name}
                </h2>
                <p className="text-[#8a9f91] text-sm leading-relaxed pr-4 line-clamp-2">
                    Leader: {leader.fullName}
                </p>
            </div>

            {/* --- Bottom Section: Avatars, Tasks & Button --- */}
            <div className="flex items-end justify-between">

                {/* Avatars Stack */}
                <div className="flex -space-x-3">
                    {displayUsers.map((user) => (
                        <img
                            key={user._id}
                            // Dùng API tạo avatar từ tên vì interface User chưa có thuộc tính avatar/image
                            src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.fullName)}&background=283b2e&color=7bf192&bold=true`}
                            alt={user.fullName}
                            title={user.fullName} // Hover vào ảnh sẽ hiện tên
                            className="w-11 h-11 rounded-full border-[3px] border-[#1a261e] object-cover"
                        />
                    ))}

                    {extraMembersCount > 0 && (
                        <div className="w-11 h-11 rounded-full bg-[#283b2e] border-[3px] border-[#1a261e] flex items-center justify-center z-10">
                            <span className="text-[#a0b8a8] text-xs font-bold">
                                +{extraMembersCount}
                            </span>
                        </div>
                    )}
                </div>

                {/* Active Tasks & Button */}
                <div className="flex items-center gap-5">
                    <button
                        onClick={() => onOpen && onOpen(workspace._id)}
                        className="bg-[#7bf192] text-[#1a261e] px-6 py-2.5 rounded-full font-bold text-sm hover:bg-[#69db80] transition-colors focus:outline-none focus:ring-2 focus:ring-[#7bf192] focus:ring-offset-2 focus:ring-offset-[#1a261e]"
                    >
                        Mở
                    </button>
                </div>
            </div>

        </div>
    );
};