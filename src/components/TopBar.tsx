import React from 'react';
import { LogOut } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
interface TopBarProps {
  username: string;
  onLogout: () => void;
}
const TopBar: React.FC<TopBarProps> = ({
  username,
  onLogout
}) => {
  return <div className="w-full bg-white border-b px-6 py-3 flex justify-between items-center">
      {/* Logo on the left */}
      <div className="flex items-center">
        
      </div>
      
      {/* User info and logout on the right */}
      <div className="flex items-center space-x-3">
        <Badge variant="secondary" className="px-3 py-1">
          {username}
        </Badge>
        <button onClick={onLogout} className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors">
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>;
};
export default TopBar;