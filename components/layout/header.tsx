"use client";

import * as React from "react"
import { Bell, Search, Menu, X, LogOut } from 'lucide-react';
import ThemeToggle from "@/app/components/ui/ThemeToggle";
import { logout } from "@/app/actions/logout";

interface HeaderProps {
  userName?: string;
  userRole?: string;
  mobileMenu?: React.ReactNode;
}

export function Header({ userName, userRole, mobileMenu }: HeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const initials = userName ? userName.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() : 'U';

  // Close the menu when a link is clicked inside it
  const handleMenuClick = (e: React.MouseEvent) => {
      if ((e.target as HTMLElement).tagName.toLowerCase() === 'a' || (e.target as HTMLElement).closest('a')) {
          setIsMobileMenuOpen(false);
      }
  };

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 sticky top-0 z-10 w-full shadow-sm">
        <div className="flex items-center flex-1">
          {mobileMenu && (
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden p-2 text-slate-500 hover:text-teal-700 dark:hover:text-teal-400 -ml-2 mr-2 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors"
            >
              <Menu size={20} />
            </button>
          )}
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
        <div className="flex items-center gap-2 sm:gap-4">
          <form action={logout} className="flex flex-col justify-center">
            <button 
              type="submit" 
              className="text-rose-500 hover:text-rose-700 dark:text-rose-400 dark:hover:text-rose-300 relative p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-rose-500 transition-colors bg-rose-50 dark:bg-rose-500/10"
              title="Logout"
            >
              <LogOut size={16} className="sm:hidden" />
              <LogOut size={18} className="hidden sm:block" />
            </button>
          </form>

          <ThemeToggle />
          
          <button className="text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 relative p-1 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-500 transition-colors hidden sm:block">
            <Bell size={20} />
            <span className="absolute top-1 right-1 h-2 w-2 bg-rose-500 border-2 border-white dark:border-zinc-900 rounded-full"></span>
          </button>
          
          <div className="flex items-center gap-3 pl-2 sm:pl-4 border-l border-slate-200 dark:border-zinc-800">
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

      {/* Mobile Menu Drawer */}
      {isMobileMenuOpen && mobileMenu && (
        <div className="md:hidden fixed inset-0 z-50 flex">
          <div className="fixed inset-0 bg-slate-900/50 dark:bg-zinc-950/80 backdrop-blur-sm transition-opacity" onClick={() => setIsMobileMenuOpen(false)} />
          <div className="relative w-72 max-w-[80vw] bg-white dark:bg-zinc-900 h-full shadow-2xl flex flex-col animate-in slide-in-from-left duration-300">
            <div className="p-5 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between h-16">
              <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center text-sm font-bold">
                      {initials}
                  </div>
                  <div className="flex flex-col">
                      <span className="text-sm font-bold text-slate-900 dark:text-zinc-100 leading-none">{userName || 'Guest'}</span>
                      <span className="text-xs text-slate-500 dark:text-zinc-400 capitalize">{userRole?.toLowerCase() || 'No Role'}</span>
                  </div>
              </div>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 -mr-2 text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div className="flex-1 overflow-y-auto flex flex-col" onClick={handleMenuClick}>
              {mobileMenu}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
