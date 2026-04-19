import { useState, useEffect } from 'react';
import { Leaf, Plus, X } from 'lucide-react';
import { getMyRestaurantProfile, addMenuItem } from '../services/restaurantService';
import { motion } from 'framer-motion';

const CATEGORIES = ['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides'];

const OwnerMenu = () => {
    const [restaurant, setRestaurant] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);
    
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        price: '',
        category: 'Starters',
        isVeg: true,
        image: ''
    });

    const fetchMenu = async () => {
        try {
            const data = await getMyRestaurantProfile();
            setRestaurant(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchMenu();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addMenuItem({
                ...formData,
                price: Number(formData.price)
            });
            setIsAdding(false);
            setFormData({ name: '', description: '', price: '', category: 'Starters', isVeg: true, image: '' });
            fetchMenu(); // Refresh the list
        } catch (error) {
            console.error(error);
            alert("Failed to add item!");
        }
    };

    if (loading) return (
      <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
          <div className="w-12 h-12 border-8 border-black border-t-[#00E59B] rounded-full animate-spin" />
      </div>
    );

    return (
      <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
        <div className="max-w-6xl mx-auto flex justify-between items-center mb-10 border-b-8 border-black pb-4">
            <h1 className="font-display font-black text-4xl md:text-6xl uppercase leading-none">Menu Management</h1>
            <button 
                onClick={() => setIsAdding(!isAdding)}
                className={`flex items-center gap-2 border-4 border-black px-6 py-3 font-black uppercase text-xl shadow-[4px_4px_0px_#000] transition-transform hover:-translate-y-1 ${isAdding ? 'bg-red-500 text-white' : 'bg-[#FFD700]'}`}
            >
                {isAdding ? <><X className="stroke-[3]" /> Cancel</> : <><Plus className="stroke-[3]" /> Add Dish</>}
            </button>
        </div>

        <div className="max-w-6xl mx-auto">
            {isAdding && (
                <motion.form 
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    onSubmit={handleSubmit} 
                    className="bg-white border-4 border-black p-8 mb-12 shadow-[8px_8px_0px_#00E59B]"
                >
                    <h2 className="font-black uppercase text-2xl mb-6">Create New Dish</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="font-black uppercase text-sm bg-[#00E59B] border-2 border-black px-2 py-1 inline-block -rotate-1 mb-1">Dish Name*</label>
                            <input required type="text" value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} className="w-full bg-white border-4 border-black p-3 font-bold outline-none uppercase" placeholder="SPICY NOODLES..." />
                        </div>
                        <div>
                            <label className="font-black uppercase text-sm bg-[#FFD700] border-2 border-black px-2 py-1 inline-block rotate-1 mb-1">Price (₹)*</label>
                            <input required type="number" min="0" value={formData.price} onChange={(e) => setFormData({...formData, price: e.target.value})} className="w-full bg-white border-4 border-black p-3 font-bold outline-none uppercase" placeholder="250" />
                        </div>
                        <div className="md:col-span-2">
                            <label className="font-black uppercase text-sm bg-brand-200 border-2 border-black px-2 py-1 inline-block -rotate-1 mb-1">Description</label>
                            <input type="text" value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} className="w-full bg-white border-4 border-black p-3 font-bold outline-none uppercase" placeholder="YUMMY INGREDIENTS..." />
                        </div>
                        <div>
                            <label className="font-black uppercase text-sm bg-black text-white px-2 py-1 inline-block mb-1">Category*</label>
                            <select value={formData.category} onChange={(e) => setFormData({...formData, category: e.target.value})} className="w-full bg-white border-4 border-black p-3 font-bold outline-none uppercase appearance-none">
                                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="font-black uppercase text-sm bg-white border-2 border-black px-2 py-1 inline-block mb-1">Image URL</label>
                            <input type="url" value={formData.image} onChange={(e) => setFormData({...formData, image: e.target.value})} className="w-full bg-white border-4 border-black p-3 font-bold outline-none" placeholder="https://..." />
                        </div>
                    </div>
                    
                    <div className="flex justify-between items-center mt-8">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input type="checkbox" checked={formData.isVeg} onChange={(e) => setFormData({...formData, isVeg: e.target.checked})} className="hidden" />
                            <div className="w-8 h-8 border-4 border-black flex items-center justify-center">
                                {formData.isVeg && <div className="w-4 h-4 bg-green-500" />}
                            </div>
                            <span className="font-black uppercase text-lg">Pure Veg</span>
                        </label>
                        
                        <button type="submit" className="bg-black text-[#00E59B] hover:text-[#FFD700] px-8 py-3 font-black uppercase text-xl border-4 border-black shadow-[6px_6px_0px_#00E59B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all">
                            Save Dish
                        </button>
                    </div>
                </motion.form>
            )}

            {!restaurant?.menu || restaurant.menu.length === 0 ? (
                 <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_#000] text-center transform rotate-1">
                    <p className="font-bold text-2xl uppercase">Your menu is totally empty!</p>
                    <p className="font-medium text-gray-500 uppercase mt-2">Click "Add Dish" above to start selling.</p>
                 </div>
            ) : (
                <div className="space-y-12">
                    {CATEGORIES.map(cat => {
                        const items = restaurant.menu.filter((i: any) => i.category === cat);
                        if (items.length === 0) return null;
                        
                        return (
                            <div key={cat}>
                                <h3 className="bg-black text-white inline-block px-6 py-2 font-black uppercase text-2xl rotate-[-1deg] border-4 border-black shadow-[6px_6px_0px_#00E59B] mb-8">
                                    {cat}
                                </h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {items.map((item: any) => (
                                        <div key={item._id} className="bg-white border-4 border-black flex overflow-hidden shadow-[4px_4px_0px_#000]">
                                            <div className="w-32 h-32 border-r-4 border-black shrink-0 relative bg-gray-100">
                                                <img src={item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400'} className="w-full h-full object-cover" />
                                                {item.isVeg && <Leaf className="w-6 h-6 text-green-500 bg-white p-1 border-2 border-black absolute top-2 right-2" />}
                                            </div>
                                            <div className="p-4 flex-1 flex flex-col justify-between">
                                                <div>
                                                    <h4 className="font-black text-xl uppercase leading-none mb-1">{item.name}</h4>
                                                    <p className="text-sm font-bold text-gray-500 uppercase line-clamp-1">{item.description}</p>
                                                </div>
                                                <div className="font-black text-2xl">₹{item.price}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}
        </div>
      </div>
    );
  };
  
  export default OwnerMenu;
