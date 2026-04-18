import { useState, useEffect } from 'react';
import { Outlet, Link, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, Utensils, User as UserIcon, Store, LogOut, CheckSquare, Search } from 'lucide-react';

export const MainLayout = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const [user, setUser] = useState<any>(null);

  // Sync user state on mount and route change
  useEffect(() => {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      try {
        setUser(JSON.parse(rawUser));
      } catch (e) {
        setUser(null);
      }
    } else {
      setUser(null);
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    navigate('/');
  };

  const navLinksList = () => {
    if (!user) {
      return [
        { title: 'For Restaurants', href: '/auth', icon: <Store className="w-5 h-5 stroke-[3]" /> }
      ];
    }
    
    if (user.role === 'admin') {
      return [
        { title: 'Approvals Queue', href: '/admin/dashboard', icon: <CheckSquare className="w-5 h-5 stroke-[3]" /> }
      ];
    }

    if (user.role === 'owner') {
      return [
        { title: 'Kitchen Dashboard', href: '/owner/dashboard', icon: <Store className="w-5 h-5 stroke-[3]" /> },
      ];
    }

    // Customer
    return [
      { title: 'Search Food', href: '/customer/dashboard', icon: <Search className="w-5 h-5 stroke-[3]" /> },
    ];
  };

  const navLinks = navLinksList();

  const handleCTA = () => {
    if (!user) navigate('/auth');
    else navigate(`/${user.role}/dashboard`);
  };

  return (
    <div className="flex flex-col min-h-screen relative font-sans text-navy-900 bg-[#f4f0ea]">
      {/* Navigation Layer */}
      <nav className="border-b-8 border-black bg-brand-500 fixed w-full z-50 top-0 h-24 flex items-center">
        <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group relative cursor-pointer outline-none block">
              <div className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_#000] group-hover:translate-x-[2px] group-hover:translate-y-[2px] group-hover:shadow-[2px_2px_0px_#000] transition-all">
                <Utensils className="h-8 w-8 stroke-[3] text-black" />
              </div>
              <span className="font-black text-4xl tracking-tighter uppercase text-white mix-blend-difference drop-shadow-[2px_2px_0px_#000]">
                FoodDash
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.href}
                  className="font-black uppercase text-lg text-white hover:text-brand-200 transition-colors tracking-wide outline-none focus:underline decoration-4 flex items-center gap-2"
                >
                  {link.icon} {link.title}
                </Link>
              ))}
              
              {!user ? (
                <button 
                  onClick={handleCTA}
                  className="bg-black text-white px-8 py-3 font-black uppercase text-xl shadow-[6px_6px_0px_#FFD700] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[4px_4px_0px_#FFD700] transition-all flex items-center gap-2 outline-none group"
                >
                  SIGN UP / LOGIN
                </button>
              ) : (
                <div className="flex items-center gap-4">
                  <button 
                    onClick={handleCTA}
                    className="bg-[#FFD700] text-black px-6 py-3 border-4 border-black font-black uppercase text-lg shadow-[4px_4px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000] transition-all outline-none"
                  >
                    Dashboard -&gt;
                  </button>
                  <div className="bg-white border-4 border-black px-4 py-2 font-black uppercase flex items-center gap-2 shadow-[4px_4px_0px_#00E59B]">
                    <UserIcon className="w-5 h-5 stroke-[3]" />
                    HI, {user.name?.split(' ')[0]}
                  </div>
                  <button 
                    onClick={handleLogout}
                    className="bg-red-500 text-white border-4 border-black p-3 hover:bg-black transition-colors shadow-[4px_4px_0px_#000] active:translate-y-1 active:translate-x-1 active:shadow-none"
                    title="Logout"
                  >
                    <LogOut className="w-5 h-5 stroke-[3]" />
                  </button>
                </div>
              )}
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsOpen(!isOpen)}
                className="bg-white border-4 border-black p-2 shadow-[4px_4px_0px_#000] active:translate-x-[2px] active:translate-y-[2px] active:shadow-[2px_2px_0px_#000] outline-none"
              >
                {isOpen ? <X className="h-6 w-6 stroke-[3]" /> : <Menu className="h-6 w-6 stroke-[3]" />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Navigation Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -20, height: 0 }}
            className="md:hidden fixed z-40 top-24 w-full border-b-8 border-black bg-white overflow-hidden"
          >
            <div className="px-4 pt-4 pb-6 space-y-4 flex flex-col items-center">
              {user && (
                <div className="w-full bg-[#00E59B] text-black border-4 border-black px-4 py-3 font-black uppercase text-center flex items-center justify-center gap-2 shadow-[4px_4px_0px_#000]">
                  <UserIcon className="w-5 h-5 stroke-[3]" />
                  HI, {user.name} ({user.role})
                </div>
              )}
              {navLinks.map((link) => (
                <Link
                  key={link.title}
                  to={link.href}
                  className="block w-full text-center font-black uppercase text-xl hover:bg-brand-200 border-4 border-transparent hover:border-black p-2 transition-all"
                  onClick={() => setIsOpen(false)}
                >
                  <div className="flex items-center justify-center gap-2">{link.icon} {link.title}</div>
                </Link>
              ))}
              {!user ? (
                <button 
                  onClick={() => { setIsOpen(false); handleCTA(); }}
                  className="w-full bg-black text-[#FFD700] px-8 py-4 font-black uppercase text-xl shadow-[4px_4px_0px_#00E59B] border-4 border-black"
                >
                  SIGN UP NOW
                </button>
              ) : (
                <div className="flex flex-col gap-4 w-full">
                  <button 
                    onClick={() => { setIsOpen(false); handleCTA(); }}
                    className="w-full bg-[#FFD700] text-black px-8 py-4 font-black uppercase text-xl shadow-[4px_4px_0px_#000] border-4 border-black"
                  >
                    DASHBOARD
                  </button>
                  <button 
                    onClick={() => { setIsOpen(false); handleLogout(); }}
                    className="w-full bg-red-500 text-white px-8 py-4 font-black uppercase text-xl shadow-[4px_4px_0px_#000] border-4 border-black"
                  >
                    LOGOUT
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content Area */}
      <main className="flex-grow pt-24 min-h-[calc(100vh-theme('spacing.24'))] overflow-x-hidden">
        <Outlet />
      </main>
    </div>
  );
};
