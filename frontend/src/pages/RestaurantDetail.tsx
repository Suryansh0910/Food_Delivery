import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MapPin, Clock, Star, ArrowLeft, Plus, Minus, ShoppingCart, Leaf } from 'lucide-react';
import { getRestaurantById } from '../services/restaurantService';
import { createOrder } from '../services/orderService';

const RestaurantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState<any[]>([]);
  const [checkingOut, setCheckingOut] = useState(false);

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
        if (existing) {
            return prev.map(i => i._id === item._id ? { ...i, qty: i.qty + 1 } : i);
        }
        return [...prev, { ...item, qty: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => {
        const existing = prev.find(i => i._id === itemId);
        if (existing.qty === 1) return prev.filter(i => i._id !== itemId);
        return prev.map(i => i._id === itemId ? { ...i, qty: i.qty - 1 } : i);
    });
  };

  const total = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

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
      navigate('/customer/orders'); // Take them to their tracking dashboard
    } catch (err: any) {
      console.error(err);
      alert(err.message || 'Checkout failed!');
    } finally {
      setCheckingOut(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-[#f4f0ea] flex items-center justify-center">
        <div className="w-12 h-12 border-8 border-black border-t-[#00E59B] rounded-full animate-spin" />
    </div>
  );

  if (!restaurant) return (
     <div className="min-h-screen bg-[#f4f0ea] p-10 text-center uppercase font-black">
        Restaurant not found!
     </div>
  );

  return (
    <div className="min-h-screen bg-[#f4f0ea] font-sans pb-24">
      {/* Hero Header */}
      <div className="relative h-64 md:h-80 border-b-8 border-black overflow-hidden">
        <img src={restaurant.image} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-black/40 flex items-end p-6 md:p-12">
            <Link to="/customer/restaurants" className="absolute top-6 left-6 bg-white border-4 border-black p-2 shadow-[4px_4px_0px_#000] hover:translate-x-1 transition-all">
                <ArrowLeft className="w-6 h-6" />
            </Link>
            <div className="bg-white border-8 border-black p-6 shadow-[12px_12px_0px_#000] transform -rotate-1">
                <h1 className="font-display font-black text-4xl md:text-6xl uppercase leading-none">{restaurant.name}</h1>
                <div className="flex items-center gap-4 mt-2 font-black uppercase text-sm">
                    <span className="flex items-center gap-1 bg-[#FFD700] px-2 py-0.5 border-2 border-black"><Star className="w-4 h-4 fill-black" /> 4.5</span>
                    <span className="flex items-center gap-1"><Clock className="w-4 h-4" /> 20-30 MIN</span>
                    <span className="flex items-center gap-1"><MapPin className="w-4 h-4" /> {restaurant.address.area}</span>
                </div>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12 grid grid-cols-1 lg:grid-cols-3 gap-10">
        
        {/* Menu Section */}
        <div className="lg:col-span-2">
            <h2 className="font-display font-black text-4xl uppercase mb-8 border-b-4 border-black pb-4">Our Menu</h2>
            
            {!restaurant.menu || restaurant.menu.length === 0 ? (
                <div className="bg-white border-4 border-black p-10 text-center shadow-[8px_8px_0px_#000]">
                    <Leaf className="w-16 h-16 mx-auto mb-4 stroke-[2]" />
                    <p className="font-display font-black text-3xl uppercase mb-2">Menu Coming Soon</p>
                    <p className="font-medium text-gray-500 uppercase">The owner is still crafting their delicious offerings.</p>
                </div>
            ) : (
                <div className="space-y-8">
                    {['Starters', 'Mains', 'Desserts', 'Beverages', 'Sides'].map(cat => {
                        const items = restaurant.menu.filter((i: any) => i.category === cat);
                        if (items.length === 0) return null;

                        return (
                            <div key={cat}>
                                <h3 className="bg-[#00E59B] border-4 border-black px-4 py-1 font-black uppercase text-xl inline-block mb-6 shadow-[4px_4px_0px_#000]">{cat}</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {items.map((item: any) => (
                                        <div key={item._id} className="bg-white border-4 border-black p-4 shadow-[6px_6px_0px_#000] flex justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-1 mb-1">
                                                    {item.isVeg && <Leaf className="w-4 h-4 text-green-600" />}
                                                    <h4 className="font-black uppercase text-lg leading-tight">{item.name}</h4>
                                                </div>
                                                <p className="text-xs font-bold text-gray-500 uppercase line-clamp-2 mb-3">{item.description}</p>
                                                <p className="font-black text-xl">₹{item.price}</p>
                                            </div>
                                            <div className="w-24 h-24 bg-gray-100 border-4 border-black shrink-0 relative">
                                                <img src={item.image || 'https://via.placeholder.com/150'} className="w-full h-full object-cover" />
                                                <button 
                                                    onClick={() => addToCart(item)}
                                                    className="absolute -bottom-2 -left-2 bg-white border-2 border-black p-1 hover:bg-[#FFD700] transition-colors shadow-[2px_2px_0px_#000]"
                                                >
                                                    <Plus className="w-5 h-5 stroke-[3]" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>

        {/* Cart Sidebar */}
        <div className="lg:block">
            <div className="bg-white border-8 border-black p-6 shadow-[12px_12px_0px_#00E59B] sticky top-32">
                <h2 className="font-display font-black text-3xl uppercase mb-6 flex items-center gap-2 border-b-4 border-black pb-4">
                    <ShoppingCart className="w-8 h-8" /> Your Order
                </h2>
                
                {cart.length === 0 ? (
                    <p className="font-bold uppercase text-gray-400 text-center py-10">Cart is empty! Feed your soul.</p>
                ) : (
                    <>
                        <div className="space-y-4 mb-6 max-h-96 overflow-y-auto">
                            {cart.map(item => (
                                <div key={item._id} className="flex justify-between items-center border-b-2 border-gray-100 pb-4">
                                    <div>
                                        <p className="font-black uppercase">{item.name}</p>
                                        <p className="font-bold text-gray-500">₹{item.price * item.qty}</p>
                                    </div>
                                    <div className="flex items-center gap-2 bg-[#f4f0ea] border-2 border-black px-2 py-1">
                                        <button onClick={() => removeFromCart(item._id)} className="hover:text-red-600 transition-colors"><Minus className="w-4 h-4 stroke-[3]" /></button>
                                        <span className="font-black text-lg w-6 text-center">{item.qty}</span>
                                        <button onClick={() => addToCart(item)} className="hover:text-green-600 transition-colors"><Plus className="w-4 h-4 stroke-[3]" /></button>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="border-t-4 border-black pt-4 mb-6">
                            <div className="flex justify-between font-black text-2xl uppercase">
                                <span>Total</span>
                                <span>₹{total}</span>
                            </div>
                        </div>
                        <button 
                            onClick={handleCheckout}
                            disabled={checkingOut}
                            className="w-full bg-black text-white hover:text-[#00E59B] border-4 border-black py-4 font-black uppercase text-xl shadow-[6px_6px_0px_#00E59B] hover:translate-x-1 hover:translate-y-1 hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed">
                            {checkingOut ? 'Sending Order...' : 'Checkout Now'}
                        </button>
                    </>
                )}
            </div>
        </div>

      </div>
    </div>
  );
};

export default RestaurantDetail;
