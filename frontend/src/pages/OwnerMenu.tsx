const OwnerMenu = () => {
    return (
      <div className="min-h-screen bg-[#f4f0ea] p-6 md:p-10 font-sans flex flex-col items-center justify-center text-center">
        <div className="bg-white border-8 border-black p-12 shadow-[16px_16px_0px_#00E59B] max-w-2xl transform">
          <h1 className="font-display font-black text-6xl uppercase leading-none mb-6">Menu Management</h1>
          <p className="font-bold text-xl uppercase mb-8">Add, edit, or remove items from your restaurant's menu.</p>
          <button className="bg-[#FFD700] text-black px-8 py-4 font-black uppercase text-2xl border-4 border-black shadow-[8px_8px_0px_#000] hover:translate-x-2 hover:translate-y-2 hover:shadow-none transition-all">
            + Add New Item
          </button>
        </div>
      </div>
    );
  };
  
  export default OwnerMenu;
