import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Button } from "@/components/ui/button";
import { LogOut, User, CheckSquare } from "lucide-react";

export const Navbar = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <nav className="border-b bg-white px-8 py-3 flex justify-between items-center shadow-sm">
      <div className="flex items-center gap-2 font-bold text-xl text-primary">
        <CheckSquare className="h-6 w-6" />
        <span>TaskFlow</span>
      </div>
      
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mr-4">
          <User className="h-4 w-4" />
          <span>{user?.name}</span>
        </div>
        <Button variant="ghost" size="sm" onClick={logout}>
          <LogOut className="mr-2 h-4 w-4" /> Logout
        </Button>
      </div>
    </nav>
  );
};