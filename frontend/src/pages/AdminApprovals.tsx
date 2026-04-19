import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckSquare, XSquare, Users, Store, TrendingUp, Clock, RefreshCw } from 'lucide-react';
import API_BASE_URL from '../config';

const StatCard = ({ label, value, color, icon }: { label: string; value: any; color: string; icon: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    className={`${color} border-4 border-black p-6 shadow-[6px_6px_0px_#000] flex flex-col justify-between min-h-[140px]`}
  >
    <div className="flex justify-between items-start">
      <span className="font-bold uppercase text-xs tracking-widest opacity-70">{label}</span>
      <div className="bg-white border-2 border-black p-1.5 shadow-[2px_2px_0px_#000]">{icon}</div>
    </div>
    <p className="font-display font-black text-6xl leading-none mt-4">{value ?? '—'}</p>
  </motion.div>
);

const AdminApprovals = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [approving, setApproving] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const headers = { 'Authorization': `Bearer ${token}` };

      const [statsRes, pendingRes] = await Promise.all([
        fetch(`${API_BASE_URL}/restaurants/admin/stats`, { headers }),
        fetch(`${API_BASE_URL}/restaurants/pending`, { headers }),
      ]);

      if (statsRes.ok) setStats(await statsRes.json());
      if (pendingRes.ok) setPendingRestaurants(await pendingRes.json());
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      setApproving(id);
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/restaurants/${id}/approve`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        setPendingRestaurants(prev => prev.filter(r => r._id !== id));
        // Refresh stats
        fetchData();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setApproving(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-8 border-black pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-black text-white p-3 shadow-[4px_4px_0px_#dc2626]">
              <ShieldCheck className="w-9 h-9" />
            </div>
            <div>
              <h1 className="font-display font-black text-5xl uppercase leading-none">System Admin</h1>
              <p className="font-medium text-gray-500 text-sm mt-1">FoodDash Operations Center</p>
            </div>
          </div>
          <button
            onClick={fetchData}
            className="flex items-center gap-2 bg-white border-4 border-black px-5 py-2.5 font-bold uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          <StatCard label="Live Restaurants" value={stats?.liveRestaurants} color="bg-[#00E59B]" icon={<Store className="w-4 h-4 stroke-[3]" />} />
          <StatCard label="Currently Open" value={stats?.currentlyOpen} color="bg-[#FFD700]" icon={<TrendingUp className="w-4 h-4 stroke-[3]" />} />
          <StatCard label="Total Owners" value={stats?.totalOwners} color="bg-white" icon={<Users className="w-4 h-4 stroke-[3]" />} />
          <StatCard label="Total Customers" value={stats?.totalCustomers} color="bg-brand-100" icon={<Users className="w-4 h-4 stroke-[3]" />} />
        </div>

        {/* Approval Queue */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
          <div className="bg-black text-white px-6 py-4 flex justify-between items-center">
            <h2 className="font-display font-black text-2xl uppercase tracking-wider flex items-center gap-3">
              Approval Queue
              <span className="bg-brand-600 text-white text-sm px-3 py-1 font-bold border-2 border-white">
                {pendingRestaurants.length} pending
              </span>
            </h2>
            <Clock className="w-5 h-5 opacity-60" />
          </div>

          {loading ? (
            <div className="p-16 text-center">
              <p className="font-display font-black text-3xl uppercase animate-pulse">Loading queue...</p>
            </div>
          ) : pendingRestaurants.length === 0 ? (
            <div className="p-16 text-center">
              <CheckSquare className="w-16 h-16 mx-auto mb-4 text-[#00E59B]" strokeWidth={2} />
              <p className="font-display font-black text-3xl uppercase">Queue is clear!</p>
              <p className="font-medium text-gray-500 mt-2">No restaurants awaiting approval.</p>
            </div>
          ) : (
            <div className="divide-y-4 divide-black">
              {pendingRestaurants.map((restaurant) => (
                <motion.div
                  key={restaurant._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 hover:bg-[#f4f0ea] transition-colors"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-14 h-14 bg-[#FFD700] border-4 border-black flex items-center justify-center shadow-[3px_3px_0px_#000] shrink-0">
                      <Store className="w-7 h-7 stroke-[2.5]" />
                    </div>
                    <div>
                      <h3 className="font-display font-black text-2xl uppercase">{restaurant.name}</h3>
                      <p className="font-medium text-gray-600 text-sm">
                        Owner: <span className="font-bold text-black">{restaurant.owner?.name}</span> · {restaurant.owner?.email}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-1.5">
                        <span className="bg-[#f4f0ea] border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{restaurant.address?.city}</span>
                        <span className="bg-[#f4f0ea] border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{restaurant.address?.area}</span>
                        <span className="bg-[#f4f0ea] border-2 border-black px-2 py-0.5 text-xs font-bold uppercase">{restaurant.timings?.openingTime} – {restaurant.timings?.closingTime}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 w-full md:w-auto shrink-0">
                    <button
                      onClick={() => handleApprove(restaurant._id)}
                      disabled={approving === restaurant._id}
                      className="flex-1 md:flex-none bg-[#00E59B] text-black border-4 border-black px-6 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {approving === restaurant._id ? 'Approving...' : <><CheckSquare className="w-4 h-4 stroke-[3]" /> Approve</>}
                    </button>
                    <button className="bg-white border-4 border-black px-3 py-2.5 shadow-[4px_4px_0px_#000] hover:bg-red-50 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all" title="Reject">
                      <XSquare className="w-5 h-5 stroke-[2.5] text-brand-600" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default AdminApprovals;
