import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import {
    CheckSquare,
    LayoutDashboard,
    Clock,
    CheckCircle2,
    LogOut,
    User
} from "lucide-react";

export const Sidebar = () => {
    const { user, logout } = useContext(AuthContext);

    const navItems = [
        { label: "Dashboard", icon: <LayoutDashboard size={20} />, active: true },
        { label: "Pending", icon: <Clock size={20} />, active: false },
        { label: "Completed", icon: <CheckCircle2 size={20} />, active: false },
    ];

    return (
        <aside className="w-64 h-screen bg-white border-r border-slate-100 flex flex-col fixed left-0 top-0">
            <div className="p-6 flex items-center gap-3 font-bold text-xl text-blue-600">
                <CheckSquare className="h-6 w-6" />
                <span>TaskFlow</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <button
                        key={item.label}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${item.active
                            ? "bg-blue-50 text-blue-600"
                            : "text-slate-600 hover:bg-slate-50"
                            }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            <div className="p-4 border-t border-slate-100">
                <div className="flex items-center gap-3 px-3 py-4 mb-2">
                    <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col">
                        <span className="text-sm font-semibold text-slate-800 truncate w-32">
                            {user?.name}
                        </span>
                        <span className="text-xs text-slate-500 truncate w-32">
                            {user?.email}
                        </span>
                    </div>
                </div>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={logout}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};