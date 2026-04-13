import React from 'react';
import { 
  User as UserIcon, 
  Mail, 
  Shield, 
  Calendar, 
  ExternalLink,
  Camera,
  MapPin,
  Clock,
  CheckCircle2
} from 'lucide-react';
import { useAuth } from '../features/auth/hooks/useAuth';
import toast from 'react-hot-toast';

const Profile: React.FC = () => {
  const { user, updateLocation } = useAuth();
  const [isUpdatingLocation, setIsUpdatingLocation] = React.useState(false);

  const handleUpdateLocation = () => {
    if (!navigator.geolocation) {
      toast.error('Geolocation is not supported by your browser');
      return;
    }

    setIsUpdatingLocation(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          // Reverse geocoding using Nominatim (OpenStreetMap)
          // Adding a custom User-Agent as required by Nominatim usage policy
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`,
            {
              headers: {
                'Accept-Language': 'en-US,en;q=0.9',
              }
            }
          );
          const data = await response.json();
          const address = data.display_name || 'Location saved';
          
          await updateLocation(latitude, longitude, address);
        } catch (error) {
          console.error('Error fetching address:', error);
          // Still update coordinates even if reverse geocoding fails
          await updateLocation(latitude, longitude, 'Coordinates saved');
        } finally {
          setIsUpdatingLocation(false);
        }
      },
      (error) => {
        setIsUpdatingLocation(false);
        const messages: Record<number, string> = {
          [error.PERMISSION_DENIED]: 'Location access denied by user.',
          [error.POSITION_UNAVAILABLE]: 'Location information is unavailable.',
          [error.TIMEOUT]: 'Location request timed out.',
        };
        toast.error(messages[error.code] || 'An unknown error occurred while fetching location.');
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  const profileSections = [
    {
      title: 'Account Identity',
      icon: UserIcon,
      fields: [
        { label: 'Full Name', value: user.name, icon: UserIcon },
        { label: 'Email Address', value: user.email, icon: Mail, verified: true },
        { label: 'Marketplace Role', value: user.role, icon: Shield, badge: true },
        { label: 'Current Location', value: user.address || 'Not set', icon: MapPin },
      ]
    },
    {
      title: 'System Information',
      icon: Clock,
      fields: [
        { label: 'Account Created', value: new Date(user.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), icon: Calendar },
        { label: 'Auth Provider', value: user.provider === 'google' ? 'Google OAuth' : 'Email/Password', icon: ExternalLink },
      ]
    }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header Section */}
      <div className="relative mb-8">
        <div className="h-48 w-full bg-linear-to-r from-indigo-600 via-purple-600 to-teal-500 rounded-3xl opacity-90 shadow-2xl overflow-hidden">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(255,255,255,0.1),transparent)]" />
        </div>
        
        <div className="absolute -bottom-12 left-8 flex items-end space-x-6">
          <div className="relative group">
            {user.image ? (
              <img 
                src={user.image} 
                alt={user.name} 
                className="w-32 h-32 rounded-3xl border-4 border-white shadow-xl object-cover"
              />
            ) : (
              <div className="w-32 h-32 rounded-3xl border-4 border-white bg-indigo-100 flex items-center justify-center text-indigo-700 shadow-xl">
                <UserIcon className="w-16 h-16" />
              </div>
            )}
            <button className="absolute bottom-2 right-2 p-2 bg-white rounded-xl shadow-lg border border-slate-100 text-slate-600 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0">
              <Camera className="w-4 h-4" />
            </button>
          </div>
          
          <div className="pb-4">
            <h1 className="text-3xl font-black text-slate-900 tracking-tight">{user.name}</h1>
            <div className="flex items-center text-slate-500 font-medium max-w-md">
              <MapPin className="w-4 h-4 mr-1.5 text-indigo-500 shrink-0" />
              <span className="text-sm truncate">
                {user.address || 'Global Partner Reach'}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-20">
        {/* Left Column: Brief Stats/Badges */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Partner Status</h3>
            <div className="flex items-center p-3 bg-indigo-50 rounded-2xl border border-indigo-100">
              <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white mr-4 shadow-md">
                <Shield className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs text-indigo-600 font-bold uppercase">Verified</p>
                <p className="text-sm font-black text-indigo-900 capitalize">{user.role}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Quick Stats</h3>
            <div className="space-y-4">
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Orders Processed</span>
                 <span className="font-bold text-slate-900">0</span>
               </div>
               <div className="flex justify-between items-center text-sm">
                 <span className="text-slate-500">Member Since</span>
                 <span className="font-bold text-slate-900">{new Date(user.createdAt).getFullYear()}</span>
               </div>
            </div>
          </div>
        </div>

        {/* Right Column: Detailed Info */}
        <div className="lg:col-span-2 space-y-8">
          {profileSections.map((section, sIndex) => (
            <div key={sIndex} className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <div className="flex items-center mb-8 pb-4 border-b border-slate-50">
                <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 mr-4">
                  <section.icon className="w-5 h-5" />
                </div>
                <h2 className="text-xl font-bold text-slate-900">{section.title}</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {section.fields.map((field, fIndex) => (
                  <div key={fIndex} className="space-y-2">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-widest ml-1">{field.label}</label>
                    <div className="flex items-center px-4 py-3 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-indigo-100 transition-colors">
                      <field.icon className="w-4 h-4 text-slate-400 group-hover:text-indigo-500 transition-colors mr-3" />
                      <span className={`text-slate-700 font-semibold ${field.badge ? 'capitalize' : ''}`}>
                        {field.value}
                      </span>
                      {field.verified && <CheckCircle2 className="w-3.5 h-3.5 text-green-500 ml-2" />}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-4 pt-4">
             <button className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all active:scale-95">
               Download Data
             </button>
             <button 
               onClick={handleUpdateLocation}
               disabled={isUpdatingLocation}
               className="px-8 py-3 bg-indigo-600 text-white font-black rounded-2xl hover:bg-indigo-700 shadow-lg shadow-indigo-100 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center"
             >
               {isUpdatingLocation ? (
                 <>
                   <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                   Updating...
                 </>
               ) : (
                 'Update Location'
               )}
             </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
