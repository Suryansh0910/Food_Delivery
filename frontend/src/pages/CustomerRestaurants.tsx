import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, MapPin, Navigation, Leaf, Star, Clock, ArrowRight, Filter } from 'lucide-react';
import { getRestaurantsForCustomer } from '../services/restaurantService';

const RestaurantCard = ({ restaurant, compact = false }: { restaurant: any; compact?: boolean }) => (
  <motion.div
    whileHover={{ y: -4, x: -4 }}
    className={`bg-white border-4 border-black cursor-pointer transition-all flex flex-col h-full ${
      compact ? 'shadow-[4px_4px_0px_#000] hover:shadow-[8px_8px_0px_#000]' : 'shadow-[8px_8px_0px_#000] hover:shadow-[12px_12px_0px_#000]'
    }`}
  >
    <div className={`border-b-4 border-black overflow-hidden relative ${compact ? 'h-36' : 'h-48'}`}>
      <img src={restaurant.image} alt={restaurant.name} className="w-full h-full object-cover" />
      <div className="absolute bottom-0 left-0 right-0 flex gap-1.5 p-2">
        {restaurant.isVegOnly && (
          <span className="bg-green-100 text-green-700 border-2 border-green-700 px-2 py-0.5 flex items-center gap-1 font-black text-xs uppercase">
            <Leaf className="w-3 h-3" /> Veg
          </span>
        )}
        <span className="bg-[#00E59B] border-2 border-black px-2 py-0.5 font-black text-xs uppercase">
          ● Open
        </span>
      </div>
    </div>
    <div className={`${compact ? 'p-4' : 'p-5'} flex-1 flex flex-col`}>
      <div className="flex justify-between items-start mb-1.5 gap-2">
        <h3 className={`font-display font-black uppercase leading-none ${compact ? 'text-xl' : 'text-2xl'}`}>{restaurant.name}</h3>
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
          <span className="bg-black text-white px-3 py-1 text-xs font-black uppercase hover:bg-brand-600 transition-colors">
            Order Now
          </span>
        )}
      </div>
    </div>
  </motion.div>
);

const CustomerRestaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [user, setUser] = useState<any>(() => {
    const raw = localStorage.getItem('user');
    return raw ? JSON.parse(raw) : { city: 'Mumbai', area: 'Bandra', name: 'Friend' };
  });

  useEffect(() => {
    // If city or area is missing, tell user to set it (handled by UI below)
    if (!user.city || !user.area) {
        setLoading(false);
        return;
    }

    const fetchContent = async () => {
      setLoading(true);
      try {
        const data = await getRestaurantsForCustomer(user.city, user.area);
        setRestaurants(data);
      } catch (err) {
        console.error('Fetch Restaurants Error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [user.city, user.area]);

  const filtered = restaurants.filter(r =>
    !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.description?.toLowerCase().includes(search.toLowerCase())
  );

  const exactMatches = filtered.filter(r => r.address.area === user.area);
  const otherMatches = filtered.filter(r => r.address.area !== user.area);

  return (
    <div className="min-h-screen bg-[#f4f0ea] font-sans">

      {/* Hero Search Bar */}
      <div className="bg-black border-b-8 border-brand-600 px-6 md:px-10 py-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
            <div>
              <p className="font-bold text-brand-400 text-xs uppercase tracking-widest mb-1">Hey, {user.name?.split(' ')[0]}! 👋</p>
              <h1 className="font-display font-black text-5xl md:text-6xl uppercase text-white leading-none">
                What are you <br className="hidden md:block" />craving today?
              </h1>
            </div>
            <div className="flex items-center gap-2 bg-[#FFD700] border-4 border-white px-4 py-2 shadow-[4px_4px_0px_rgba(255,255,255,0.3)]">
              <MapPin className="w-4 h-4 shrink-0" />
              <span className="font-black uppercase text-sm">{user.area}, {user.city}</span>
            </div>
          </div>

          {/* Search Row */}
          <div className="mt-6 flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 stroke-[2.5]" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Search restaurants, cuisines..."
                className="w-full bg-white border-4 border-white pl-12 pr-4 py-3.5 font-bold text-base outline-none focus:border-[#FFD700] transition-colors shadow-[4px_4px_0px_rgba(255,255,255,0.2)]"
              />
            </div>
            <button className="bg-[#FFD700] border-4 border-white px-5 font-black uppercase text-sm flex items-center gap-2 shadow-[4px_4px_0px_rgba(255,255,255,0.2)] hover:bg-white transition-colors">
              <Filter className="w-4 h-4" /> Filter
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-10">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-12 h-12 border-4 border-black border-t-[#00E59B] rounded-full animate-spin" />
            <p className="font-display font-black text-2xl uppercase">Scouting the best spots...</p>
          </div>
        ) : (
          <>
            {/* Exact Area Section */}
            <section className="mb-14">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-[#00E59B] border-4 border-black p-2 shadow-[3px_3px_0px_#000]">
                    <Navigation className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h2 className="font-display font-black text-3xl uppercase leading-none">Hot in {user.area}</h2>
                    <p className="font-medium text-gray-500 text-xs uppercase">{exactMatches.length} restaurants near you</p>
                  </div>
                </div>
              </div>

              {exactMatches.length === 0 ? (
                <div className="bg-white border-4 border-black p-10 text-center shadow-[4px_4px_0px_#000]">
                  <p className="font-display font-black text-3xl uppercase mb-2">
                    {(!user.city || !user.area) ? "Missing Location Data!" : `Nothing in ${user.area} yet`}
                  </p>
                  <p className="font-medium text-gray-500 uppercase">
                    {(!user.city || !user.area) 
                      ? "Go to your DASHBOARD and re-save your profile to set your city/area!" 
                      : `Check out restaurants from other ${user.city} areas below!`}
                  </p>
                  {(!user.city || !user.area) && (
                    <a href="/customer/dashboard" className="mt-6 inline-block bg-[#FFD700] border-4 border-black px-8 py-3 font-black uppercase shadow-[4px_4px_0px_#000] hover:translate-x-1 transition-all">
                      Go to Dashboard
                    </a>
                  )}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {exactMatches.map((r) => (
                    <RestaurantCard key={r._id} restaurant={r} />
                  ))}
                </div>
              )}
            </section>

            {/* City-wide Section */}
            {otherMatches.length > 0 && (
              <section>
                <div className="flex items-center gap-3 mb-6 border-t-4 border-black pt-8">
                  <h2 className="font-display font-black text-2xl uppercase text-gray-400">
                    More in {user.city}
                  </h2>
                  <span className="font-bold text-xs text-gray-400 uppercase border-2 border-gray-300 px-2 py-0.5">
                    Longer delivery
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
                  {otherMatches.slice(0, 20).map((r) => (
                    <RestaurantCard key={r._id} restaurant={r} compact />
                  ))}
                </div>
                {otherMatches.length > 20 && (
                  <button className="mt-6 w-full border-4 border-black py-4 font-black uppercase flex items-center justify-center gap-2 hover:bg-white transition-colors shadow-[4px_4px_0px_#000]">
                    See {otherMatches.length - 20} more restaurants <ArrowRight className="w-5 h-5" />
                  </button>
                )}
              </section>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default CustomerRestaurants;
