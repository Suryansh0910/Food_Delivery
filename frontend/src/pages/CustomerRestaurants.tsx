import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Navigation, Leaf, Star, Clock, ArrowRight, Filter, Zap, Flame } from 'lucide-react';
import { getRestaurantsForCustomer } from '../services/restaurantService';
import { Link } from 'react-router-dom';
import { TickerStrip, BrutalistFrame, FOOD_TICKERS } from '../components/DesignElements';


const RestaurantCard = ({ restaurant, compact = false, index = 0 }: { restaurant: any; compact?: boolean; index?: number }) => (
  <Link to={`/restaurant/${restaurant._id}`}>
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 22, delay: index * 0.07 }}
      whileHover={{ y: -6, x: -6, boxShadow: compact ? '8px 8px 0px #000' : '14px 14px 0px #FFD700' }}
      whileTap={{ scale: 0.97 }}
      className={`bg-white border-4 border-black cursor-pointer flex flex-col h-full transition-shadow ${
        compact ? 'shadow-[4px_4px_0px_#000]' : 'shadow-[8px_8px_0px_#000]'
      }`}
    >
      <div className={`border-b-4 border-black overflow-hidden relative ${compact ? 'h-36' : 'h-48'}`}>
        <motion.img
          src={restaurant.image}
          alt={restaurant.name}
          className="w-full h-full object-cover"
          whileHover={{ scale: 1.08 }}
          transition={{ duration: 0.4 }}
        />
        {/* Badges */}
        <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-2">
          {restaurant.isVegOnly && (
            <motion.span
              initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3 }}
              className="bg-green-100 text-green-700 border-2 border-green-700 px-2 py-0.5 flex items-center gap-1 font-black text-xs uppercase"
            >
              <Leaf className="w-3 h-3" /> Veg
            </motion.span>
          )}
          <motion.span
            initial={{ x: -20, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            className="bg-[#00E59B] border-2 border-black px-2 py-0.5 font-black text-xs uppercase flex items-center gap-1"
          >
            <span className="w-1.5 h-1.5 bg-black rounded-full animate-pulse inline-block" /> Open
          </motion.span>
        </div>

        {/* "HOT" ribbon for first 3 restaurants */}
        {index < 3 && !compact && (
          <div className="absolute top-3 right-3 bg-[#FFD700] border-2 border-black px-2 py-1 font-black text-xs uppercase shadow-[3px_3px_0px_#000] rotate-3 flex items-center gap-1">
            <Flame className="w-3 h-3" /> Hot
          </div>
        )}
      </div>

      <div className={`${compact ? 'p-4' : 'p-5'} flex-1 flex flex-col`}>
        <div className="flex justify-between items-start mb-1.5 gap-2">
          <h3 className={`font-display font-black uppercase leading-none ${compact ? 'text-xl' : 'text-2xl'}`}>
            {restaurant.name}
          </h3>
          <span className="bg-[#FFD700] border-2 border-black px-2 py-0.5 flex items-center gap-1 font-black text-xs shrink-0">
            4.5 <Star className="w-3 h-3 fill-black" />
          </span>
        </div>
        <p className="font-medium text-gray-500 text-xs uppercase mb-3 line-clamp-2">{restaurant.description}</p>

        <div className="mt-auto flex justify-between items-center border-t-2 border-gray-100 pt-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-gray-600 uppercase">
            <Clock className="w-3.5 h-3.5" /> 20–30 min
          </div>
          {compact ? (
            <div className="flex items-center gap-1 text-xs font-bold uppercase">
              <MapPin className="w-3.5 h-3.5" /> {restaurant.address?.area}
            </div>
          ) : (
            <motion.span
              whileHover={{ scale: 1.05 }}
              className="bg-black text-white px-3 py-1 text-xs font-black uppercase hover:bg-brand-600 transition-colors cursor-pointer"
            >
              Order Now →
            </motion.span>
          )}
        </div>
      </div>
    </motion.div>
  </Link>
);

// Floating speed badge
const FloatingBadge = ({ text, emoji, color, delay }: any) => (
  <motion.div
    animate={{ y: [0, -8, 0] }}
    transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut', delay }}
    className={`${color} border-4 border-black px-4 py-2 font-black text-sm uppercase shadow-[4px_4px_0px_#000] shrink-0`}
  >
    {emoji} {text}
  </motion.div>
);

const CustomerRestaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [user] = useState<any>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : { city: 'Mumbai', area: 'Bandra', name: 'Friend' };
  });

  useEffect(() => {
    if (!user.city || !user.area) { setLoading(false); return; }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await getRestaurantsForCustomer(user.city, user.area, search);
        setRestaurants(data);
      } catch (err) {
        console.error('Fetch Restaurants Error:', err);
      } finally {
        setLoading(false);
      }
    };

    const timeoutId = setTimeout(fetchContent, 400);
    return () => clearTimeout(timeoutId);
  }, [user.city, user.area, search]);

  const exactMatches = restaurants.filter(r => r.address.area.toLowerCase() === user.area.toLowerCase());
  const otherMatches = restaurants.filter(r => r.address.area.toLowerCase() !== user.area.toLowerCase());

  return (
    <div className="min-h-screen bg-[#f4f0ea] font-sans">

      {/* Hero Search Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-black border-b-8 border-brand-600 px-6 md:px-10 py-8"
      >
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6 mb-6">
            <div>
              <motion.p
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="font-bold text-brand-400 text-xs uppercase tracking-widest mb-1"
              >
                Hey, {user.name?.split(' ')[0]}! 👋
              </motion.p>
              <motion.h1
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="font-display font-black text-5xl md:text-6xl uppercase text-white leading-none"
              >
                What are you <br className="hidden md:block" />craving today?
              </motion.h1>
            </div>

            <div className="flex flex-wrap gap-3">
              <FloatingBadge text="Fast Delivery" emoji="⚡" color="bg-[#00E59B]" delay={0} />
              <FloatingBadge text={`${user.area}, ${user.city}`} emoji="📍" color="bg-[#FFD700]" delay={0.3} />
              <FloatingBadge text="Fresh Daily" emoji="🔥" color="bg-brand-500 text-white" delay={0.6} />
            </div>
          </div>

          {/* Search Row */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex gap-3"
          >
            <motion.div
              animate={{ scale: searchFocused ? 1.01 : 1 }}
              className="relative flex-1"
            >
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                placeholder="Search restaurants, dishes, cuisines..."
                className="w-full bg-white border-4 border-white pl-12 pr-4 py-3.5 font-bold text-base outline-none focus:border-[#FFD700] transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
              />
            </motion.div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-[#FFD700] border-4 border-white px-5 font-black uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:bg-white transition-colors"
            >
              <Filter className="w-4 h-4" /> Filter
            </motion.button>
          </motion.div>
        </div>
      </motion.div>

      {/* ── Hype Ticker 1 ── */}
      <TickerStrip
        items={FOOD_TICKERS.hype}
        bg="bg-black"
        textColor="text-[#FFD700]"
        speed={14}
        size="md"
      />

      {/* Scrolling ticker */}
      <div className="bg-[#FFD700] border-b-4 border-black overflow-hidden py-2">
        <motion.div
          animate={{ x: ['0%', '-50%'] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="flex gap-8 font-black text-xs uppercase whitespace-nowrap px-4"
        >
          {Array.from({ length: 2 }).map((_, i) => (
            <span key={i} className="flex gap-8 shrink-0">
              <span>🍔 Free delivery over ₹299</span>
              <span>•</span>
              <span>⚡ 30-min guarantee</span>
              <span>•</span>
              <span>🌶️ 100% fresh ingredients</span>
              <span>•</span>
              <span>💰 Best prices in {user.city}</span>
              <span>•</span>
              <span>🛵 Real-time GPS tracking</span>
              <span>•</span>
            </span>
          ))}
        </motion.div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div
              key="loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center py-24 gap-6"
            >
              <div className="relative">
                <div className="w-16 h-16 border-8 border-black border-t-[#00E59B] rounded-full animate-spin" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                  className="absolute inset-0 flex items-center justify-center text-2xl"
                >
                  🍜
                </motion.div>
              </div>
              <motion.p
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="font-display font-black text-2xl uppercase"
              >
                Scouting the best spots...
              </motion.p>
            </motion.div>
          ) : (
            <motion.div key="content" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>

              {/* Exact Area Section */}
              <section className="mb-14">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between mb-6"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      animate={{ rotate: [0, -10, 10, 0] }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                      className="bg-[#00E59B] border-4 border-black p-2 shadow-[3px_3px_0px_#000]"
                    >
                      <Navigation className="w-5 h-5 stroke-[2.5]" />
                    </motion.div>
                    <div>
                      <h2 className="font-display font-black text-3xl uppercase leading-none flex items-center gap-2">
                        Hot in {user.area}
                        <motion.span
                          animate={{ scale: [1, 1.3, 1] }}
                          transition={{ duration: 1.5, repeat: Infinity }}
                        >
                          🔥
                        </motion.span>
                      </h2>
                      <p className="font-medium text-gray-500 text-xs uppercase">{exactMatches.length} restaurants near you</p>
                    </div>
                  </div>
                </motion.div>

                {exactMatches.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-white border-4 border-black p-10 text-center shadow-[4px_4px_0px_#000]"
                  >
                    <motion.div
                      animate={{ rotate: [0, 5, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl mb-4"
                    >
                      🏙️
                    </motion.div>
                    <p className="font-display font-black text-3xl uppercase mb-2">
                      {(!user.city || !user.area) ? "Missing Location!" : `Nothing in ${user.area} yet`}
                    </p>
                    <p className="font-medium text-gray-500 uppercase">
                      {(!user.city || !user.area)
                        ? "Go to your DASHBOARD and set your city/area!"
                        : `Check out restaurants from other ${user.city} areas below!`}
                    </p>
                  </motion.div>
                ) : (
                  <BrutalistFrame accentColor="#00E59B" shadowColor="#FFD700" label="🔥 Near You" labelBg="bg-[#00E59B]" className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {exactMatches.map((r, i) => (
                      <RestaurantCard key={r._id} restaurant={r} index={i} />
                    ))}
                    </div>
                  </BrutalistFrame>
                )}
              </section>

              {/* ── Deals Ticker between sections ── */}
              {otherMatches.length > 0 && (
                <TickerStrip
                  items={FOOD_TICKERS.deals}
                  direction="right"
                  bg="bg-brand-600"
                  textColor="text-white"
                  speed={18}
                  size="sm"
                />
              )}

              {/* City-wide Section */}
              {otherMatches.length > 0 && (
                <section>
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3 mb-6 border-t-4 border-black pt-8"
                  >
                    <h2 className="font-display font-black text-2xl uppercase text-gray-500">
                      More in {user.city}
                    </h2>
                    <span className="font-bold text-xs text-gray-400 uppercase border-2 border-gray-300 px-2 py-0.5 flex items-center gap-1">
                      <Zap className="w-3 h-3" /> Longer delivery
                    </span>
                  </motion.div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                    {otherMatches.slice(0, 20).map((r, i) => (
                      <RestaurantCard key={r._id} restaurant={r} compact index={i} />
                    ))}
                  </div>
                  {otherMatches.length > 20 && (
                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      className="mt-6 w-full border-4 border-black py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[4px_4px_0px_#000]"
                    >
                      See {otherMatches.length - 20} more restaurants <ArrowRight className="w-5 h-5" />
                    </motion.button>
                  )}
                </section>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CustomerRestaurants;
