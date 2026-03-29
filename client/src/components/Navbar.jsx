import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Bell, Search, User } from 'lucide-react';

const Navbar = () => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 z-10">
      <div className="relative w-96">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400">
          <Search size={18} />
        </span>
        <input
          type="text"
          placeholder="Search devices or events..."
          className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/10 focus:border-indigo-500 transition-all font-medium text-slate-600"
        />
      </div>

      <div className="flex items-center gap-6">
        <button className="relative p-2 text-slate-600 hover:bg-slate-50 rounded-lg transition-all">
          <Bell size={22} />
          <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-slate-200"></div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="text-sm font-bold text-slate-900">{user?.name}</p>
            <p className="text-xs font-semibold text-slate-500 capitalize">{user?.role}</p>
          </div>
          <div className="h-10 w-10 bg-indigo-100 rounded-xl flex items-center justify-center text-indigo-600">
            <User size={24} />
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
