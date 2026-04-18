import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Store, Plus, TrendingUp, Edit3 } from 'lucide-react';
import { getMyRestaurantProfile } from '../services/restaurantService';

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
    fetchProfile();
  }, []);

  return (
    <div className="min-h-screen bg-white p-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 border-b-8 border-brand-600 pb-4">
          <h1 className="text-5xl font-black uppercase">Owner Portal</h1>
          <button className="bg-brand-600 text-white font-black uppercase px-6 py-3 border-4 border-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center gap-2">
            <Plus className="w-5 h-5 stroke-[3]" /> Add Menu Item
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <motion.div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
            <div className="flex justify-between items-center border-b-4 border-black pb-4 mb-4">
              <h2 className="text-3xl font-black uppercase">Live Orders</h2>
              <span className="bg-black text-white px-3 py-1 font-black text-xl animate-pulse">0 Pending</span>
            </div>
            <p className="font-bold text-lg">Waiting for new orders...</p>
          </motion.div>
          
          <div className="flex flex-col gap-8">
            <motion.div className="bg-[#00E59B] border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex flex-col justify-between items-start gap-4 h-full relative">
              <div className="flex items-center gap-4 w-full">
                <div className="bg-white border-2 border-black p-3 shrink-0">
                  <Store className="w-8 h-8 stroke-[3]" />
                </div>
                <div className="flex-1 w-full overflow-hidden">
                  <h3 className="text-2xl font-black uppercase truncate">{loading ? 'Loading...' : restaurant ? restaurant.name : 'Restaurant Profile'}</h3>
                  <p className="font-bold text-sm uppercase truncate opacity-80">{restaurant ? `${restaurant.address?.street}, ${restaurant.address?.city}` : 'Manage details & hours'}</p>
                </div>
              </div>

              {restaurant && (
                <div className="mt-2 w-full">
                   <div className="bg-white border-2 border-black px-3 py-1 font-bold text-sm w-max mb-2">
                     Hours: {restaurant.timings?.openingTime} - {restaurant.timings?.closingTime}
                   </div>
                   {!restaurant.isApproved && (
                     <div className="bg-brand-600 text-white border-2 border-black px-3 py-1 font-bold text-xs w-max uppercase animate-pulse">
                       Pending Admin Approval
                     </div>
                   )}
                </div>
              )}

              <button className="absolute bottom-6 right-6 bg-white border-4 border-black p-2 hover:bg-[#FFD700] transition-colors shadow-[2px_2px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none" title="Edit Profile">
                <Edit3 className="w-5 h-5 stroke-[3]" />
              </button>
            </motion.div>

            <motion.div className="bg-brand-100 border-4 border-black p-6 shadow-[8px_8px_0px_#000] flex items-center gap-4">
              <div className="bg-white border-2 border-black p-3">
                <TrendingUp className="w-8 h-8 stroke-[3]" />
              </div>
              <div>
                <h3 className="text-2xl font-black uppercase">Analytics</h3>
                <p className="font-bold text-sm uppercase">Today's Sales: $0.00</p>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
