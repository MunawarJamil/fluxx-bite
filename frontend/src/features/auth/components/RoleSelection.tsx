import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShoppingBag, Bike, Store, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import type { UserRole } from '../types/auth.types';

const RoleSelection: React.FC = () => {
  const { updateUserRole, isLoading, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleRoleSelect = async (role: UserRole) => {
    try {
      await updateUserRole(role);
      navigate('/');
    } catch (error) {
      console.error('Failed to update role:', error);
    }
  };

  const roles = [
    {
      id: 'customer' as UserRole,
      title: 'Customer',
      description: 'Order delicious food and track your delivery in real-time.',
      icon: ShoppingBag,
      color: 'bg-blue-500',
      hoverColor: 'hover:border-blue-500',
      iconColor: 'text-blue-500',
    },
    {
      id: 'rider' as UserRole,
      title: 'Rider',
      description: 'Join our delivery team and earn by delivering bites to neighbors.',
      icon: Bike,
      color: 'bg-orange-500',
      hoverColor: 'hover:border-orange-500',
      iconColor: 'text-orange-500',
    },
    {
      id: 'seller' as UserRole,
      title: 'Seller',
      description: 'Partner with us and reach thousands of hungry customers.',
      icon: Store,
      color: 'bg-green-500',
      hoverColor: 'hover:border-green-500',
      iconColor: 'text-green-500',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-indigo-100 via-slate-50 to-teal-50">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-12 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">
            Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-teal-500">Fluxx-Bite</span>
          </h1>
          <p className="text-lg text-slate-600">
            How would you like to use the platform today? Choose your role to get started.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {roles.map((role, index) => (
            <button
              key={role.id}
              disabled={isLoading}
              onClick={() => handleRoleSelect(role.id)}
              className={`group relative bg-white rounded-3xl p-8 text-left shadow-xl shadow-slate-200/50 border-2 border-transparent ${role.hoverColor} transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed overflow-hidden animate-in fade-in slide-in-from-bottom-8 duration-700`}
              style={{ animationDelay: `${index * 150}ms` }}
            >
              <div className={`w-14 h-14 rounded-2xl ${role.color} bg-opacity-10 flex items-center justify-center mb-6 border border-slate-100 group-hover:scale-110 transition-transform`}>
                <role.icon className={`w-7 h-7 ${role.iconColor}`} />
              </div>
              
              <h3 className="text-2xl font-bold text-slate-800 mb-3">{role.title}</h3>
              <p className="text-slate-500 leading-relaxed mb-6">
                {role.description}
              </p>

              <div className="flex items-center text-sm font-semibold text-slate-400 group-hover:text-slate-900 transition-colors">
                Select {role.title}
                <ArrowRight className="ml-2 w-4 h-4 transform group-hover:translate-x-1 transition-transform" />
              </div>

              {/* Decorative background circle */}
              <div className={`absolute -right-8 -bottom-8 w-24 h-24 rounded-full ${role.color} opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500`}></div>
            </button>
          ))}
        </div>

        {isLoading && (
          <div className="mt-12 flex justify-center">
             <div className="flex items-center space-x-2 text-indigo-600 font-medium">
               <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-indigo-600"></div>
               <span>Setting up your dashboard...</span>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoleSelection;
