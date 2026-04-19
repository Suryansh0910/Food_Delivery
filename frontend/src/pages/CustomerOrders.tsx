import { useState, useEffect } from 'react';
import { getMyOrders } from '../services/orderService';
import { Package, CheckCircle2, AlertCircle, RefreshCw, ChefHat, Bike, Clock, Flame, X, MapPin, CreditCard, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { LiveTracker } from '../components/LiveTracker';
import { TickerStrip, BrutalistFrame, FOOD_TICKERS } from '../components/DesignElements';

const PIPELINE_STEPS = [
  { key: 'accepted',         label: 'Accepted',   activeStatuses: ['accepted','preparing','out_for_delivery','delivered'] },
  { key: 'preparing',        label: 'Preparing',  activeStatuses: ['preparing','out_for_delivery','delivered'] },
  { key: 'out_for_delivery', label: 'En Route',   activeStatuses: ['out_for_delivery','delivered'] },
  { key: 'delivered',        label: 'Delivered',  activeStatuses: ['delivered'] },
];

const progressWidth: Record<string, string> = {
  pending:          '4%',
  accepted:         '33%',
  preparing:        '66%',
  out_for_delivery: '100%',
  delivered:        '100%',
};

const getStatusConfig = (status: string) => {
  switch (status) {
    case 'pending':          return { text: 'Awaiting Confirmation', color: 'bg-[#FFD700] text-black', icon: Clock };
    case 'accepted':         return { text: 'Restaurant Accepted',   color: 'bg-blue-500 text-white',  icon: CheckCircle2 };
    case 'preparing':        return { text: 'Kitchen Preparing',     color: 'bg-orange-400 text-black', icon: ChefHat };
    case 'out_for_delivery': return { text: 'Out for Delivery',      color: 'bg-purple-500 text-white', icon: Bike };
    case 'delivered':        return { text: '✓ Delivered',           color: 'bg-[#00E59B] text-black', icon: CheckCircle2 };
    case 'cancelled':        return { text: 'Cancelled',             color: 'bg-red-500 text-white',   icon: AlertCircle };
    default:                 return { text: 'Unknown',               color: 'bg-gray-200 text-black',  icon: Clock };
  }
};

const CustomerOrders = () => {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState<any>(null);

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
        const interval = setInterval(() => fetchOrders(false), 5000);
        return () => clearInterval(interval);
    }, []);

    // Separate active vs delivered so active orders float to top
    const activeOrders = orders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled');
    const pastOrders   = orders.filter(o => o.status === 'delivered' || o.status === 'cancelled');

    if (loading && orders.length === 0) return (
      <div className="min-h-screen bg-[#f4f0ea] flex flex-col items-center justify-center gap-4">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="w-16 h-16 border-8 border-black border-t-[#00E59B] rounded-full"
          />
          <motion.p animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 1.2, repeat: Infinity }} className="font-black uppercase text-xl">
            Fetching your orders...
          </motion.p>
      </div>
    );

    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-[#f4f0ea] font-sans">

        {/* ─────── ORDER DETAIL MODAL ─────── */}
        <AnimatePresence>
          {selectedOrder && (() => {
            const sc = getStatusConfig(selectedOrder.status);
            const Icon = sc.icon;
            return (
              <motion.div
                key="overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4"
                onClick={() => setSelectedOrder(null)}
              >
                <motion.div
                  key="modal"
                  initial={{ opacity: 0, scale: 0.85, y: 40 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9, y: 40 }}
                  transition={{ type: 'spring', stiffness: 260, damping: 22 }}
                  onClick={e => e.stopPropagation()}
                  className="bg-[#f4f0ea] border-4 border-black shadow-[8px_8px_0px_#000] w-full max-w-lg"
                >
                  {/* Header */}
                  <div className={`${sc.color} border-b-4 border-black px-4 py-2.5 flex items-center justify-between`}>
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      <span className="font-black uppercase text-sm">{sc.text}</span>
                    </div>
                    <button onClick={() => setSelectedOrder(null)} className="bg-black text-white p-1 hover:bg-red-500 transition-colors">
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-3 space-y-3">

                    {/* Row 1: Restaurant info + Items side by side */}
                    <div className="grid grid-cols-2 gap-3">
                      {/* Restaurant */}
                      <div className="bg-white border-4 border-black shadow-[3px_3px_0px_#000] flex gap-2 items-center p-2.5">
                        <img src={selectedOrder.restaurant?.image} className="w-14 h-14 object-cover border-2 border-black shrink-0" />
                        <div className="min-w-0">
                          <h2 className="font-display font-black text-base uppercase leading-tight truncate">{selectedOrder.restaurant?.name}</h2>
                          <p className="font-bold text-gray-500 text-[9px] uppercase">#{selectedOrder._id.substring(selectedOrder._id.length - 8)}</p>
                          <p className="font-bold text-gray-400 text-[9px] uppercase">{new Date(selectedOrder.createdAt).toLocaleDateString()}</p>
                          <p className="font-black text-lg mt-0.5">₹{selectedOrder.totalAmount}</p>
                        </div>
                      </div>

                      {/* Items */}
                      <div className="bg-white border-4 border-black shadow-[3px_3px_0px_#000]">
                        <div className="border-b-2 border-black px-2.5 py-1 flex items-center gap-1.5">
                          <ShoppingBag className="w-3 h-3" />
                          <p className="font-black uppercase text-[9px]">Items</p>
                        </div>
                        <ul className="divide-y divide-gray-100">
                          {selectedOrder.items.map((item: any, i: number) => (
                            <li key={i} className="flex justify-between items-center px-2.5 py-1.5 font-bold uppercase text-[10px]">
                              <span className="truncate mr-1">{item.quantity}× {item.name}</span>
                              <span className="font-black shrink-0">₹{item.price * item.quantity}</span>
                            </li>
                          ))}
                          <li className="flex justify-between items-center px-2.5 py-1.5 font-black uppercase text-xs border-t-2 border-black bg-[#FFD700]">
                            <span>Total</span>
                            <span>₹{selectedOrder.totalAmount}</span>
                          </li>
                        </ul>
                      </div>
                    </div>

                    {/* Row 2: Address + Pay + Location */}
                    <div className="grid grid-cols-3 gap-2">
                      <div className="col-span-1 bg-white border-4 border-black p-2.5 shadow-[3px_3px_0px_#000]">
                        <p className="font-black uppercase text-[9px] mb-1 flex items-center gap-1"><MapPin className="w-3 h-3" /> Address</p>
                        <p className="font-bold text-xs leading-tight">{selectedOrder.deliveryAddress || 'N/A'}</p>
                      </div>
                      <div className="bg-white border-4 border-black p-2.5 shadow-[3px_3px_0px_#000]">
                        <p className="font-black uppercase text-[9px] mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Pay</p>
                        <p className="font-black text-xs uppercase">{selectedOrder.paymentStatus}</p>
                        <p className="font-bold text-[9px] text-gray-400 uppercase">COD</p>
                      </div>
                      <div className="bg-[#00E59B] border-4 border-black p-2.5 shadow-[3px_3px_0px_#000]">
                        <p className="font-black uppercase text-[9px] mb-1">Location</p>
                        <p className="font-black text-xs uppercase">{selectedOrder.restaurant?.address?.area}</p>
                        <p className="font-bold text-[9px] text-black/60 uppercase">{selectedOrder.restaurant?.address?.city}</p>
                      </div>
                    </div>

                    {/* Row 3: Map — fixed height so it doesn't overflow */}
                    <div className="border-4 border-black overflow-hidden shadow-[3px_3px_0px_#000]">
                      <p className="font-black uppercase text-[9px] px-3 py-1 bg-black text-[#00E59B]">📍 Delivery Map</p>
                      <div style={{ height: '180px' }}>
                        <LiveTracker
                          orderId={selectedOrder._id}
                          isDelivered={selectedOrder.status === 'delivered'}
                          city={selectedOrder.restaurant?.address?.city || 'Mumbai'}
                          compact
                        />
                      </div>
                    </div>

                  </div>

                  <div className="px-3 pb-3">
                    <button onClick={() => setSelectedOrder(null)} className="w-full bg-black text-white py-2 font-black uppercase text-sm border-4 border-black shadow-[3px_3px_0px_#00E59B] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all">
                      Close
                    </button>
                  </div>
                </motion.div>


              </motion.div>
            );
          })()}
        </AnimatePresence>

        {/* ── Page Hero Banner ── */}
        <div className="bg-black border-b-8 border-brand-600 px-6 md:px-10 py-8">
          <div className="max-w-4xl mx-auto flex justify-between items-end">
            <div>
              <p className="font-bold text-brand-400 text-xs uppercase tracking-widest mb-1">Live 🟢 Updates</p>
              <h1 className="font-display font-black text-5xl md:text-7xl uppercase text-white leading-none">
                My Orders
              </h1>
              <p className="text-gray-400 font-bold text-sm uppercase mt-2">
                {activeOrders.length > 0
                  ? `${activeOrders.length} active order${activeOrders.length > 1 ? 's' : ''} in progress`
                  : 'All caught up!'}
              </p>
            </div>
            <motion.button
              onClick={() => fetchOrders(true)}
              whileHover={{ rotate: 180 }}
              transition={{ duration: 0.3 }}
              className="bg-white border-4 border-white p-3 shadow-[4px_4px_0px_rgba(255,255,255,0.3)] hover:bg-[#FFD700]"
            >
              <RefreshCw className="w-6 h-6 stroke-[3]" />
            </motion.button>
          </div>
        </div>

        {/* ── Hype ticker ── */}
        <TickerStrip
          items={['🛵 Your rider is on the way', '🔥 Food is being prepared', '⚡ Real-time order tracking', '📍 GPS enabled delivery', '✓ 100% satisfaction', '🏆 Best delivery times']}
          bg="bg-[#FFD700]"
          textColor="text-black"
          speed={16}
          borderBottom
          borderTop={false}
        />

        <div className="max-w-4xl mx-auto px-6 md:px-10 py-10">

          {orders.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
              animate={{ opacity: 1, scale: 1, rotate: 1 }}
              className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_#FFD700] text-center transform rotate-1"
            >
              <motion.div animate={{ y: [0, -12, 0] }} transition={{ duration: 2, repeat: Infinity }}>
                <Package className="w-24 h-24 stroke-[1.5] mx-auto mb-4 text-gray-300" />
              </motion.div>
              <p className="font-display font-black text-3xl uppercase mb-2">Nothing yet!</p>
              <p className="font-bold text-gray-400 uppercase mb-8">Your stomach is sad. Let's fix that.</p>
              <Link
                to="/customer/restaurants"
                className="bg-black text-[#FFD700] px-8 py-4 font-black uppercase text-xl border-4 border-black shadow-[8px_8px_0px_#00E59B] inline-block hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all"
              >
                Feed Me Now →
              </Link>
            </motion.div>
          ) : (
            <div className="space-y-12">

              {/* ── ACTIVE ORDERS ── */}
              {activeOrders.length > 0 && (
                <section>
                  <BrutalistFrame
                    accentColor="#FFD700"
                    shadowColor="#FFD700"
                    label="🔴 LIVE"
                    labelBg="bg-red-500 text-white border-red-500"
                    className="p-6 bg-[#f4f0ea]"
                  >
                    <div className="flex items-center gap-3 mb-6">
                      <motion.div animate={{ scale: [1, 1.3, 1] }} transition={{ duration: 1, repeat: Infinity }} className="w-3 h-3 bg-red-500 rounded-full" />
                      <h2 className="font-display font-black text-2xl uppercase">Active Orders</h2>
                    </div>

                    <div className="space-y-6">
                      {activeOrders.map((order, idx) => {
                        const statusConfig = getStatusConfig(order.status);
                        const StatusIcon = statusConfig.icon;
                        return (
                          <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            className="bg-white border-4 border-black shadow-[6px_6px_0px_#000] overflow-hidden"
                          >
                            {/* Status bar across top */}
                            <div className={`${statusConfig.color} border-b-4 border-black px-4 py-2 flex items-center justify-between`}>
                              <span className="font-black uppercase text-sm flex items-center gap-2">
                                <StatusIcon className="w-4 h-4" /> {statusConfig.text}
                              </span>
                              <span className="font-bold text-xs uppercase opacity-70">
                                #{order._id.substring(order._id.length - 6)}
                              </span>
                            </div>

                            <div className="flex flex-col md:flex-row">
                              <div className="w-full md:w-44 h-40 border-b-4 md:border-b-0 md:border-r-4 border-black shrink-0 overflow-hidden">
                                <motion.img
                                  src={order.restaurant?.image || 'https://via.placeholder.com/150'}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.05 }}
                                />
                              </div>

                              <div className="p-5 flex-1">
                                <div className="flex justify-between items-start mb-3 gap-3">
                                  <div>
                                    <h3 className="font-black text-xl uppercase">{order.restaurant?.name}</h3>
                                    <p className="font-bold text-gray-400 text-xs uppercase">{new Date(order.createdAt).toLocaleString()}</p>
                                  </div>
                                  <div className="text-right shrink-0">
                                    <span className="font-black text-2xl">₹{order.totalAmount}</span>
                                  </div>
                                </div>

                                <ul className="font-bold text-xs uppercase text-gray-500 mb-4 space-y-0.5">
                                  {order.items.map((item: any, i: number) => (
                                    <li key={i}>{item.quantity}× {item.name}</li>
                                  ))}
                                </ul>

                                {/* Pipeline tracker */}
                                <div className="relative pt-2">
                                  <div className="absolute top-[18px] left-0 w-full h-1 bg-gray-200" />
                                  <div
                                    className="absolute top-[18px] left-0 h-1 bg-[#00E59B] transition-all duration-1000"
                                    style={{ width: progressWidth[order.status] || '0%' }}
                                  />
                                  <div className="flex justify-between relative z-10">
                                    {PIPELINE_STEPS.map(step => {
                                      const active = step.activeStatuses.includes(order.status);
                                      return (
                                        <div key={step.key} className="flex flex-col items-center">
                                          <motion.div
                                            animate={active ? { scale: [1, 1.2, 1] } : {}}
                                            transition={{ duration: 1, repeat: Infinity }}
                                            className={`w-6 h-6 border-2 border-black rounded-full flex items-center justify-center mb-1 transition-colors ${active ? 'bg-[#00E59B]' : 'bg-white'}`}
                                          >
                                            {active && <CheckCircle2 className="w-4 h-4 text-black" />}
                                          </motion.div>
                                          <span className="text-[9px] font-black uppercase text-center w-14">{step.label}</span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>

                            {(order.status === 'out_for_delivery' || order.status === 'delivered') && (
                              <LiveTracker
                                orderId={order._id}
                                isDelivered={order.status === 'delivered'}
                                city={order.restaurant?.address?.city || 'Delhi'}
                              />
                            )}
                          </motion.div>
                        );
                      })}
                    </div>
                  </BrutalistFrame>
                </section>
              )}

              {/* ── Ticker strip between sections ── */}
              {activeOrders.length > 0 && pastOrders.length > 0 && (
                <TickerStrip
                  items={FOOD_TICKERS.brand}
                  bg="bg-black"
                  textColor="text-white"
                  speed={12}
                  direction="right"
                />
              )}

              {/* ── PAST ORDERS ── */}
              {pastOrders.length > 0 && (
                <section>
                  <h2 className="font-display font-black text-3xl uppercase mb-6 flex items-center gap-3">
                    <Flame className="w-7 h-7 text-brand-600" /> Order History
                  </h2>
                  <BrutalistFrame
                    accentColor="#FFD700"
                    shadowColor="#000"
                    label="📦 All Orders"
                    labelBg="bg-black text-white"
                    className="p-4"
                  >
                    <div className="space-y-3">
                      {pastOrders.map((order, idx) => {
                        const statusConfig = getStatusConfig(order.status);
                        return (
                          <motion.div
                            key={order._id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: idx * 0.08 }}
                            whileHover={{ x: -4, boxShadow: '8px 8px 0px #FFD700' }}
                            className="bg-white border-4 border-black shadow-[4px_4px_0px_#000] flex gap-4 overflow-hidden transition-shadow"
                          >
                            <div className="w-24 h-24 md:w-32 md:h-32 shrink-0 border-r-4 border-black overflow-hidden">
                              <img src={order.restaurant?.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                            </div>
                            <div className="p-4 flex-1 flex flex-col justify-center">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h3 className="font-black uppercase text-lg leading-tight">{order.restaurant?.name}</h3>
                                  <p className="font-bold text-gray-400 text-xs uppercase">{new Date(order.createdAt).toLocaleDateString()}</p>
                                </div>
                                <div className="text-right shrink-0">
                                  <span className="font-black text-xl">₹{order.totalAmount}</span>
                                  <span className={`block text-[10px] font-black uppercase px-2 py-0.5 border-2 border-black mt-1 ${statusConfig.color}`}>
                                    {statusConfig.text}
                                  </span>
                                </div>
                              </div>
                              <p className="font-bold text-xs uppercase text-gray-400 mt-2">
                                {order.items.map((i: any) => `${i.quantity}× ${i.name}`).join(' • ')}
                              </p>
                              <button
                                onClick={() => setSelectedOrder(order)}
                                className="mt-3 self-start bg-[#FFD700] border-2 border-black px-3 py-1.5 font-black uppercase text-xs shadow-[2px_2px_0px_#000] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all"
                              >
                                More Details →
                              </button>
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </BrutalistFrame>
                </section>
              )}

            </div>
          )}
        </div>
      </motion.div>
    );
};

export default CustomerOrders;
