import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, Award, Flame, Heart, MapPin, Edit3, X, Check } from 'lucide-react';
import { updateProfile } from '../services/authService';
import { LOCATIONS } from '../utils/locationData';

const CustomerDashboard = () => {
  const [user, setUser] = useState<any>({});
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ name: '', city: '', area: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        const parsedUser = JSON.parse(rawUser);
        setUser(parsedUser);
        setFormData({ 
          name: parsedUser.name || '', 
          city: parsedUser.city || 'Mumbai', 
          area: parsedUser.area || 'Bandra' 
        });
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });
    
    try {
      const token = localStorage.getItem('token');
      if (!token) throw new Error('No token found');
      
      const updatedUser = await updateProfile(token, formData);
      if (updatedUser._id) {
        // Clear sensitive info before storing
        const storageUser = { ...updatedUser };
        delete storageUser.token;
        localStorage.setItem('user', JSON.stringify(storageUser));
        setUser(storageUser);
        setIsEditing(false);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
        
        // Refresh page to update other components that might use user data
        window.location.reload();
      } else {
        setMessage({ type: 'error', text: updatedUser.message || 'Update failed' });
      }
    } catch (err: any) {
      console.error(err);
      setMessage({ type: 'error', text: err.message || 'Server error' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {message.text && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`mb-6 p-4 border-4 border-black font-black uppercase flex items-center gap-2 ${message.type === 'success' ? 'bg-[#00E59B]' : 'bg-red-400'}`}
          >
            {message.type === 'success' ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
            {message.text}
          </motion.div>
        )}

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-8 border-black pb-6">
          <div>
            <h1 className="font-display font-black text-5xl md:text-6xl uppercase leading-none">Your Stats</h1>
            <p className="font-medium text-gray-500 text-sm mt-1 uppercase">Track your cravings & orders.</p>
          </div>
          <div className="bg-[#FFD700] border-4 border-black px-6 py-3 shadow-[6px_6px_0px_#000] rotate-2">
            <p className="font-black uppercase text-xl text-black">Top 5% Foodie</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00E59B]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-gray-500">Total Orders</span>
              <Award className="w-6 h-6 stroke-[3] text-black" />
            </div>
            <p className="font-display font-black text-7xl mt-4">24</p>
            <p className="text-sm font-bold uppercase mt-2">All time</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_#FFD700]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-gray-400">Current Streak</span>
              <Flame className="w-6 h-6 stroke-[3] text-[#FFD700]" />
            </div>
            <p className="font-display font-black text-7xl mt-4">3</p>
            <p className="text-sm font-bold uppercase mt-2 text-[#FFD700]">Days in a row</p>
          </motion.div>
          
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-brand-600 text-white border-4 border-black p-6 shadow-[8px_8px_0px_#00E59B]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-brand-200">Total Saved</span>
              <TrendingUp className="w-6 h-6 stroke-[3] text-white" />
            </div>
            <p className="font-display font-black text-6xl mt-4">₹1,240</p>
            <p className="text-sm font-bold uppercase mt-2">From deals</p>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#f4f0ea] border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
                <h2 className="font-display font-black text-3xl uppercase flex items-center gap-2 mb-6 border-b-4 border-black pb-4"><Heart className="w-6 h-6 fill-current" /> Favorite Cuisines</h2>
                <div className="space-y-4">
                    <div className="bg-white border-4 border-black p-4 flex justify-between items-center hover:translate-x-1 transition-transform">
                        <span className="font-bold uppercase text-lg">Italian</span>
                        <span className="bg-[#00E59B] px-3 py-1 font-black border-2 border-black">12 Orders</span>
                    </div>
                    <div className="bg-white border-4 border-black p-4 flex justify-between items-center hover:translate-x-1 transition-transform">
                        <span className="font-bold uppercase text-lg">Indian</span>
                        <span className="bg-[#00E59B] px-3 py-1 font-black border-2 border-black">8 Orders</span>
                    </div>
                    <div className="bg-white border-4 border-black p-4 flex justify-between items-center hover:translate-x-1 transition-transform">
                        <span className="font-bold uppercase text-lg">Fast Food</span>
                        <span className="bg-[#00E59B] px-3 py-1 font-black border-2 border-black">4 Orders</span>
                    </div>
                </div>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
                <h2 className="font-display font-black text-3xl uppercase flex items-center gap-2 mb-6 border-b-4 border-black pb-4"><MapPin className="w-6 h-6" /> User Info</h2>
                
                {isEditing ? (
                  <form onSubmit={handleUpdate} className="space-y-4">
                    <div>
                      <label className="block text-xs font-black uppercase mb-1">Name</label>
                      <input 
                        type="text" 
                        value={formData.name}
                        onChange={e => setFormData({...formData, name: e.target.value})}
                        className="w-full bg-[#f4f0ea] border-4 border-black p-3 font-bold uppercase outline-none focus:bg-white"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black uppercase mb-1">City</label>
                        <select 
                          value={formData.city}
                          onChange={e => setFormData({...formData, city: e.target.value, area: (LOCATIONS as any)[e.target.value][0]})}
                          className="w-full bg-[#f4f0ea] border-4 border-black p-3 font-bold uppercase outline-none focus:bg-white"
                        >
                          {Object.keys(LOCATIONS).map(city => (
                            <option key={city} value={city}>{city}</option>
                          ))}
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-black uppercase mb-1">Area</label>
                        <select 
                          value={formData.area}
                          onChange={e => setFormData({...formData, area: e.target.value})}
                          className="w-full bg-[#f4f0ea] border-4 border-black p-3 font-bold uppercase outline-none focus:bg-white"
                        >
                          {(LOCATIONS as any)[formData.city].map((area: string) => (
                            <option key={area} value={area}>{area}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className="flex gap-4 pt-4">
                      <button 
                        type="submit"
                        disabled={loading}
                        className="flex-1 bg-[#00E59B] text-black px-6 py-3 font-black border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      >
                        {loading ? 'Saving...' : 'Save Changes'}
                      </button>
                      <button 
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-white text-black px-6 py-3 font-black border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <div className="space-y-4 flex flex-col items-start font-bold uppercase">
                      <div className="w-full flex justify-between border-b-2 border-gray-100 pb-2">
                          <span className="text-gray-500">Name</span>
                          <span className="text-black">{user?.name || 'Customer'}</span>
                      </div>
                      <div className="w-full flex justify-between border-b-2 border-gray-100 pb-2">
                          <span className="text-gray-500">Email</span>
                          <span className="text-black text-xs md:text-sm normal-case">{user?.email || 'customer@fooddash.com'}</span>
                      </div>
                      <div className="w-full flex justify-between border-b-2 border-gray-100 pb-2">
                          <span className="text-gray-500">City</span>
                          <span className="text-black">{user?.city || 'Unknown'}</span>
                      </div>
                      <div className="w-full flex justify-between border-b-2 border-gray-100 pb-2">
                          <span className="text-gray-500">Area</span>
                          <span className="text-black">{user?.area || 'Unknown'}</span>
                      </div>
                      <button 
                        onClick={() => setIsEditing(true)}
                        className="bg-black text-white px-6 py-3 font-black w-full border-4 border-black shadow-[4px_4px_0px_#FFD700] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all mt-4 flex items-center justify-center gap-2"
                      >
                        <Edit3 className="w-5 h-5" /> Edit Profile
                      </button>
                  </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
