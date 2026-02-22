export default function Home() {
  return (
    <div className="p-6">
      {/* Header Section */}
      <header className="mb-8 mt-4">
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Good Morning! ☀️</h1>
        <p className="text-gray-500 mt-2 text-lg">What are we packing for the kids today?</p>
      </header>

      {/* Quick Action - Thumbnail Zone Example */}
      <section className="bg-orange-50 rounded-3xl p-6 mb-8 border border-orange-100 shadow-sm relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 bg-orange-200 rounded-full opacity-50 blur-2xl"></div>
        <h2 className="text-xl font-bold text-orange-900 mb-2">Need a quick hack?</h2>
        <p className="text-orange-700 mb-4 text-sm">Scan your fridge and we'll find a 1:3 high-protein recipe instantly.</p>
        <button className="w-full bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white font-bold py-4 rounded-xl shadow-md transition-all active:scale-95 text-lg">
          Scan Ingredients
        </button>
      </section>

      {/* Categories */}
      <section>
        <div className="flex justify-between items-end mb-4">
          <h2 className="text-2xl font-bold text-gray-800">Meal Types</h2>
          <span className="text-green-600 font-medium text-sm">View all</span>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform flex flex-col items-center justify-center aspect-square">
            <span className="text-4xl mb-2">🥪</span>
            <span className="font-bold text-gray-700">Lunch Box</span>
            <span className="text-xs text-green-600 mt-1 font-medium bg-green-50 px-2 py-1 rounded-full">Soggy Proof</span>
          </div>

          <div className="bg-white border-2 border-gray-100 rounded-2xl p-4 shadow-sm active:scale-95 transition-transform flex flex-col items-center justify-center aspect-square">
            <span className="text-4xl mb-2">🥞</span>
            <span className="font-bold text-gray-700">Breakfast</span>
            <span className="text-xs text-orange-600 mt-1 font-medium bg-orange-50 px-2 py-1 rounded-full">&lt; 15 mins</span>
          </div>
        </div>
      </section>
    </div>
  );
}
