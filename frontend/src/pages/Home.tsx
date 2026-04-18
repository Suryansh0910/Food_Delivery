import { ShoppingBag, Utensils, Star, Clock, MapPin, Bike, Store, ShieldCheck, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

function Home() {
  return (
    <div className="min-h-screen bg-white font-sans text-navy-900">
      {/* PART 1: Hero Section (Neo-Brutalism) */}
      <section className="h-[calc(100svh-6rem)] bg-[#f4f0ea] border-b-4 border-black relative overflow-hidden flex flex-col justify-center">
        {/* Background decorative grid/dots */}
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

        <div className="max-w-7xl mx-auto px-6 md:px-12 w-full relative z-10 flex-1 flex items-center pb-20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-12 w-full">

            {/* Left side: Massive Typography */}
            <div className="w-full md:w-3/5 order-2 md:order-1 relative z-10 pt-4 md:pt-0">
              <motion.div
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="inline-block bg-[#FFD700] border-4 border-black font-black uppercase tracking-widest px-6 py-2 mb-8 shadow-[6px_6px_0px_#000] -rotate-2"
              >
                Warning: Highly Addictive ⚠️
              </motion.div>

              <h1 className="text-7xl md:text-[8rem] font-black text-black leading-[0.85] uppercase tracking-tighter mb-8 mix-blend-multiply">
                Drop <br />
                <span className="block mt-2" style={{ WebkitTextStroke: '4px black', color: 'transparent' }}>The</span>
                Dishes.
              </h1>

              <p className="text-2xl font-bold text-black border-l-8 border-brand-600 pl-6 mb-12 max-w-lg bg-[#f4f0ea]/80 py-2">
                We deliver your city's best food, faster than you can say "I'm hungry".
              </p>

              {/* Brutalist Search Bar */}
              <div className="flex bg-white border-4 border-black p-2 shadow-[8px_8px_0px_#000] focus-within:translate-x-[4px] focus-within:translate-y-[4px] focus-within:shadow-[4px_4px_0px_#000] transition-all max-w-xl">
                <div className="bg-brand-100 p-3 border-4 border-black flex items-center justify-center">
                  <MapPin className="text-black h-8 w-8 stroke-[3]" />
                </div>
                <input
                  type="text"
                  className="flex-1 px-6 outline-none text-xl md:text-2xl font-bold text-black uppercase placeholder-black/30 bg-transparent w-full"
                  placeholder="YOUR ADDRESS..."
                />
                <button className="bg-brand-600 border-4 border-black text-white text-xl font-black uppercase px-8 hover:bg-black transition-colors hidden sm:block">
                  Feed Me
                </button>
              </div>
            </div>

            {/* Right side: Brutalist Collage / Cards */}
            <div className="w-full md:w-2/5 order-1 md:order-2 relative h-[400px] md:h-[500px] flex justify-center items-center mt-12 md:mt-0">

              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="absolute inset-0 flex justify-center items-center pointer-events-none opacity-5"
              >
                <Utensils className="w-[400px] h-[400px] md:w-[600px] md:h-[600px] text-black" />
              </motion.div>

              {/* Floating Brutalist Ticket 1 */}
              <motion.div
                initial={{ y: 50, opacity: 0, rotate: 10 }}
                animate={{ y: 0, opacity: 1, rotate: 6 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="absolute top-0 md:top-10 right-0 bg-[#00E59B] border-4 border-black p-6 shadow-[8px_8px_0px_#000] z-20 w-56 md:w-64 cursor-pointer"
              >
                <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-center">
                  <span className="font-black text-2xl uppercase">#1 Rated</span>
                  <Star className="text-black fill-current w-8 h-8 stroke-[2]" />
                </div>
                <p className="font-bold text-lg leading-tight uppercase">Voted best delivery app 2026</p>
              </motion.div>

              {/* Floating Brutalist Ticket 2 */}
              <motion.div
                initial={{ y: -50, opacity: 0, rotate: -15 }}
                animate={{ y: 0, opacity: 1, rotate: -8 }}
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="absolute bottom-10 md:bottom-20 left-0 bg-brand-600 border-4 border-black p-6 shadow-[8px_8px_0px_#000] z-30 w-64 md:w-72 text-white cursor-pointer"
              >
                <div className="border-b-4 border-black pb-4 mb-4 flex justify-between items-center">
                  <span className="font-black text-4xl uppercase">15 Min</span>
                  <Clock className="text-white w-8 h-8 stroke-[3]" />
                </div>
                <p className="font-bold text-xl leading-tight uppercase">Lightning fast delivery</p>
              </motion.div>

              {/* Floating Center Circle */}
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="w-56 h-56 md:w-64 md:h-64 bg-white border-8 border-black rounded-full flex flex-col items-center justify-center shadow-[12px_12px_0px_#000] z-10 overflow-hidden relative"
              >
                <div className="absolute inset-0 bg-[#FFD700] origin-bottom animate-pulse opacity-50"></div>
                <Bike className="w-20 h-20 md:w-24 md:h-24 text-black relative z-10 mb-2 stroke-[2]" />
                <span className="font-black text-2xl uppercase relative z-10 text-center leading-none mt-2">GO<br />GO GO!</span>
              </motion.div>

            </div>

          </div>
        </div>

        {/* Both Marquee Bars - pinned to bottom of hero */}
        <div className="absolute bottom-0 left-0 w-full z-40 flex flex-col">
          {/* Top Marquee (Backwards) */}
          <div className="w-full bg-brand-600 text-white border-t-4 border-black py-3 overflow-hidden flex whitespace-nowrap">
            <motion.div
              animate={{ x: ["-50%", "0%"] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="flex gap-8 font-black text-2xl uppercase px-4"
            >
              <span>⚡ LIGHTNING FAST</span><span>•</span>
              <span>🛵 TRACK YOUR RIDER</span><span>•</span>
              <span>🌶️ SPICY DEALS</span><span>•</span>
              <span>🥇 CRAVING SATISFIED</span><span>•</span>
              <span>⚡ LIGHTNING FAST</span><span>•</span>
              <span>🛵 TRACK YOUR RIDER</span><span>•</span>
              <span>🌶️ SPICY DEALS</span><span>•</span>
              <span>🥇 CRAVING SATISFIED</span>
            </motion.div>
          </div>

          {/* Bottom Marquee (Original) */}
          <div className="w-full bg-[#FFD700] text-black border-y-4 border-black py-4 overflow-hidden flex whitespace-nowrap">
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ duration: 15, repeat: Infinity, ease: 'linear' }}
              className="flex gap-8 font-black text-3xl uppercase px-4"
            >
              <span>🍔 NO HIDDEN FEES</span><span>•</span>
              <span>🔥 HOT DELIVERY</span><span>•</span>
              <span>💸 50% OFF FIRST ORDER</span><span>•</span>
              <span>🍕 5000+ RESTAURANTS</span><span>•</span>
              <span>🍔 NO HIDDEN FEES</span><span>•</span>
              <span>🔥 HOT DELIVERY</span><span>•</span>
              <span>💸 50% OFF FIRST ORDER</span><span>•</span>
              <span>🍕 5000+ RESTAURANTS</span>
            </motion.div>
          </div>
        </div>
      </section>

      {/* PART 3: How it Works */}
      <section className="py-24 px-6 md:px-12 bg-[#00E59B] border-b-4 border-black">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-5xl md:text-7xl font-black text-black mb-4 uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)]">How It Works</h2>
          <p className="text-black font-bold text-xl max-w-2xl mx-auto mb-16 uppercase bg-black text-white py-2 px-4 shadow-[4px_4px_0px_#FFD700] inline-block -rotate-1">Get food in 3 simple steps.</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="bg-white p-8 border-4 border-black shadow-[12px_12px_0px_#000] flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-24 h-24 bg-[#FFD700] border-4 border-black shadow-[6px_6px_0px_#000] rounded-full flex items-center justify-center mb-8">
                <Store className="h-10 w-10 text-black stroke-[3]" />
              </div>
              <h3 className="text-3xl font-black text-black mb-3 uppercase">1. Pick Food</h3>
              <p className="text-black font-bold text-lg leading-relaxed border-t-4 border-brand-600 pt-4">Browse menus from thousands of local restaurants.</p>
            </div>
            <div className="bg-white p-8 border-4 border-black shadow-[12px_12px_0px_#000] flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-24 h-24 bg-[#FFD700] border-4 border-black shadow-[6px_6px_0px_#000] rounded-full flex items-center justify-center mb-8">
                <ShoppingBag className="h-10 w-10 text-black stroke-[3]" />
              </div>
              <h3 className="text-3xl font-black text-black mb-3 uppercase">2. Order Fast</h3>
              <p className="text-black font-bold text-lg leading-relaxed border-t-4 border-brand-600 pt-4">Select items, checkout safely, and track in real-time.</p>
            </div>
            <div className="bg-white p-8 border-4 border-black shadow-[12px_12px_0px_#000] flex flex-col items-center text-center transform hover:-translate-y-2 transition-transform">
              <div className="w-24 h-24 bg-[#FFD700] border-4 border-black shadow-[6px_6px_0px_#000] rounded-full flex items-center justify-center mb-8">
                <Bike className="h-10 w-10 text-black stroke-[3]" />
              </div>
              <h3 className="text-3xl font-black text-black mb-3 uppercase">3. Eat Up</h3>
              <p className="text-black font-bold text-lg leading-relaxed border-t-4 border-brand-600 pt-4">We deliver it burning hot right to your doorstep.</p>
            </div>
          </div>
        </div>
      </section>

      {/* PART 4: Popular Categories */}
      <section className="py-24 px-6 md:px-12 bg-[#f4f0ea] border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
            <div>
              <h2 className="text-6xl font-black text-black mb-2 uppercase tracking-tighter text-center md:text-left drop-shadow-[4px_4px_0px_rgba(0,0,0,0.1)]">Categories</h2>
              <p className="text-black font-bold text-xl uppercase border-b-4 border-black inline-block">Popular cuisines near you</p>
            </div>
            <button className="bg-black text-white border-4 border-black shadow-[8px_8px_0px_#FFD700] px-8 py-3 font-black text-xl uppercase hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#FFD700] transition-all flex items-center gap-2">
              See All <ArrowRight className="h-6 w-6 stroke-[3]" />
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
            {[
              { name: 'Burgers', color: 'bg-[#FFD700]', img: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80' },
              { name: 'Pizza', color: 'bg-brand-500', img: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=400&q=80' },
              { name: 'Sushi', color: 'bg-[#00E59B]', img: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=400&q=80' },
              { name: 'Vegan', color: 'bg-purple-400', img: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?auto=format&fit=crop&w=400&q=80' },
              { name: 'Mexican', color: 'bg-blue-400', img: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=400&q=80' },
              { name: 'Desserts', color: 'bg-orange-400', img: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?auto=format&fit=crop&w=400&q=80' }
            ].map((item, idx) => (
              <div key={idx} className={`${item.color} border-4 border-black shadow-[6px_6px_0px_#000] hover:translate-x-1 hover:translate-y-1 hover:shadow-none cursor-pointer transition-all p-4 text-center group flex flex-col items-center justify-center aspect-square overflow-hidden relative`}>
                <div className="w-20 h-20 bg-white border-4 border-black rounded-full mb-3 group-hover:scale-110 transition-transform shadow-[4px_4px_0px_#000] overflow-hidden">
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <h4 className="font-black text-black uppercase text-xl leading-none relative z-10 bg-white px-2 border-2 border-black -rotate-2">{item.name}</h4>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PART 5: Featured Restaurants */}
      <section className="py-24 px-6 md:px-12 bg-white border-b-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="mb-14 border-l-8 border-brand-600 pl-6 bg-[#FFD700] py-4 pr-6 w-max border-y-4 border-r-4 border-black shadow-[8px_8px_0px_#000] -rotate-1">
            <h2 className="text-5xl md:text-6xl font-black text-black mb-1 uppercase tracking-tighter">Top Rated</h2>
            <p className="text-black font-bold text-lg uppercase bg-white inline-block px-2 border-2 border-black">Highest rated joints nearby</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="bg-[#f4f0ea] border-4 border-black shadow-[12px_12px_0px_#000] flex flex-col hover:-translate-y-2 transition-transform cursor-pointer">
                <div className="h-48 bg-black border-b-4 border-black w-full flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-[#00E59B] opacity-20 mix-blend-color"></div>
                  <Store className="text-white h-20 w-20 stroke-[2] relative z-10" />
                  <div className="absolute top-4 right-4 bg-[#FFD700] border-4 border-black px-3 py-1 font-black text-black text-sm uppercase shadow-[4px_4px_0px_#000] rotate-3">
                    🔥 Hot
                  </div>
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <div className="flex justify-between items-start mb-4 gap-2">
                    <h3 className="font-black text-3xl text-black uppercase leading-none">Burger Joint</h3>
                    <div className="flex items-center gap-1 bg-[#00E59B] border-4 border-black px-2 py-1 font-black text-black text-sm shadow-[4px_4px_0px_#000]">
                      <Star className="h-4 w-4 fill-current stroke-[2]" /> 4.{8 - i}
                    </div>
                  </div>
                  <p className="text-black font-bold text-sm mb-6 uppercase tracking-wider">American • Burgers</p>
                  <div className="mt-auto flex justify-between items-center text-lg font-black uppercase border-t-4 border-black pt-4 bg-white -mx-6 -mb-6 p-6">
                    <span className="flex items-center gap-2 text-black"><Clock className="h-6 w-6 stroke-[3]" /> 20 MIN</span>
                    <span className="flex items-center gap-2 text-brand-600"><Bike className="h-6 w-6 stroke-[3] text-black" /> FREE</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PART 6: Call to Action blocks */}
      <section className="py-24 px-6 md:px-12 bg-[#FFD700] border-b-4 border-black">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12">
          <div className="bg-brand-600 border-4 border-black shadow-[12px_12px_0px_#000] p-8 md:p-12 flex flex-col items-start justify-center text-white relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <ShieldCheck className="w-64 h-64 text-black stroke-[3]" />
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] mb-8 -rotate-3 relative z-10">
              <ShieldCheck className="h-10 w-10 text-black stroke-[3]" />
            </div>
            <h2 className="text-5xl font-black text-white mb-4 uppercase tracking-tighter drop-shadow-[4px_4px_0px_rgba(0,0,0,1)] relative z-10">Partner Up</h2>
            <p className="font-bold text-xl mb-8 max-w-sm uppercase bg-black inline-block px-2 text-white relative z-10">Reach customers. Grow biz.</p>
            <button className="bg-white border-4 border-black text-black px-8 py-4 font-black uppercase shadow-[6px_6px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#000] transition-all text-xl relative z-10 w-full sm:w-auto text-center">
              Register Restaurant
            </button>
          </div>

          <div className="bg-[#00E59B] border-4 border-black shadow-[12px_12px_0px_#000] p-8 md:p-12 flex flex-col items-start justify-center relative overflow-hidden">
            <div className="absolute -right-10 -top-10 opacity-10">
              <Bike className="w-64 h-64 text-black stroke-[3]" />
            </div>
            <div className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] mb-8 rotate-3 relative z-10">
              <Bike className="h-10 w-10 text-black stroke-[3]" />
            </div>
            <h2 className="text-5xl font-black text-black mb-4 uppercase tracking-tighter drop-shadow-[4px_4px_0px_#fff] relative z-10">Ride Delivery</h2>
            <p className="text-black font-bold text-xl mb-8 max-w-sm uppercase bg-white inline-block px-2 relative z-10">Earn cash. Be the boss.</p>
            <button className="bg-black border-4 border-black text-white px-8 py-4 font-black uppercase shadow-[6px_6px_0px_#FFD700] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#FFD700] transition-all text-xl relative z-10 w-full sm:w-auto text-center">
              Apply to Drive
            </button>
          </div>
        </div>
      </section>

      {/* PART 7: Footer */}
      <footer className="bg-black text-white pt-24 pb-12 px-6 md:px-12 border-t-8 border-brand-600">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="flex flex-col items-start">
            <div className="flex items-center gap-2 mb-8 bg-[#FFD700] border-4 border-white px-4 py-2 rotate-2 shadow-[8px_8px_0px_#brand-600]">
              <Utensils className="h-8 w-8 text-black stroke-[3]" />
              <span className="text-3xl font-black uppercase tracking-tight text-black">FoodDash</span>
            </div>
            <p className="text-white font-bold text-sm leading-loose uppercase border-l-4 border-brand-600 pl-4 mt-4">
              The fastest delivery platform globally. Period.
            </p>
          </div>
          <div>
            <h4 className="font-black mb-8 text-2xl uppercase border-b-4 border-[#00E59B] pb-2 inline-block">Company</h4>
            <ul className="space-y-4 font-bold text-lg flex flex-col uppercase">
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-brand-600 w-max">About Us</a>
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-brand-600 w-max">Careers</a>
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-brand-600 w-max">Blog</a>
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-brand-600 w-max text-brand-500">Contact</a>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-2xl uppercase border-b-4 border-[#FFD700] pb-2 inline-block">Legal</h4>
            <ul className="space-y-4 font-bold text-lg flex flex-col uppercase">
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-[#00E59B] w-max">Terms</a>
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-[#00E59B] w-max">Privacy</a>
              <a href="#" className="hover:underline decoration-4 underline-offset-4 decoration-[#00E59B] w-max">Cookies</a>
            </ul>
          </div>
          <div>
            <h4 className="font-black mb-8 text-2xl uppercase border-b-4 border-white pb-2 inline-block">Subscribe</h4>
            <p className="font-bold text-sm mb-4 uppercase text-[#00E59B]">Get hot deals to your inbox.</p>
            <div className="flex border-4 border-white shadow-[8px_8px_0px_#e11d48]">
              <input type="email" placeholder="EMAIL ADDRESS..." className="bg-black outline-none py-4 px-4 text-white font-bold uppercase w-full placeholder-gray-600 focus:bg-[#333] transition-colors" />
              <button className="bg-brand-600 px-6 border-l-4 border-white text-white hover:bg-[#FFD700] hover:text-black transition-colors">
                <ArrowRight className="h-6 w-6 stroke-[3]" />
              </button>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto border-t-4 border-white pt-8 flex flex-col md:flex-row justify-between items-center font-black uppercase text-sm md:text-base gap-4">
          <span className="bg-brand-600 px-3 py-1 border-2 border-white text-white">&copy; {new Date().getFullYear()} FOODDASH INC.</span>
          <span className="bg-[#00E59B] px-3 py-1 border-2 border-white text-black drop-shadow-[2px_2px_0px_#fff]">STAY HUNGRY.</span>
        </div>
      </footer>
    </div>
  );
}

export default Home;
