import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';
import { Package, Clock, CheckCircle2, AlertCircle, RefreshCw, ChefHat, Bike } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending': return { text: 'Awaiting Confirmation', color: 'bg-[#FFD700]', icon: AlertCircle };
    case 'accepted': return { text: 'Restaurant Accepted', color: 'bg-blue-400', icon: CheckCircle2 };
    case 'preparing': return { text: 'Kitchen Preparing', color: 'bg-orange-400', icon: ChefHat };
    case 'out_for_delivery': return { text: 'Out for Delivery', color: 'bg-purple-400', icon: Bike };
    case 'delivered': return { text: 'Delivered', color: 'bg-[#00E59B]', icon: CheckCircle2 };
    case 'cancelled': return { text: 'Cancelled', color: 'bg-red-500 text-white', icon: AlertCircle };
    default: return { text: 'Unknown', color: 'bg-gray-200', icon: Clock };
  }
};

const CustomerOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchOrders = async (showLoading = true) => {
        if (showLoading) setLoading(true);
        try {
            const data = await getMyOrders();
            setOrders(data);
        } catch (error) {
            console.error('Fetch Orders Error:', error);
        } finally {
            if (showLoading) setLoading(false);
        }
    };

    useEffect(() => {
        fetchOrders(true);
        // Poll for live status updates every 5 seconds silently
        const interval = setInterval(() => fetchOrders(false), 5000);
        return () => clearInterval(interval);
    }, []);

    // Initial load block
    if (loading && orders.length === 0) return (
      <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
          <div className="w-12 h-12 border-8 border-black border-t-[#00E59B] rounded-full animate-spin" />
      </div>
    );

    return (
      <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-10 border-b-8 border-black pb-4">
            <h1 className="font-display font-black text-4xl md:text-6xl uppercase leading-none">Order History</h1>
            <button onClick={() => fetchOrders(true)} className="bg-white border-4 border-black p-3 hover:bg-[#FFD700] hover:-translate-y-1 transition-all shadow-[4px_4px_0px_#000]">
                <RefreshCw className="w-6 h-6 stroke-[3]" />
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_#000] text-center transform rotate-1">
              <Package className="w-24 h-24 stroke-[2] mx-auto mb-6" />
              <p className="font-bold text-xl md:text-2xl uppercase mb-8">You have no active orders. Your stomach is sad.</p>
              <Link to="/customer/restaurants" className="bg-black text-[#FFD700] px-8 py-4 font-black uppercase text-xl md:text-2xl border-4 border-black shadow-[8px_8px_0px_#00E59B] inline-block hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
                Feed Me Now
              </Link>
            </div>
          ) : (
            <div className="space-y-8">
                {orders.map((order, idx) => {
                    const statusConfig = getStatusConfig(order.status);
                    const StatusIcon = statusConfig.icon;
                    
                    return (
                        <motion.div 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            key={order._id} 
                            className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] flex flex-col md:flex-row overflow-hidden"
                        >
                            <div className="w-full md:w-48 border-b-4 md:border-b-0 md:border-r-4 border-black h-48 relative">
                                <img src={order.restaurant?.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                <div className={`absolute top-0 right-0 border-b-4 border-l-4 border-black px-3 py-1 font-black text-sm uppercase ${statusConfig.color} flex items-center gap-1`}>
                                   <StatusIcon className="w-4 h-4" /> {statusConfig.text}
                                </div>
                            </div>
                            
                            <div className="p-6 flex-1 flex flex-col">
                                <div className="flex justify-between items-start mb-4 gap-4">
                                    <div>
                                        <h3 className="font-black text-2xl uppercase">{order.restaurant?.name || 'Deleted Restaurant'}</h3>
                                        <p className="font-bold text-gray-500 uppercase text-xs">ID: {order._id.substring(order._id.length - 8)} | {new Date(order.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <span className="font-black text-2xl block">₹{order.totalAmount}</span>
                                        <span className="font-bold uppercase text-xs px-2 py-0.5 bg-gray-200 border-2 border-black inline-block mt-1">
                                            {order.paymentStatus}
                                        </span>
                                    </div>
                                </div>
                                
                                <div className="border-t-2 border-dashed border-gray-300 py-4 flex-1">
                                    <p className="font-bold uppercase text-sm mb-2 text-black/50">Order Summary:</p>
                                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-1">
                                        {order.items.map((item: any, i: number) => (
                                            <li key={i} className="font-bold text-sm uppercase flex justify-between">
                                                <span>{item.quantity}x {item.name}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </motion.div>
                    );
                })}
            </div>
          )}
        </div>
      </div>
    );
};

export default CustomerOrders;
