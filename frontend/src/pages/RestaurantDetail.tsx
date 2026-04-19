import { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { MapPin, Clock, Star, ArrowLeft, Plus, Minus, ShoppingCart, Leaf, Zap, CheckCircle, Flame } from 'lucide-react';
import { getRestaurantById } from '../services/restaurantService';
import { createOrder } from '../services/orderService';
import { TickerStrip, BrutalistFrame, FOOD_TICKERS } from '../components/DesignElements';

/* ── Floating food emojis decorating the background ── */
const FOOD_EMOJIS = ['🍜', '🌮', '🥘', '🍣', '🍔', '🌯', '🍕', '🥗'];

const FloatingEmoji = ({ emoji, x, delay }: { emoji: string; x: number; delay: number }) => (
  <motion.div
    className="absolute text-4xl select-none pointer-events-none opacity-10"
    style={{ left: `${x}%`, top: '-10%' }}
    animate={{ y: ['0%', '110vh'] }}
    transition={{ duration: 12 + delay * 2, repeat: Infinity, delay, ease: 'linear' }}
  >
    {emoji}
  </motion.div>
);

/* ── Diagonal corner stamp ── */
const CornerStamp = ({ text, color = 'bg-[#FFD700]' }: { text: string; color?: string }) => (
  <div className={`${color} border-2 border-black px-3 py-1 font-black text-xs uppercase shadow-[3px_3px_0px_#000] transform -rotate-6 select-none`}>
    {text}
  </div>
);

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);
  const [addedId, setAddedId] = useState<string | null>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 1.1]);

  useEffect(() => {
    const fetchRes = async () => {
      if (id) {
        try {
          const data = await getRestaurantById(id);
          setRestaurant(data);
        } catch (err) {
          console.error(err);
        } finally {
          setLoading(false);
        }
      }
    };
    fetchRes();
  }, [id]);

  const addToCart = (item: any) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === item._id);
      if (existing) return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
      return [...prev, { ...item, qty: 1 }];
    });
    setAddedId(item._id);
    setTimeout(() => setAddedId(null), 800);
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
      const existing = prev.find(i => i._id === itemId);
      if (existing.qty === 1) return prev.filter(i => i._id !== itemId);
      return prev.map(i => i._id === itemId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);
  const cartCount = cart.reduce((acc, item) => acc + item.qty, 0);

  const handleCheckout = async () => {
    if (cart.length === 0) return;
    setCheckingOut(true);
    try {
      const userStr = localStorage.getItem('user');
      const userObj = userStr ? JSON.parse(userStr) : {};
      const deliveryAddress = `${userObj.street || ''} ${userObj.area || ''}, ${userObj.city || ''}`;
      await createOrder({
        restaurantId: restaurant._id,
        items: cart.map(i => ({ name: i.name, price: i.price, quantity: i.qty })),
        totalAmount: total,
        deliveryAddress: deliveryAddress.trim() || 'Address not provided'
      });
      setCart([]);
      navigate('/customer/orders');
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Checkout failed!');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4f0ea] flex flex-col items-center justify-center gap-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
        className="w-16 h-16 border-8 border-black border-t-[#00E59B] rounded-full"
      />
      <motion.p animate={{ opacity: [0.4,1,0.4] }} transition={{ duration: 1.2, repeat: Infinity }} className="font-black uppercase text-lg">
        Loading Menu...
      </motion.p>
    </div>
  );

  if (!restaurant) return (
    <div className="min-h-screen bg-[#f4f0ea] p-10 text-center uppercase font-black">
      Restaurant not found!
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f0ea] font-sans pb-24 relative overflow-x-hidden">

      {/* ── Background floating emojis ── */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        {FOOD_EMOJIS.map((emoji, i) => (
          <FloatingEmoji key={i} emoji={emoji} x={5 + i * 13} delay={i * 1.4} />
        ))}
      </div>

      {/* ── Parallax Hero Header ── */}
      <div ref={heroRef} className="relative h-64 md:h-96 border-b-8 border-black overflow-hidden">
        <motion.img
          style={{ scale: heroScale, opacity: heroOpacity }}
          src={restaurant.image}
          className="w-full h-full object-cover absolute inset-0"
        />
        {/* dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Back button */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="absolute top-6 left-6 z-10">
          <Link to="/customer/restaurants" className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_#000] hover:bg-[#FFD700] hover:translate-x-1 transition-all flex items-center">
            <ArrowLeft className="w-6 h-6" />
          </Link>
        </motion.div>

        {/* Floating stamps top-right */}
        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="absolute top-6 right-6 z-10 flex flex-col gap-2 items-end">
          <CornerStamp text="🔥 Trending" color="bg-red-500 text-white" />
          <CornerStamp text="⚡ Fast" />
        </motion.div>

        {/* Restaurant name card */}
        <motion.div
          initial={{ opacity: 0, x: -40, rotate: -3 }}
          animate={{ opacity: 1, x: 0, rotate: -1 }}
          transition={{ type: 'spring', stiffness: 200, delay: 0.1 }}
          className="absolute bottom-6 left-6 bg-white border-8 border-black p-5 shadow-[12px_12px_0px_#FFD700] transform -rotate-1 z-10"
        >
          <h1 className="font-display font-black text-3xl md:text-5xl uppercase leading-none">{restaurant.name}</h1>
          <div className="flex flex-wrap items-center gap-3 mt-2 font-black uppercase text-sm">
            <motion.span whileHover={{ scale: 1.1 }} className="flex items-center gap-1 bg-[#FFD700] px-2 py-0.5 border-2 border-black">
              <Star className="w-4 h-4 fill-black" /> 4.5
            </motion.span>
            <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 20-30 MIN</span>
            <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.address.area}</span>
            <motion.span
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="flex items-center gap-1 bg-[#00E59B] border-2 border-black px-2 py-0.5"
            >
              <span className="w-2 h-2 bg-black rounded-full animate-pulse" /> Open Now
            </motion.span>
          </div>
        </motion.div>
      </div>

      {/* ── Menu hype ticker ── */}
      <TickerStrip
        items={['🍽️ Fresh & Hot', '⚡ Fast Prep', '🔥 Chef\'s Special', '🌿 Finest Ingredients', '💯 Top Rated', '🏆 Customer Favourite']}
        bg="bg-black"
        textColor="text-[#FFD700]"
        speed={14}
        borderBottom
        borderTop={false}
      />

      {/* ── Floating mobile checkout bar ── */}
      <AnimatePresence>
        {cartCount > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 60 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 60 }}
            className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 lg:hidden"
          >
            <motion.button
              onClick={handleCheckout}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="bg-black text-white border-4 border-black px-8 py-3 font-black uppercase text-lg shadow-[6px_6px_0px_#00E59B] flex items-center gap-3"
            >
              <ShoppingCart className="w-5 h-5" />
              {cartCount} items · ₹{total}
              <span className="text-[#00E59B]">Checkout →</span>
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-3 gap-10 relative z-10">

        {/* ── Menu Section ── */}
        <div className="lg:col-span-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8 border-b-8 border-black pb-4"
          >
            <Flame className="w-8 h-8 text-red-500" />
            <h2 className="font-display font-black text-4xl md:text-5xl uppercase">Our Menu</h2>
            {restaurant.menu?.length > 0 && (
              <span className="ml-auto bg-black text-[#FFD700] font-black px-3 py-1 text-sm uppercase border-2 border-black">
                {restaurant.menu.length} items
              </span>
            )}
          </motion.div>

          {!restaurant.menu || restaurant.menu.length === 0 ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white border-4 border-black p-10 text-center shadow-[8px_8px_0px_#000]"
            >
              <motion.div animate={{ rotate: [0, 10, -10, 0] }} transition={{ duration: 3, repeat: Infinity }} className="text-6xl mb-4">
                🍽️
              </motion.div>
              <p className="font-display font-black text-3xl uppercase mb-2">Menu Coming Soon</p>
              <p className="font-medium text-gray-500 uppercase">The owner is still crafting their offerings.</p>
            </motion.div>
          ) : (
            <div className="space-y-12">
              {['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides'].map((cat, catIdx) => {
                const items = restaurant.menu.filter((i: any) => i.category === cat);
                if (items.length === 0) return null;

                return (
                  <motion.div
                    key={cat}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: catIdx * 0.12 }}
                  >
                    {/* Category header with decorative left bar */}
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-3 h-10 bg-[#00E59B] border-2 border-black shrink-0" />
                      <h3 className="bg-[#00E59B] border-4 border-black px-4 py-1.5 font-black uppercase text-xl inline-block shadow-[4px_4px_0px_#000]">
                        {cat}
                      </h3>
                      <div className="flex-1 border-t-4 border-dashed border-black/20" />
                      <span className="text-xs font-black uppercase text-gray-400">{items.length} dishes</span>
                    </div>

                    <BrutalistFrame
                      accentColor="#00E59B"
                      shadowColor="#FFD700"
                      label={`🍴 ${cat}`}
                      labelBg="bg-black text-white"
                      className="p-4"
                    >
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {items.map((item: any, itemIdx: number) => {
                          const inCart = cart.find(i => i._id === item._id);
                          return (
                            <motion.div
                              key={item._id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: catIdx * 0.1 + itemIdx * 0.06 }}
                              whileHover={{ y: -4, boxShadow: '8px 8px 0px #FFD700' }}
                              className="bg-white border-4 border-black p-4 shadow-[4px_4px_0px_#000] flex justify-between gap-4 transition-shadow cursor-pointer group"
                            >
                              <div className="flex-1">
                                <div className="flex items-center gap-1 mb-1">
                                  {item.isVeg && <Leaf className="w-4 h-4 text-green-600 shrink-0" />}
                                  <h4 className="font-black uppercase text-base leading-tight">{item.name}</h4>
                                </div>
                                <p className="text-xs font-bold text-gray-400 uppercase line-clamp-2 mb-3">{item.description}</p>
                                <div className="flex items-center gap-2">
                                  <p className="font-black text-xl">₹{item.price}</p>
                                  {inCart && (
                                    <motion.span
                                      initial={{ scale: 0 }}
                                      animate={{ scale: 1 }}
                                      className="bg-[#00E59B] border-2 border-black px-2 py-0.5 text-[10px] font-black uppercase"
                                    >
                                      ×{inCart.qty} in cart
                                    </motion.span>
                                  )}
                                </div>
                              </div>

                              <div className="w-24 h-24 bg-gray-100 border-4 border-black shrink-0 relative overflow-hidden">
                                <motion.img
                                  src={item.image || 'https://via.placeholder.com/150'}
                                  className="w-full h-full object-cover"
                                  whileHover={{ scale: 1.12 }}
                                  transition={{ duration: 0.3 }}
                                />

                                {/* Add/Remove controls */}
                                <AnimatePresence mode="wait">
                                  {inCart ? (
                                    <motion.div
                                      key="counter"
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: 10 }}
                                      className="absolute bottom-0 left-0 right-0 flex items-center justify-between bg-black px-1 py-0.5"
                                    >
                                      <button onClick={() => removeFromCart(item._id)} className="text-white hover:text-red-400 transition-colors">
                                        <Minus className="w-4 h-4 stroke-[3]" />
                                      </button>
                                      <motion.span key={inCart.qty} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="text-white font-black text-sm">{inCart.qty}</motion.span>
                                      <button onClick={() => addToCart(item)} className="text-[#00E59B] hover:text-white transition-colors">
                                        <Plus className="w-4 h-4 stroke-[3]" />
                                      </button>
                                    </motion.div>
                                  ) : (
                                    <motion.button
                                      key="add"
                                      initial={{ opacity: 0 }}
                                      animate={{ opacity: 1 }}
                                      exit={{ opacity: 0 }}
                                      onClick={() => addToCart(item)}
                                      whileHover={{ scale: 1.15 }}
                                      whileTap={{ scale: 0.9 }}
                                      className="absolute -bottom-2 -left-2 bg-white border-2 border-black p-1 hover:bg-[#00E59B] transition-colors shadow-[2px_2px_0px_#000]"
                                    >
                                      <Plus className="w-5 h-5 stroke-[3]" />
                                    </motion.button>
                                  )}
                                </AnimatePresence>

                                {/* "Added!" flash */}
                                <AnimatePresence>
                                  {addedId === item._id && (
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.5 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.5 }}
                                      className="absolute inset-0 bg-[#00E59B]/90 flex items-center justify-center"
                                    >
                                      <CheckCircle className="w-10 h-10 text-white stroke-[3]" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </motion.div>
                          );
                        })}
                      </div>
                    </BrutalistFrame>

                    {/* Micro-ticker between categories */}
                    {catIdx < 4 && (
                      <div className="mt-6">
                        <TickerStrip
                          items={FOOD_TICKERS.deals}
                          bg="bg-[#f4f0ea]"
                          textColor="text-black/30"
                          speed={30}
                          size="sm"
                          borderBottom={false}
                          borderTop={false}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Sticky Cart Sidebar ── */}
        <div className="lg:block">
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="sticky top-28"
          >
            {/* Decorative top strip */}
            <div className="bg-black border-4 border-black border-b-0 px-4 py-2 flex items-center justify-between">
              <span className="text-[#FFD700] font-black uppercase text-xs tracking-widest">🛒 Your Cart</span>
              {cartCount > 0 && (
                <motion.span
                  key={cartCount}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', stiffness: 500 }}
                  className="bg-[#00E59B] text-black font-black text-xs px-2 py-0.5 border-2 border-[#00E59B]"
                >
                  {cartCount} items
                </motion.span>
              )}
            </div>

            <div className="bg-white border-4 border-black border-t-0 shadow-[8px_8px_0px_#00E59B]">
              <div className="p-5">
                <h2 className="font-display font-black text-2xl uppercase mb-4 flex items-center gap-2 border-b-4 border-black pb-3">
                  <ShoppingCart className="w-6 h-6" /> Your Order
                </h2>

                <AnimatePresence mode="wait">
                  {cart.length === 0 ? (
                    <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                      <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 2, repeat: Infinity }} className="text-center text-5xl py-6">
                        🛒
                      </motion.div>
                      <p className="font-bold uppercase text-gray-400 text-center text-sm">Cart is empty! Feed your soul.</p>
                    </motion.div>
                  ) : (
                    <motion.div key="filled" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                      <div className="space-y-3 mb-5 max-h-72 overflow-y-auto">
                        <AnimatePresence>
                          {cart.map(item => (
                            <motion.div
                              key={item._id}
                              layout
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: 'auto' }}
                              exit={{ opacity: 0, height: 0 }}
                              className="flex justify-between items-center border-b-2 border-dashed border-gray-200 pb-3"
                            >
                              <div>
                                <p className="font-black uppercase text-sm">{item.name}</p>
                                <p className="font-bold text-gray-500 text-sm">₹{item.price * item.qty}</p>
                              </div>
                              <div className="flex items-center gap-1 bg-[#f4f0ea] border-2 border-black px-2 py-0.5">
                                <button onClick={() => removeFromCart(item._id)} className="hover:text-red-600 transition-colors"><Minus className="w-3 h-3 stroke-[3]" /></button>
                                <motion.span key={item.qty} initial={{ scale: 1.5 }} animate={{ scale: 1 }} className="font-black w-5 text-center text-sm">{item.qty}</motion.span>
                                <button onClick={() => addToCart(item)} className="hover:text-green-600 transition-colors"><Plus className="w-3 h-3 stroke-[3]" /></button>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>

                      <div className="border-t-4 border-black pt-3 mb-4">
                        <div className="flex justify-between font-black text-xl uppercase">
                          <span>Total</span>
                          <motion.span key={total} initial={{ scale: 1.2, color: '#00E59B' }} animate={{ scale: 1, color: '#000' }}>₹{total}</motion.span>
                        </div>
                        <p className="font-bold text-xs uppercase text-gray-400 mt-1">COD • Free delivery</p>
                      </div>

                      <motion.button
                        onClick={handleCheckout}
                        disabled={checkingOut}
                        whileHover={{ x: 3, y: 3, boxShadow: 'none' }}
                        className="w-full bg-black text-white border-4 border-black py-3 font-black uppercase text-lg shadow-[6px_6px_0px_#00E59B] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                      >
                        {checkingOut ? (
                          <><div className="w-5 h-5 border-2 border-white border-t-[#00E59B] rounded-full animate-spin" /> Placing Order...</>
                        ) : (
                          <><Zap className="w-5 h-5 stroke-[3]" /> Checkout Now</>
                        )}
                      </motion.button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Decorative bottom strip */}
              <div className="bg-[#FFD700] border-t-4 border-black px-4 py-2">
                <p className="font-black uppercase text-xs text-center">⚡ Delivered in 20-30 min</p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
