const CustomerDeals = () => {
  return (
    <div className="min-h-screen bg-[#00E59B] p-6 md:p-10 font-sans flex flex-col items-center justify-center text-center">
      <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_#FFD700] max-w-2xl transform -rotate-2">
        <h1 className="font-display font-black text-6xl uppercase leading-none mb-6">Hot Deals</h1>
        <p className="font-bold text-xl uppercase mb-8">This section is currently cooking. Check back later for spicy offers and massive discounts!</p>
        <button className="bg-brand-600 text-white px-8 py-4 font-black uppercase text-2xl border-4 border-black shadow-[8px_8px_0px_#000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
          Stay Hungry
        </button>
      </div>
    </div>
  );
};

export default CustomerDeals;
