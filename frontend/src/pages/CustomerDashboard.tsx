import React from 'react';
import { motion } from 'framer-motion';

const CustomerDashboard = () => {
  return (
    <div className="min-h-screen bg-[#f4f0ea] p-8 mt-24">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-5xl font-black uppercase mb-8 border-b-8 border-black inline-block">Customer Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#00E59B]">
            <h2 className="text-2xl font-black uppercase mb-4">Active Orders</h2>
            <p className="font-bold text-gray-600">No active orders right now. Go grab some food!</p>
          </motion.div>
          
          <motion.div whileHover={{ scale: 1.02 }} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#FFD700]">
            <h2 className="text-2xl font-black uppercase mb-4">Order History</h2>
            <p className="font-bold text-gray-600">Past orders will appear here.</p>
          </motion.div>

          <motion.div whileHover={{ scale: 1.02 }} className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
            <h2 className="text-2xl font-black uppercase mb-4">Settings</h2>
            <p className="font-bold text-gray-600">Manage addresses and payment methods.</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;
