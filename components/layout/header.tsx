import * as React from "react"
import { Bell, Search, Menu } from 'lucide-react';
import ThemeToggle from "@/app/components/ui/ThemeToggle";

interface HeaderProps {
  userName?: string;
  userRole?: string;
}

export function Header({ userName, userRole }: HeaderProps) {
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 w-full shadow-sm">
      <div className="flex items-center flex-1">
        <button className="md:hidden p-2 text-slate-500 hover:text-slate-700 -ml-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors">
          <Menu size={20} />
        </button>
        <div className="hidden sm:flex items-center w-full max-w-md">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400 dark:text-zinc-500" />
            <input 
              type="search" 
              placeholder="Search patients, doctors..." 
              className="w-full pl-9 pr-4 py-1.5 bg-slate-100 dark:bg-zinc-800/80 border-transparent rounded-lg text-sm text-slate-900 dark:text-zinc-100 placeholder-slate-400 dark:placeholder-zinc-500 focus:bg-white focus:border-teal-500 focus:ring-2 focus:ring-teal-500/20 transition-all outline-none"
            />
          </div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <button className="text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors">
          <Bell size={20} />
          <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-zinc-800">
          <div className="hidden md:block text-right">
            <p className="text-sm font-medium text-slate-900 dark:text-zinc-100 leading-none">{userName || 'Guest'}</p>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1 capitalize">{userRole?.toLowerCase() || 'No Role'}</p>
          </div>
          <button className="flex items-center justify-center h-8 w-8 rounded-full bg-teal-600 text-white text-sm font-medium shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:ring-offset-2 dark:focus:ring-offset-zinc-900 hover:bg-teal-700 transition-colors">
            {initials}
          </button>
        </div>
      </div>
    </header>
  );
}
