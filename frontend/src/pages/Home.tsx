import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../features/auth/hooks/useAuth';
import { 
  ShoppingBag, 
  Bike, 
  Store, 
  ChevronRight, 
  TrendingUp, 
  Clock, 
  Star 
} from 'lucide-react';

const Home: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const getRoleData = () => {
    switch (user?.role) {
      case 'rider':
        return {
          icon: Bike,
          message: 'Ready to hits the road? Your next delivery is waiting.',
          stats: [
            { label: 'Today Deliveries', value: '12', icon: Clock },
            { label: 'Rating', value: '4.9', icon: Star },
            { label: 'Earnings', value: '$84.50', icon: TrendingUp },
          ]
        };
      case 'seller':
        return {
          icon: Store,
          message: 'Manage your store and grow your business.',
          stats: [
            { label: 'Active Orders', value: '8', icon: ShoppingBag },
            { label: 'Store Rating', value: '4.8', icon: Star },
            { label: 'Today Sales', value: '$342.10', icon: TrendingUp },
          ]
        };
      default:
        return {
          icon: ShoppingBag,
          message: 'Hungry? Browse your favorite restaurants and order now.',
          stats: [
            { label: 'Active Orders', value: '1', icon: Clock },
            { label: 'Loyalty Points', value: '250', icon: Star },
            { label: 'Total Spent', value: '$120.00', icon: TrendingUp },
          ]
        };
    }
  };

  const roleData = getRoleData();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Welcome Header */}
      <div className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Welcome back, <span className="text-indigo-600 font-black">{user?.name}</span>! 👋
        </h1>
        <p className="text-slate-500 mt-2 text-lg">
          {roleData.message}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {roleData.stats.map((stat, index) => (
          <div 
            key={stat.label}
            className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 flex items-center space-x-4 animate-in fade-in slide-in-from-bottom-6 duration-700"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="w-12 h-12 bg-indigo-50 rounded-2xl flex items-center justify-center">
              <stat.icon className="w-6 h-6 text-indigo-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">{stat.label}</p>
              <p className="text-2xl font-bold text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        <div className="group bg-indigo-600 rounded-3xl p-8 text-white shadow-xl shadow-indigo-200 overflow-hidden relative animate-in fade-in slide-in-from-left-6 duration-700">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold mb-2">Explore the Marketplace</h3>
            <p className="text-indigo-100 mb-6 opacity-80">Discover new bites and trending spots in your area.</p>
            <button className="bg-white text-indigo-600 px-6 py-3 rounded-xl font-bold flex items-center hover:bg-opacity-90 transition-all">
              Start Exploring <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
          <ShoppingBag className="absolute -right-8 -bottom-8 w-48 h-48 text-white opacity-10 group-hover:scale-110 transition-transform duration-500" />
        </div>

        <div className="group bg-white rounded-3xl p-8 border border-slate-200 shadow-sm overflow-hidden relative hover:border-indigo-200 transition-colors animate-in fade-in slide-in-from-right-6 duration-700">
          <div className="relative z-10">
            <h3 className="text-2xl font-bold text-slate-900 mb-2">My Profile</h3>
            <p className="text-slate-500 mb-6 font-medium">Manage your account settings and preferences.</p>
            <button 
              onClick={() => navigate('/profile')}
              className="bg-slate-900 text-white px-6 py-3 rounded-xl font-bold flex items-center hover:bg-slate-800 transition-all"
            >
              Go to Profile <ChevronRight className="ml-2 w-4 h-4" />
            </button>
          </div>
          <roleData.icon className="absolute -right-8 -bottom-8 w-48 h-48 text-slate-100 group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
    </div>
  );
};

export default Home;
