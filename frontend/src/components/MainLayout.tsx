import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, Outlet } from 'react-router-dom';
import { Search, ShoppingBag, Utensils, User, Settings, LogOut, ChevronDown } from 'lucide-react';
import { motion } from 'framer-motion';

export function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<any>(null);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        setUser(JSON.parse(userStr));
      } catch (e) {
        localStorage.removeItem('user');
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location]);

  // Close dropdown when route changes
  useEffect(() => {
    setShowDropdown(false);
  }, [location]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setShowDropdown(false);
    navigate('/auth');
  };

  return (
    <nav className="fixed top-0 w-full bg-white z-50 border-b-4 border-black flex items-center justify-between py-4 px-6 md:px-12 transition-all">
      <Link to="/" className="flex items-center gap-2 bg-[#FFD700] border-4 border-black px-4 py-1 shadow-[4px_4px_0px_#000] -rotate-1 hover:rotate-0 transition-transform cursor-pointer">
        <Utensils className="h-6 w-6 text-black stroke-[3]" />
        <span className="text-2xl font-black uppercase text-black tracking-tight">FoodDash</span>
      </Link>
      <div className="hidden md:flex items-center gap-8">
        <Link to="/" className="text-black font-black uppercase text-lg hover:underline decoration-4 underline-offset-4 decoration-brand-600 border-b-0">Home</Link>
        <Link to="/explore" className="text-black font-black uppercase text-lg hover:underline decoration-4 underline-offset-4 decoration-brand-600 border-b-0">Restaurants</Link>
        <button className="text-black font-black uppercase text-lg hover:underline decoration-4 underline-offset-4 decoration-brand-600 border-b-0">Offers</button>
      </div>
      <div className="flex items-center gap-4">
        <button className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all">
          <Search className="h-5 w-5 text-black stroke-[3]" />
        </button>
        <button className="bg-[#00E59B] border-4 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] transition-all relative">
          <ShoppingBag className="h-5 w-5 text-black stroke-[3]" />
          <span className="absolute -top-3 -right-3 bg-brand-600 border-2 border-black text-white text-xs font-black h-6 w-6 flex items-center justify-center rounded-none shadow-[2px_2px_0px_#000]">0</span>
        </button>
        {user ? (
          <div className="relative hidden sm:block">
            {/* Profile Button */}
            <button
              id="profile-btn"
              onClick={() => setShowDropdown(!showDropdown)}
              className="flex items-center gap-2 bg-black border-4 border-black text-white px-5 py-2 font-black shadow-[4px_4px_0px_#FFD700] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#FFD700] transition-all uppercase"
            >
              <User className="h-5 w-5 stroke-[3] text-[#FFD700]" />
              HI, {user.name ? user.name.split(' ')[0] : 'USER'}
              <ChevronDown className={`h-4 w-4 stroke-[3] text-[#FFD700] transition-transform duration-200 ${showDropdown ? 'rotate-180' : ''}`} />
            </button>

            {/* Backdrop to close on outside click */}
            {showDropdown && (
              <div
                className="fixed inset-0 z-40"
                onClick={() => setShowDropdown(false)}
              />
            )}

            {/* Dropdown Menu */}
            {showDropdown && (
              <motion.div
                initial={{ opacity: 0, y: -8, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.15 }}
                className="absolute right-0 top-[calc(100%+8px)] z-50 bg-white border-4 border-black shadow-[8px_8px_0px_#000] w-56 overflow-hidden"
              >
                {/* User info header */}
                <div className="bg-[#FFD700] border-b-4 border-black px-4 py-3 cursor-pointer" onClick={() => navigate(`/${user.role}/dashboard`)}>
                  <p className="font-black uppercase text-black text-sm truncate">{user.name || 'User'}</p>
                  <p className="font-bold text-black text-xs truncate opacity-70">{user.email || ''}</p>
                  <span className="inline-block mt-1 bg-black text-[#FFD700] font-black text-xs uppercase px-2 py-0.5">{user.role || 'customer'}</span>
                  <div className="mt-2 text-xs font-black underline">Go to Dashboard &rarr;</div>
                </div>

                {/* Account Settings */}
                <button
                  onClick={() => { setShowDropdown(false); }}
                  className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm text-black hover:bg-[#f4f0ea] border-b-4 border-black transition-colors"
                >
                  <Settings className="h-5 w-5 stroke-[2.5] text-black" />
                  Account Settings
                </button>

                {/* Logout */}
                <button
                  id="logout-btn"
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-3 font-black uppercase text-sm text-white bg-brand-600 hover:bg-black transition-colors"
                >
                  <LogOut className="h-5 w-5 stroke-[2.5]" />
                  Log Out
                </button>
              </motion.div>
            )}
          </div>
        ) : (
          <Link to="/auth" className="flex items-center gap-2 bg-brand-600 border-4 border-black text-white px-6 py-2 font-black shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] active:shadow-none active:translate-x-[4px] active:translate-y-[4px] uppercase transition-all hidden sm:flex">
            <User className="h-5 w-5 stroke-[3]" />
            Sign In
          </Link>
        )}
      </div>
    </nav>
  );
}

export function MainLayout() {
  return (
    <>
      <Navbar />
      <Outlet />
    </>
  );
}
