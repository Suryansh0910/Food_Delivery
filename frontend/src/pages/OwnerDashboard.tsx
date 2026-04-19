import { useState, useEffect } from 'react';
import { TrendingUp, BarChart2, DollarSign, Activity, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../config';
import { getMyRestaurantProfile } from '../services/restaurantService';

const OwnerDashboard = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getMyRestaurantProfile();
      setRestaurant(response);
      
      const token = localStorage.getItem('token');
      const statsRes = await fetch(`${API_BASE_URL}/restaurants/my-restaurant/stats`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (statsRes.ok) {
        setStats(await statsRes.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-8 border-black pb-6">
          <div>
            <h1 className="font-display font-black text-5xl md:text-6xl uppercase leading-none">Analytics</h1>
            <p className="font-medium text-gray-500 text-sm mt-1 uppercase">Store insights for {restaurant?.name || 'Your Kitchen'}</p>
          </div>
          <button 
            onClick={fetchData}
            className="bg-white border-4 border-black p-3 shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all"
          >
            <RefreshCw className={`w-6 h-6 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
          <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FFD700]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-gray-500">Revenue</span>
              <DollarSign className="w-6 h-6 stroke-[3] text-black" />
            </div>
            <p className="font-display font-black text-4xl lg:text-5xl mt-4">₹{stats?.revenue?.toLocaleString() || '0'}</p>
            <p className="text-sm font-bold uppercase mt-2 text-green-600">Total volume</p>
          </div>
          
          <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_#00E59B]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-gray-400">Total Orders</span>
              <Activity className="w-6 h-6 stroke-[3] text-[#00E59B]" />
            </div>
            <p className="font-display font-black text-5xl mt-4">{stats?.totalOrders || '0'}</p>
            <p className="text-sm font-bold uppercase mt-2 text-[#00E59B]">All time</p>
          </div>
          
          <div className="bg-[#FFD700] border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-black">Avg Wait Time</span>
              <BarChart2 className="w-6 h-6 stroke-[3] text-black" />
            </div>
            <p className="font-display font-black text-5xl mt-4">{stats?.avgWaitTime || '15'}m</p>
            <p className="text-sm font-bold uppercase mt-2">Optimal</p>
          </div>

          <div className="bg-brand-600 text-white border-4 border-black p-6 shadow-[8px_8px_0px_#FFD700]">
            <div className="flex justify-between items-start">
              <span className="font-bold uppercase tracking-widest text-brand-200">Rating</span>
              <TrendingUp className="w-6 h-6 stroke-[3] text-white" />
            </div>
            <p className="font-display font-black text-5xl mt-4">{stats?.rating?.toFixed(1) || '4.5'}</p>
            <p className="text-sm font-bold uppercase mt-2">Customer satisfaction</p>
          </div>
        </div>

        <div className="bg-white border-8 border-black p-10 shadow-[12px_12px_0px_#000]">
          <h2 className="font-display font-black text-3xl uppercase mb-6 flex items-center gap-2"><BarChart2 className="w-8 h-8" /> Today's Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-[#f4f0ea] border-4 border-black p-6">
                <p className="font-black uppercase text-xl mb-2">Orders Today</p>
                <div className="text-6xl font-display font-black text-[#00E59B] drop-shadow-[2px_2px_0px_#000]">{stats?.todayOrders || '0'}</div>
            </div>
            <div className="bg-[#f4f0ea] border-4 border-black p-6">
                <p className="font-black uppercase text-xl mb-2">Revenue Today</p>
                <div className="text-6xl font-display font-black text-brand-600 drop-shadow-[2px_2px_0px_#000]">₹{stats?.todayRevenue?.toLocaleString() || '0'}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OwnerDashboard;
