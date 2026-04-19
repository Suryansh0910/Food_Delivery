import { useState, useEffect } from 'react';
import { Store, Search } from 'lucide-react';
import API_BASE_URL from '../config';

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRestaurants();
  }, []);

  const fetchRestaurants = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/restaurants`);
      if (res.ok) {
        setRestaurants(await res.json());
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10 border-b-8 border-black pb-6">
          <div className="flex items-center gap-4">
            <div className="bg-[#FFD700] border-4 border-black p-3 shadow-[4px_4px_0px_#000]">
              <Store className="w-9 h-9" />
            </div>
            <div>
              <h1 className="font-display font-black text-5xl uppercase leading-none">All Restaurants</h1>
              <p className="font-medium text-gray-500 text-sm mt-1">Manage all registered businesses</p>
            </div>
          </div>
          <div className="flex bg-white border-4 border-black shadow-[4px_4px_0px_#000]">
            <div className="p-3 border-r-4 border-black bg-brand-100"><Search className="w-5 h-5" /></div>
            <input type="text" placeholder="SEARCH..." className="px-4 py-2 outline-none font-bold uppercase w-64" />
          </div>
        </div>

        {loading ? (
          <p className="font-display font-black text-3xl uppercase animate-pulse text-center p-20">Loading Database...</p>
        ) : (
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_#000] overflow-hidden">
             <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-black text-white font-black uppercase text-sm">
                        <th className="p-4 border-b-4 border-black">Restaurant</th>
                        <th className="p-4 border-b-4 border-black">Status</th>
                        <th className="p-4 border-b-4 border-black hidden md:table-cell">Location</th>
                        <th className="p-4 border-b-4 border-black text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y-4 divide-black font-bold uppercase text-sm">
                    {restaurants.map(r => (
                        <tr key={r._id} className="hover:bg-[#f4f0ea] transition-colors">
                            <td className="p-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-gray-200 border-2 border-black flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {r.image ? <img src={r.image} className="w-full h-full object-cover" /> : <Store className="w-5 h-5 opacity-50" />}
                                    </div>
                                    <span>{r.name}</span>
                                </div>
                            </td>
                            <td className="p-4">
                                {r.isApproved ? (
                                    <span className="bg-[#00E59B] border-2 border-black px-2 py-1 flex items-center w-max gap-2 text-xs"><div className="w-2 h-2 bg-black rounded-full" /> Approved</span>
                                ) : (
                                    <span className="bg-[#FFD700] border-2 border-black px-2 py-1 flex items-center w-max gap-2 text-xs"><div className="w-2 h-2 bg-black rounded-full animate-pulse" /> Pending</span>
                                )}
                            </td>
                            <td className="p-4 hidden md:table-cell">
                                {r.address?.city}, {r.address?.area}
                            </td>
                            <td className="p-4 text-right">
                                <button className="bg-black text-white px-4 py-1.5 border-2 border-black hover:bg-brand-600 transition-colors">View</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
             </table>
             {restaurants.length === 0 && (
                <div className="p-10 text-center font-bold uppercase">No restaurants found.</div>
             )}
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminRestaurants;
