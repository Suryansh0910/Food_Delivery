import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, TrendingUp, Settings, Leaf, ToggleLeft, ToggleRight, Package, ChevronRight } from 'lucide-react';
import { getMyRestaurantProfile, toggleRestaurantStatus } from '../services/restaurantService';

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const data = await getMyRestaurantProfile();
      setRestaurant(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    try {
      setToggling(true);
      const updated = await toggleRestaurantStatus();
      setRestaurant(updated);
    } catch (err) {
      console.error(err);
    } finally {
      setToggling(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] font-sans">

      {/* Top Banner */}
      <div className="bg-black text-white border-b-8 border-brand-600 px-6 md:px-10 py-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <p className="font-bold text-xs uppercase text-brand-400 tracking-widest mb-1">Owner Portal</p>
            <h1 className="font-display font-black text-5xl uppercase leading-none">
              {loading ? 'Loading...' : restaurant?.name ?? 'Your Kitchen'}
            </h1>
            {restaurant && (
              <p className="font-medium text-gray-400 text-sm mt-1">
                {restaurant.address?.street}, {restaurant.address?.area}, {restaurant.address?.city}
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {restaurant && (
              <button
                onClick={handleToggleStatus}
                disabled={toggling}
                className={`flex items-center gap-2 border-4 border-white px-5 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,0.3)] transition-all hover:translate-x-[2px] hover:translate-y-[2px] ${
                  restaurant.isOpen
                    ? 'bg-[#00E59B] text-black'
                    : 'bg-brand-600 text-white'
                }`}
              >
                {toggling ? (
                  'Updating...'
                ) : restaurant.isOpen ? (
                  <><ToggleRight className="w-5 h-5" /> Live & Open</>
                ) : (
                  <><ToggleLeft className="w-5 h-5" /> Store Closed</>
                )}
              </button>
            )}
            <button className="bg-[#FFD700] text-black border-4 border-white px-5 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[3]" /> Add Item
            </button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-6 md:p-10">

        {/* Status Banners */}
        {restaurant && !restaurant.isApproved && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-[#FFD700] border-4 border-black p-4 shadow-[4px_4px_0px_#000] flex items-center gap-3"
          >
            <div className="w-3 h-3 bg-black rounded-full animate-pulse" />
            <p className="font-black uppercase text-sm">Your restaurant is pending admin approval. Your menu won't be visible to customers yet.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column: Restaurant info */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Live Orders */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#FFD700]">
              <div className="border-b-4 border-black px-6 py-4 flex justify-between items-center">
                <h2 className="font-display font-black text-2xl uppercase">Live Orders</h2>
                <span className={`text-xs font-black uppercase px-3 py-1 border-2 border-black ${restaurant?.isOpen ? 'bg-[#00E59B] animate-pulse' : 'bg-gray-200'}`}>
                  {restaurant?.isOpen ? '● Accepting' : '○ Paused'}
                </span>
              </div>
              <div className="p-8 text-center">
                <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                <p className="font-bold text-gray-500 uppercase text-sm">
                  {restaurant?.isOpen ? 'No orders yet — waiting for the rush!' : 'Open your store to start receiving orders.'}
                </p>
              </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-[#00E59B] border-4 border-black p-5 shadow-[4px_4px_0px_#000]">
                <p className="font-bold text-xs uppercase opacity-60 mb-2">Today's Revenue</p>
                <p className="font-display font-black text-4xl">₹0</p>
                <p className="font-medium text-xs uppercase mt-1 opacity-60">Est. earnings</p>
              </div>
              <div className="bg-[#FFD700] border-4 border-black p-5 shadow-[4px_4px_0px_#000]">
                <p className="font-bold text-xs uppercase opacity-60 mb-2">Total Orders</p>
                <p className="font-display font-black text-4xl">0</p>
                <p className="font-medium text-xs uppercase mt-1 opacity-60">All time</p>
              </div>
            </div>
          </div>

          {/* Right column: Profile card */}
          <div className="flex flex-col gap-4">
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#00E59B] overflow-hidden">
              {restaurant?.image && (
                <div className="h-36 border-b-4 border-black overflow-hidden">
                  <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-5">
                <div className="flex items-center gap-2 mb-3">
                  <h3 className="font-display font-black text-2xl uppercase leading-none flex-1">{restaurant?.name ?? '...'}</h3>
                  {restaurant?.isVegOnly && (
                    <span className="bg-green-100 text-green-700 border-2 border-green-700 p-1">
                      <Leaf className="w-4 h-4" />
                    </span>
                  )}
                </div>
                <p className="font-medium text-gray-600 text-sm mb-4 line-clamp-2">{restaurant?.description}</p>
                <div className="flex flex-col gap-2 border-t-2 border-gray-100 pt-3">
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-500 uppercase">Area</span>
                    <span className="font-black">{restaurant?.address?.area}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-500 uppercase">City</span>
                    <span className="font-black">{restaurant?.address?.city}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-gray-500 uppercase">Hours</span>
                    <span className="font-black text-xs">{restaurant?.timings?.openingTime} – {restaurant?.timings?.closingTime}</span>
                  </div>
                </div>
              </div>
              <button className="w-full border-t-4 border-black px-5 py-3 font-black uppercase text-sm flex items-center justify-between hover:bg-[#FFD700] transition-colors">
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Edit Profile</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>

            <div className="bg-black text-white border-4 border-black p-5 shadow-[4px_4px_0px_#dc2626]">
              <h4 className="font-display font-black text-xl uppercase mb-2 flex items-center gap-2">
                <TrendingUp className="w-5 h-5" /> Analytics
              </h4>
              <p className="font-medium text-gray-400 text-xs uppercase">Full analytics coming soon. Keep taking orders to unlock insights!</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
