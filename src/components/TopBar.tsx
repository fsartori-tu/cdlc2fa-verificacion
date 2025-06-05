
import React from 'react';
import { LogOut } from 'lucide-react';

interface TopBarProps {
  username: string;
  onLogout: () => void;
}

const TopBar: React.FC<TopBarProps> = ({ username, onLogout }) => {
  return (
    <div className="w-full bg-gray-50 border-b px-6 py-3 flex justify-end items-center">
      <div className="flex items-center space-x-3">
        <span className="text-sm font-medium text-gray-700">{username}</span>
        <button
          onClick={onLogout}
          className="flex items-center space-x-1 text-sm text-gray-600 hover:text-gray-800 transition-colors"
        >
          <LogOut className="h-4 w-4" />
          <span>Cerrar sesión</span>
        </button>
      </div>
    </div>
  );
};

export default TopBar;
