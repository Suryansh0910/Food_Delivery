import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CheckSquare, XSquare, AlertCircle } from 'lucide-react';

const AdminDashboard = () => {
  const [pendingRestaurants, setPendingRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPending();
  }, []);

  const fetchPending = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:5001/api/restaurants/pending', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        const data = await res.json();
        setPendingRestaurants(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:5001/api/restaurants/${id}/approve`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (res.ok) {
        // Remove from list
        setPendingRestaurants(prev => prev.filter(r => r._id !== id));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] p-8 mt-24 font-sans text-navy-900">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b-8 border-black pb-4">
          <ShieldCheck className="w-12 h-12 stroke-[3]" />
          <h1 className="text-5xl font-black uppercase tracking-tight">System Admin</h1>
        </div>
        
        <div className="bg-white border-4 border-black p-8 shadow-[8px_8px_0px_#000]">
          <h2 className="text-3xl font-black uppercase mb-6 flex items-center gap-3">
            Restaurants Pending Approval
            <span className="bg-[#FFD700] text-black px-3 py-1 text-xl border-2 border-black">{pendingRestaurants.length}</span>
          </h2>
          
          {loading ? (
            <p className="font-bold text-lg animate-pulse">Loading queue...</p>
          ) : pendingRestaurants.length === 0 ? (
            <div className="bg-brand-100 border-4 border-black p-6 flex items-center gap-4">
              <CheckSquare className="w-8 h-8 stroke-[3]" />
              <p className="font-black text-xl uppercase">All Caught Up! No pending restaurants.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {pendingRestaurants.map((restaurant) => (
                <motion.div key={restaurant._id} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white border-4 border-black p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-[4px_4px_0px_#00E59B]">
                  <div className="flex-1">
                    <h3 className="text-2xl font-black uppercase">{restaurant.name}</h3>
                    <p className="font-bold text-gray-600 mb-2">Owner: {restaurant.owner?.name} ({restaurant.owner?.email})</p>
                    <div className="flex flex-wrap gap-2 text-sm font-bold uppercase">
                      <span className="bg-gray-200 border-2 border-black px-2 py-1">{restaurant.address?.city}</span>
                      <span className="bg-gray-200 border-2 border-black px-2 py-1">{restaurant.timings?.openingTime} - {restaurant.timings?.closingTime}</span>
                    </div>
                  </div>
                  <div className="flex gap-4 w-full md:w-auto">
                    <button onClick={() => handleApprove(restaurant._id)} className="flex-1 md:flex-none bg-[#00E59B] text-black border-4 border-black px-6 py-3 font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center gap-2">
                       Approve <CheckSquare className="w-5 h-5 stroke-[3]" />
                    </button>
                    <button className="flex-1 md:flex-none bg-brand-600 text-white border-4 border-black px-4 py-3 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all flex items-center justify-center" title="Reject (Not implemented yet)">
                       <XSquare className="w-5 h-5 stroke-[3]" />
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

export default AdminDashboard;
