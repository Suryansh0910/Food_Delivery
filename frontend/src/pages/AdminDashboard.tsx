import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Store, TrendingUp, RefreshCw, BarChart } from 'lucide-react';
import API_BASE_URL from '../config';

const StatCard = ({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${color} border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between min-h-[140px] hover:-translate-y-1 transition-transform`}
  >
    <div className="flex justify-between items-start">
      <span className="font-bold uppercase text-xs tracking-widest opacity-70">{label}</span>
      <div className="bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">{icon}</div>
    </div>
    <p className="font-display font-black text-6xl leading-none mt-4">{value ?? '—'}</p>
  </motion.div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const statsRes = await fetch(`${API_BASE_URL}/restaurants/admin/stats`, { headers });

      if (statsRes.ok) setStats(await statsRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-8 border-black pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-black text-white p-3 shadow-[4px_4px_0px_#00E59B]">
              <BarChart className="w-9 h-9" />
            </div>
            <div>
              <h1 className="font-display font-black text-5xl uppercase leading-none">Platform Analytics</h1>
              <p className="font-medium text-gray-500 text-sm mt-1 uppercase font-bold">FoodDash Operations Center</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-white border-4 border-black px-5 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
          <StatCard label="Live Restaurants" value={stats?.liveRestaurants} color="bg-[#00E59B]" icon={<Store className="w-4 h-4 stroke-[3]" />} />
          <StatCard label="Currently Open" value={stats?.currentlyOpen} color="bg-[#FFD700]" icon={<TrendingUp className="w-4 h-4 stroke-[3]" />} />
          <StatCard label="Total Owners" value={stats?.totalOwners} color="bg-white" icon={<Users className="w-4 h-4 stroke-[3]" />} />
          <StatCard label="Total Customers" value={stats?.totalCustomers} color="bg-brand-100" icon={<Users className="w-4 h-4 stroke-[3]" />} />
        </div>

        {/* Extended Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000]">
                <h2 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-2"><TrendingUp className="w-6 h-6" /> Revenue Overview</h2>
                <div className="h-64 bg-[#f4f0ea] border-4 border-black flex items-center justify-center border-dashed mb-4">
                    <p className="font-bold uppercase text-gray-400">Revenue Chart Placeholder</p>
                </div>
                <div className="flex justify-between border-t-4 border-black pt-4 font-black uppercase">
                    <span>Total Volume: <span className="text-[#00E59B]">High</span></span>
                    <span>Fees Collected: <span className="text-[#FFD700]">Growing</span></span>
                </div>
            </div>

            <div className="bg-brand-600 text-white border-4 border-black p-8 shadow-[8px_8px_0px_#00E59B]">
                <h2 className="font-display font-black text-2xl uppercase mb-6 flex items-center gap-2"><Users className="w-6 h-6" /> User Growth</h2>
                <div className="h-64 bg-black border-4 border-black flex items-center justify-center border-dashed mb-4 opacity-50">
                    <p className="font-bold uppercase text-gray-400">Growth Chart Placeholder</p>
                </div>
                <div className="flex justify-between border-t-4 border-white pt-4 font-black uppercase">
                    <span>New Signups: <span className="text-[#00E59B]">+24%</span></span>
                    <span>Churn: <span className="text-red-400">Low</span></span>
                </div>
            </div>
        </div>

      </div>
    </div>
  );
};

export default AdminDashboard;
