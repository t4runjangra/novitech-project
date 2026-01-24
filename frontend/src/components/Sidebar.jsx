import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext'; // Import your hook
import { Button } from "@/components/ui/button";
import {
    CheckSquare,
    LayoutDashboard,
    Clock,
    CheckCircle2,
    LogOut,
    Sun,
    Moon
} from "lucide-react";

export const Sidebar = ({ activeFilter, onFilterChange }) => {
    const { user, logout } = useContext(AuthContext);
    const { theme, toggleTheme } = useTheme(); // Consume the theme context

    const navItems = [
        { id: "all", label: "Dashboard", icon: <LayoutDashboard size={20} /> },
        { id: "pending", label: "Pending", icon: <Clock size={20} /> },
        { id: "completed", label: "Completed", icon: <CheckCircle2 size={20} /> },
    ];

    return (
        <aside className="w-64 h-screen bg-white dark:bg-slate-900 border-r border-slate-100 dark:border-slate-800 flex flex-col fixed left-0 top-0 z-50 transition-colors duration-300">
            {/* Brand Logo */}
            <div className="p-6 flex items-center gap-3 font-bold text-xl text-blue-600 dark:text-blue-400">
                <CheckSquare className="h-6 w-6" />
                <span>TaskFlow</span>
            </div>

            {/* Navigation Links */}
            <nav className="flex-1 px-4 space-y-2 mt-4">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => onFilterChange(item.id)}
                        className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                            activeFilter === item.id
                                ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                                : "text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                        }`}
                    >
                        {item.icon}
                        {item.label}
                    </button>
                ))}
            </nav>

            {/* Bottom Section: Theme Toggle & User Info */}
            <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
                
                {/* Theme Toggle Button */}
                <Button 
                    variant="ghost" 
                    className="w-full justify-start text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800"
                    onClick={toggleTheme}
                >
                    {theme === 'light' ? (
                        <>
                            <Moon className="mr-3 h-4 w-4" />
                            <span>Dark Mode</span>
                        </>
                    ) : (
                        <>
                            <Sun className="mr-3 h-4 w-4" />
                            <span>Light Mode</span>
                        </>
                    )}
                </Button>

                {/* User Info Card */}
                <div className="flex items-center gap-3 px-3 py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                    <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                        {user?.name?.charAt(0) || "U"}
                    </div>
                    <div className="flex flex-col truncate">
                        <span className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate w-32">
                            {user?.name}
                        </span>
                        <span className="text-xs text-slate-500 dark:text-slate-400 truncate w-32">
                            {user?.email}
                        </span>
                    </div>
                </div>

                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 mt-2"
                    onClick={logout}
                >
                    <LogOut className="mr-3 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </aside>
    );
};