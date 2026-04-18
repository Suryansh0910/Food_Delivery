import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Utensils, ArrowRight, Store, User, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { login, register } from '../services/authService';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'customer' | 'owner'>('customer');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    restaurantName: '',
    street: '',
    city: '',
    pincode: '',
    openingTime: '',
    closingTime: '',
    restaurantDescription: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Handle Step 1 to Step 2 for owners
    if (!isLogin && role === 'owner' && step === 1) {
      if (!formData.name || !formData.email || !formData.password) {
        setError('Please fill out all credentials before proceeding.');
        return;
      }
      setStep(2);
      return;
    }

    setLoading(true);

    try {
      let data;
      if (isLogin) {
        data = await login({ email: formData.email, password: formData.password });
      } else {
        data = await register({ ...formData, role });
      }

      if (data.token) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
        navigate('/');
      } else {
        setError(data.message || 'Something went wrong');
      }
    } catch (err) {
      setError('Connection failed. Is the backend running?');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] flex flex-col md:flex-row overflow-hidden font-sans">

      {/* Left side: Branding / Brutalist Art */}
      <div className="w-full md:w-1/2 bg-[#00E59B] border-r-0 md:border-r-4 border-b-4 md:border-b-0 border-black p-10 flex flex-col justify-center relative min-h-[40vh] md:min-h-screen">
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'radial-gradient(#000 2px, transparent 2px)', backgroundSize: '30px 30px' }}></div>

        {/* Logo */}
        <div className="absolute top-10 left-10 z-20">
          <Link to="/" className="inline-flex items-center gap-2 bg-[#FFD700] border-4 border-black px-4 py-2 shadow-[4px_4px_0px_#000] -rotate-1 hover:rotate-0 transition-transform w-max">
            <Utensils className="h-6 w-6 text-black stroke-[3]" />
            <span className="text-2xl font-black uppercase text-black tracking-tight">FoodDash</span>
          </Link>
        </div>

        {/* Typography */}
        <div className="relative z-10 flex-1 flex flex-col justify-center items-start w-full">
          <motion.h1
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            className="text-7xl lg:text-[8rem] font-black leading-none uppercase text-black tracking-tighter"
          >
            {isLogin ? 'Welcome' : 'Join The'}<br />
            <span className="text-white drop-shadow-[5px_5px_0px_#000]" style={{ WebkitTextStroke: '2px black' }}>
              {isLogin ? 'Back.' : 'Cult.'}
            </span>
          </motion.h1>
          <div className="mt-8 inline-block bg-[#FFD700] border-4 border-black font-black uppercase tracking-widest px-6 py-2 shadow-[6px_6px_0px_#000] -rotate-2">
            Warning: Highly Addictive ⚠️
          </div>
        </div>

        {/* Floating watermark - Shifted 20px right from center */}
        <div className="absolute top-1/2 left-1/2 -translate-y-1/2 translate-x-[20px] opacity-10 pointer-events-none z-0">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
          >
            <Utensils className="w-[350px] h-[350px] md:w-[500px] md:h-[500px] text-black stroke-[1]" />
          </motion.div>
        </div>
      </div>

      {/* Right side: Auth Form */}
      <div className="w-full md:w-1/2 bg-[#FFD700] p-6 md:p-16 flex items-center justify-center relative overflow-hidden">
        {/* Top Warning Strip */}
        <div className="absolute top-0 left-0 w-full h-8 z-10 border-b-4 border-black" style={{ backgroundImage: 'repeating-linear-gradient(45deg, #000, #000 20px, transparent 20px, transparent 40px)' }}></div>

        {/* Bottom Warning Strip */}
        <div className="absolute bottom-0 left-0 w-full h-8 z-10 border-t-4 border-black" style={{ backgroundImage: 'repeating-linear-gradient(-45deg, #000, #000 20px, transparent 20px, transparent 40px)' }}></div>

        {/* Back To Home Button */}
        <div className="absolute top-16 right-8 md:right-12 z-40">
          <Link to="/" className="flex items-center gap-2 bg-white border-4 border-black px-4 py-2 font-black uppercase shadow-[6px_6px_0px_#000] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_#000] transition-all">
            <ArrowLeft className="h-5 w-5 stroke-[3]" /> Back
          </Link>
        </div>
        {/* Animated Warning Strip 1 */}
        <div className="absolute top-32 -left-10 w-[150%] bg-black text-[#FFD700] border-y-4 border-black py-3 translate-y-12 rotate-[-10deg] z-0 flex whitespace-nowrap overflow-hidden shadow-[8px_8px_0px_#00E59B]">
          <motion.div
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 font-black uppercase text-2xl tracking-widest"
          >
            <span>⚠️ WARNING RESTRICTED AREA</span><span>•</span>
            <span>⚠️ WARNING RESTRICTED AREA</span><span>•</span>
            <span>⚠️ WARNING RESTRICTED AREA</span><span>•</span>
            <span>⚠️ WARNING RESTRICTED AREA</span><span>•</span>
            <span>⚠️ WARNING RESTRICTED AREA</span><span>•</span>
            <span>⚠️ WARNING RESTRICTED AREA</span>
          </motion.div>
        </div>

        {/* Animated MVP Strip 2 */}
        <div className="absolute bottom-32 -left-10 w-[150%] bg-[#00E59B] text-black border-y-4 border-black py-3 -translate-y-12 rotate-[8deg] z-0 flex whitespace-nowrap overflow-hidden shadow-[8px_8px_0px_#000]">
          <motion.div
            animate={{ x: ["-50%", "0%"] }}
            transition={{ duration: 12, repeat: Infinity, ease: 'linear' }}
            className="flex gap-8 font-black uppercase text-2xl tracking-widest"
          >
            <span>MINIMUM VIABLE PRODUCT V1.0</span><span>•</span>
            <span>MINIMUM VIABLE PRODUCT V1.0</span><span>•</span>
            <span>MINIMUM VIABLE PRODUCT V1.0</span><span>•</span>
            <span>MINIMUM VIABLE PRODUCT V1.0</span><span>•</span>
            <span>MINIMUM VIABLE PRODUCT V1.0</span><span>•</span>
            <span>MINIMUM VIABLE PRODUCT V1.0</span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border-4 border-black shadow-[12px_12px_0px_#000] p-8 md:p-12 w-full max-w-lg relative z-10"
        >
          <div className="flex justify-between items-center border-b-4 border-black pb-6 mb-8 gap-4">
            <button
              onClick={() => { setIsLogin(true); setStep(1); }}
              className={`flex-1 text-2xl font-black uppercase pb-2 ${isLogin ? 'border-b-8 border-brand-600 translate-y-[4px]' : 'text-gray-400 opacity-50 hover:opacity-100'} transition-all`}
            >
              Log In
            </button>
            <button
              onClick={() => { setIsLogin(false); setStep(1); }}
              className={`flex-1 text-2xl font-black uppercase pb-2 ${!isLogin ? 'border-b-8 border-[#00E59B] translate-y-[4px]' : 'text-gray-400 opacity-50 hover:opacity-100'} transition-all`}
            >
              Sign Up
            </button>
          </div>

          {step === 2 && !isLogin && role === 'owner' && (
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="mb-4 flex items-center gap-1 font-black uppercase text-sm border-2 border-black px-2 py-1 hover:bg-[#FFD700] hover:translate-x-1 transition-all w-max"
            >
              &larr; Back to Credentials
            </button>
          )}

          {error && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-brand-600 text-white border-4 border-black p-3 mb-6 font-bold uppercase text-center shadow-[4px_4px_0px_#000]"
            >
              ⚠️ {error}
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">

            {/* STEP 1: Basic Information */}
            {step === 1 && (
              <>
                {!isLogin && (
                  <div className="flex flex-col gap-2">
                    <label className="font-black uppercase text-sm bg-black text-white px-2 py-1 w-max">Choose Your Role</label>
                    <div className="flex gap-4">
                      <button
                        type="button"
                        onClick={() => setRole('customer')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border-4 border-black font-black uppercase transition-all ${role === 'customer' ? 'bg-[#00E59B] translate-y-[4px] shadow-none' : 'bg-white shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'}`}
                      >
                        <User className="h-8 w-8 stroke-[3]" />
                        I'm Hungry
                      </button>
                      <button
                        type="button"
                        onClick={() => setRole('owner')}
                        className={`flex-1 flex flex-col items-center gap-2 p-4 border-4 border-black font-black uppercase transition-all ${role === 'owner' ? 'bg-brand-600 text-white translate-y-[4px] shadow-none' : 'bg-white shadow-[4px_4px_0px_#000] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#000]'}`}
                      >
                        <Store className="h-8 w-8 stroke-[3]" />
                        I Cater Food
                      </button>
                    </div>
                  </div>
                )}

                {!isLogin && (
                  <div>
                    <label className="font-black uppercase text-lg inline-block bg-[#00E59B] border-2 border-black px-2 mb-2 rotate-1">{role === 'owner' ? 'Owner Name' : 'Full Name'}</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      placeholder={role === 'owner' ? "Gordon Ramsay..." : "JANE DOE..."}
                      className="w-full bg-white border-4 border-black p-4 font-bold text-xl outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300"
                      required={!isLogin}
                    />
                  </div>
                )}

                <div>
                  <label className="font-black uppercase text-lg inline-block bg-[#FFD700] border-2 border-black px-2 mb-2 -rotate-1">Email Address</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="EMAIL@EXAMPLE.COM..."
                    className="w-full bg-white border-4 border-black p-4 font-bold text-xl outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300"
                    required
                  />
                </div>

                <div>
                  <label className="font-black uppercase text-lg inline-block bg-brand-500 text-white border-2 border-black px-2 mb-2 rotate-1">Password</label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-white border-4 border-black p-4 font-bold text-xl outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] placeholder-gray-300"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-black hover:scale-110 transition-transform focus:outline-none"
                    >
                      {showPassword ? <EyeOff className="h-6 w-6 stroke-[3]" /> : <Eye className="h-6 w-6 stroke-[3]" />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* STEP 2: Restaurant Specific Information */}
            {step === 2 && !isLogin && role === 'owner' && (
              <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} className="flex flex-col gap-4">
                <div>
                  <label className="font-black uppercase text-sm bg-[#00E59B] border-2 border-black px-2 py-1 inline-block -rotate-1 mb-1">Restaurant Name*</label>
                  <input type="text" name="restaurantName" value={formData.restaurantName} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300" placeholder="HARDCORE BURGER CO..." required />
                </div>
                <div>
                  <label className="font-black uppercase text-sm bg-brand-200 border-2 border-black px-2 py-1 inline-block rotate-1 mb-1">Street Address*</label>
                  <input type="text" name="street" value={formData.street} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300" placeholder="123 MAIN ST..." required />
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-black uppercase text-sm bg-brand-200 border-2 border-black px-2 py-1 inline-block -rotate-1 mb-1">City*</label>
                    <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300" placeholder="NEW YORK..." required />
                  </div>
                  <div className="flex-1">
                    <label className="font-black uppercase text-sm bg-brand-200 border-2 border-black px-2 py-1 inline-block rotate-1 mb-1">Pincode*</label>
                    <input type="text" name="pincode" value={formData.pincode} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300" placeholder="10001..." required />
                  </div>
                </div>
                <div className="flex gap-4">
                  <div className="flex-1">
                    <label className="font-black uppercase text-sm bg-[#FFD700] border-2 border-black px-2 py-1 inline-block -rotate-1 mb-1">Opens at*</label>
                    <input type="time" name="openingTime" value={formData.openingTime} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase text-center" required />
                  </div>
                  <div className="flex-1">
                    <label className="font-black uppercase text-sm bg-black text-white border-2 border-black px-2 py-1 inline-block rotate-1 mb-1">Closes at*</label>
                    <input type="time" name="closingTime" value={formData.closingTime} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase text-center" required />
                  </div>
                </div>
                <div>
                  <label className="font-black uppercase text-sm bg-black text-white px-2 py-1 inline-block rotate-1 mb-1">Short Description</label>
                  <input type="text" name="restaurantDescription" value={formData.restaurantDescription} onChange={handleChange} className="w-full bg-white border-4 border-black p-3 font-bold text-lg outline-none focus:translate-x-[2px] focus:translate-y-[2px] transition-transform shadow-[4px_4px_0px_#000] uppercase placeholder-gray-300" placeholder="BEST FOOD IN TOWN..." />
                </div>
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className={`mt-4 bg-black text-white hover:text-[#FFD700] border-4 border-black p-4 font-black uppercase text-2xl flex justify-center items-center gap-2 shadow-[6px_6px_0px_#00E59B] hover:translate-y-[2px] hover:translate-x-[2px] hover:shadow-[4px_4px_0px_#00E59B] transition-all ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                'Processing...'
              ) : isLogin ? (
                <>Log In <ArrowRight className="h-6 w-6 stroke-[3]" /></>
              ) : step === 1 && role === 'owner' ? (
                <>Next Step <ArrowRight className="h-6 w-6 stroke-[3]" /></>
              ) : (
                <>Create Account <ArrowRight className="h-6 w-6 stroke-[3]" /></>
              )}
            </button>

          </form>
        </motion.div>
      </div>

    </div>
  );
};

export default Auth;

