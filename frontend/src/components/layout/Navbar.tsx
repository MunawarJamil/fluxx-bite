import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LogOut, 
  Menu, 
  X, 
  User as UserIcon, 
  Bell, 
  Settings,
  ShieldCheck
} from 'lucide-react';
import { useAuth } from '../../features/auth/hooks/useAuth';

const Navbar: React.FC = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center group">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white group-hover:rotate-12 transition-transform duration-300">
                <span className="text-xl font-bold italic">F</span>
              </div>
              <span className="ml-3 text-xl font-bold text-slate-900 tracking-tight">
                Fluxx<span className="text-indigo-600">Bite</span>
              </span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <div className="flex items-center space-x-2 px-3 py-1 bg-slate-100 rounded-full text-sm font-medium text-slate-600">
                   <ShieldCheck className="w-4 h-4 text-indigo-500" />
                   <span className="capitalize">{user?.role}</span>
                </div>

                <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors">
                  <Bell className="w-5 h-5" />
                </button>

                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 p-1 rounded-full hover:bg-slate-100 transition-colors"
                  >
                    {user?.image ? (
                      <img className="h-8 w-8 rounded-full border border-slate-200" src={user.image} alt={user.name} />
                    ) : (
                      <div className="h-8 w-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700">
                        <UserIcon className="w-5 h-5" />
                      </div>
                    )}
                    <span className="text-sm font-medium text-slate-700">{user?.name}</span>
                  </button>

                  {isProfileOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-2xl shadow-2xl border border-slate-100 py-2 animate-in fade-in zoom-in duration-200">
                      <Link to="/profile" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <UserIcon className="w-4 h-4 mr-3 text-slate-400" /> My Profile
                      </Link>
                      <Link to="/settings" className="flex items-center px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors">
                        <Settings className="w-4 h-4 mr-3 text-slate-400" /> Settings
                      </Link>
                      <hr className="my-1 border-slate-100" />
                      <button 
                        onClick={handleLogout}
                        className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                      >
                        <LogOut className="w-4 h-4 mr-3" /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-sm font-medium text-slate-700 hover:text-indigo-600 transition-colors">
                  Sign in
                </Link>
                <Link to="/register" className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-lg shadow-indigo-200 transition-all">
                  Get Started
                </Link>
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-xl text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-slate-100 py-4 animate-in slide-in-from-top duration-300">
          {isAuthenticated ? (
            <div className="px-4 space-y-4">
              <div className="flex items-center space-x-3 mb-6 p-2 bg-slate-50 rounded-2xl">
                {user?.image ? (
                  <img className="h-10 w-10 rounded-full" src={user.image} alt="" />
                ) : (
                  <div className="h-10 w-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 text-xl font-bold">
                    {user?.name.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="text-sm font-bold text-slate-900">{user?.name}</p>
                  <p className="text-xs text-slate-500">{user?.email}</p>
                </div>
              </div>
              <div className="space-y-1">
                <Link to="/profile" className="block px-4 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 rounded-xl">My Profile</Link>
                <Link to="/settings" className="block px-4 py-2 text-base font-medium text-slate-700 hover:bg-indigo-50 rounded-xl">Settings</Link>
                <button 
                  onClick={handleLogout}
                  className="w-full text-left block px-4 py-2 text-base font-medium text-red-600 hover:bg-red-50 rounded-xl"
                >
                  Sign out
                </button>
              </div>
            </div>
          ) : (
            <div className="px-4 space-y-2">
              <Link to="/login" className="block px-4 py-3 text-base font-medium text-slate-700 hover:bg-slate-50 rounded-xl transition-colors">Sign in</Link>
              <Link to="/get-started" className="block px-4 py-3 text-base font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors text-center shadow-lg shadow-indigo-200">Get Started</Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
