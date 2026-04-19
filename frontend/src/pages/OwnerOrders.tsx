import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Plus, Settings, ToggleLeft, ToggleRight, Package, ChevronRight, Check } from 'lucide-react';
import { getMyRestaurantProfile, toggleRestaurantStatus } from '../services/restaurantService';
import { getRestaurantOrders, updateOrderStatus } from '../services/orderService';
import { Link } from 'react-router-dom';

const OwnerOrders = () => {
  const [restaurant, setRestaurant] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchContent = async () => {
    try {
      const restData = await getMyRestaurantProfile();
      setRestaurant(restData);
      const ordersData = await getRestaurantOrders();
      setOrders(ordersData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContent();
    // In MVP, we poll every 10 seconds for live orders
    const interval = setInterval(fetchContent, 10000);
    return () => clearInterval(interval);
  }, []);

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

  const changeStatus = async (orderId: string, newStatus: string) => {
    try {
        await updateOrderStatus(orderId, newStatus);
        setOrders(orders.map(o => o._id === orderId ? { ...o, status: newStatus } : o));
    } catch (err) {
        console.error(err);
        alert('Failed to update order status');
    }
  };

  // Stats calculation
  const todayOrders = orders.filter(o => new Date(o.createdAt).toDateString() === new Date().toDateString());
  const todayRevenue = todayOrders.reduce((acc, o) => acc + o.totalAmount, 0);
  const allTimeRevenue = orders.reduce((acc, o) => acc + o.totalAmount, 0);

  return (
    <div className="min-h-screen bg-[#f4f0ea] font-sans pb-20">
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
            <Link to="/owner/menu" className="bg-[#FFD700] text-black border-4 border-white px-5 py-2.5 font-black uppercase text-sm shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:translate-x-[2px] hover:translate-y-[2px] transition-all flex items-center gap-2">
              <Plus className="w-4 h-4 stroke-[3]" /> Add Item
            </Link>
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
            <p className="font-black uppercase text-sm">Your restaurant is pending admin approval. Customers cannot order from you yet.</p>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Left column: Live orders */}
          <div className="lg:col-span-2 flex flex-col gap-6">

            {/* Live Orders Box */}
            <div className="bg-white border-4 border-black shadow-[6px_6px_0px_#FFD700]">
              <div className="border-b-4 border-black px-6 py-4 flex justify-between items-center bg-[#f4f0ea]">
                <h2 className="font-display font-black text-2xl uppercase">Live Orders ({orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length})</h2>
                <div className="flex items-center gap-2">
                    <span className="text-xs font-bold uppercase">Auto-refreshing</span>
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                </div>
              </div>

              {orders.length === 0 ? (
                  <div className="p-8 text-center">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-20" />
                    <p className="font-bold text-gray-500 uppercase text-sm">
                      {restaurant?.isOpen ? 'No orders yet — waiting for the rush!' : 'Open your store to start receiving orders.'}
                    </p>
                  </div>
              ) : (
                <div className="divide-y-4 divide-black">
                    {orders.map(order => (
                        <div key={order._id} className="p-6">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h3 className="font-black text-xl uppercase mb-1">Order #{order._id.substring(order._id.length - 6)}</h3>
                                    <p className="font-bold text-gray-500 text-xs uppercase">{new Date(order.createdAt).toLocaleTimeString()} • {order.customer.name}</p>
                                    <p className="font-bold text-brand-600 text-xs uppercase mt-1">Deliver to: {order.deliveryAddress}</p>
                                </div>
                                <div className="text-right">
                                    <p className="font-black text-2xl uppercase">₹{order.totalAmount}</p>
                                    <p className="font-bold text-xs uppercase bg-gray-200 border-2 border-black px-2 inline-block shadow-[2px_2px_0px_#000]">{order.paymentStatus}</p>
                                </div>
                            </div>

                            <ul className="bg-gray-50 p-4 border-2 border-dashed border-gray-300 font-bold uppercase text-sm mb-4">
                                {order.items.map((item: any, idx: number) => (
                                    <li key={idx} className="flex justify-between py-1 border-b border-gray-200 last:border-0">
                                        <span>{item.quantity}x {item.name}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Status Pipeline Buttons */}
                            <div className="flex flex-wrap gap-2">
                                {order.status === 'pending' && (
                                   <button onClick={() => changeStatus(order._id, 'accepted')} className="bg-[#FFD700] border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
                                       Accept Order
                                   </button>
                                )}
                                {order.status === 'accepted' && (
                                   <button onClick={() => changeStatus(order._id, 'preparing')} className="bg-orange-400 border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
                                       Start Preparing
                                   </button>
                                )}
                                {order.status === 'preparing' && (
                                   <button onClick={() => changeStatus(order._id, 'out_for_delivery')} className="bg-purple-400 text-white border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform">
                                       Mark Out For Delivery
                                   </button>
                                )}
                                {order.status === 'out_for_delivery' && (
                                   <button onClick={() => changeStatus(order._id, 'delivered')} className="bg-[#00E59B] border-4 border-black px-4 py-2 font-black uppercase text-sm shadow-[4px_4px_0px_#000] hover:translate-x-1 hover:translate-y-1 transition-transform flex items-center gap-1">
                                       <Check className="w-4 h-4 stroke-[3]" /> Mark Delivered
                                   </button>
                                )}
                                {order.status === 'delivered' && (
                                   <span className="bg-gray-200 text-gray-500 border-4 border-gray-300 px-4 py-2 font-black uppercase text-sm flex items-center gap-1">
                                       <Check className="w-4 h-4 stroke-[3]" /> Completed
                                   </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
              )}
            </div>

          </div>

          {/* Right column: Stats */}
          <div className="flex flex-col gap-6">

            <div className="bg-black text-white border-4 border-black p-6 shadow-[8px_8px_0px_#00E59B]">
                <p className="font-bold text-xs uppercase text-[#00E59B] mb-2 tracking-widest">Today's Revenue</p>
                <p className="font-display font-black text-5xl">₹{todayRevenue}</p>
                <div className="mt-4 pt-4 border-t-2 border-gray-800 flex justify-between">
                    <div>
                        <p className="font-bold text-[10px] uppercase text-gray-400">Total Deals</p>
                        <p className="font-black text-xl">{todayOrders.length}</p>
                    </div>
                </div>
            </div>

            <div className="bg-white border-4 border-black p-6 shadow-[8px_8px_0px_#000]">
                <p className="font-bold text-xs uppercase text-gray-500 mb-2 tracking-widest">All-Time Highscore</p>
                <p className="font-display font-black text-4xl">₹{allTimeRevenue}</p>
                <div className="mt-4 pt-4 border-t-2 border-dashed border-gray-200 flex justify-between">
                    <div>
                        <p className="font-bold text-[10px] uppercase text-gray-400">Legacy Orders</p>
                        <p className="font-black text-xl">{orders.length}</p>
                    </div>
                </div>
            </div>

            <Link to="/owner/menu" className="w-full bg-[#f4f0ea] border-4 border-black px-5 py-4 font-black uppercase text-sm flex items-center justify-between hover:bg-[#FFD700] hover:translate-x-1 hover:translate-y-1 hover:shadow-[4px_4px_0px_#000] transition-all">
                <span className="flex items-center gap-2"><Settings className="w-4 h-4" /> Manage Menu</span>
                <ChevronRight className="w-4 h-4" />
            </Link>

          </div>

        </div>
      </div>
    </div>
  );
};

export default OwnerOrders;
