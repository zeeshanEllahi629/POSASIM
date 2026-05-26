import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import AddToCartButton from "@/components/front/AddToCartButton";
import FallbackImage from "@/components/front/FallbackImage";

export default async function Home() {
  // Fetch active categories
  const categories = await prisma.categories.findMany({
    where: { is_available: 1, is_deleted: 2 },
    orderBy: { reorder_id: "asc" },
    take: 10,
  });

  // Fetch trending items (is_featured = 1, item_status = 1)
  const trendingItems = await prisma.item.findMany({
    where: { 
      item_status: 1,
      // You can filter by is_featured if you want specific items, or just top ones
      // is_featured: 1 
    },
    take: 6,
    orderBy: {
        id: 'desc'
    }
  });

  // Fetch sliders
  const sliders = await prisma.slider.findMany({
    where: { is_available: 1 },
    orderBy: { reorder_id: "asc" },
  });

  const settings = await prisma.settings.findFirst();
  const viewMode = settings?.product_card_view === 1 ? "grid" : "list";

  return (
    <div className="w-full">
      {/* Hero / Slider Area */}
      {sliders.length > 0 ? (
        <section className="bg-[#111] py-20 relative overflow-hidden border-b border-[#222]">
          {/* Implement a simple CSS scroll snap carousel for multiple sliders or just show the first one if you want a basic hero */}
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[60vh] md:h-[70vh]">
            {sliders.map(slider => (
              <div key={slider.id} className="min-w-full snap-center relative flex items-center justify-center">
                <img src={slider.image} alt={slider.title} className="absolute inset-0 w-full h-full object-cover opacity-50" />
                <div className="relative z-10 text-center px-4">
                  <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg" style={{ color: "var(--primary-color)" }}>
                    {slider.title}
                  </h1>
                  <p className="text-lg text-zinc-300 mb-8 max-w-2xl mx-auto drop-shadow-md">
                    {slider.description}
                  </p>
                  <Link 
                    href="/menu" 
                    className="inline-block text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-1"
                    style={{ backgroundColor: "var(--primary-color)" }}
                  >
                    Explore Menu <i className="fa-solid fa-circle-arrow-right ml-2"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-[#111] py-20 relative overflow-hidden border-b border-[#222]">
          <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between">
            <div className="md:w-1/2 z-10 animate-[slideInLeft_1s_ease-out]">
              <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                Enjoy Our <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-[var(--primary-color)] to-[var(--secondary-color)]">Delicious Food</span>
              </h1>
              <p className="text-lg text-zinc-400 mb-8 max-w-md">
                Order your favorite meals online and get them delivered to your doorstep hot and fresh in no time!
              </p>
              <Link 
                href="/menu" 
                className="inline-block text-white font-bold px-8 py-4 rounded-full shadow-lg transition-all transform hover:-translate-y-1"
                style={{ backgroundColor: "var(--primary-color)" }}
              >
                Explore Menu <i className="fa-solid fa-circle-arrow-right ml-2"></i>
              </Link>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0 z-10 flex justify-center animate-[slideInRight_1s_ease-out]">
              <div className="relative w-72 h-72 md:w-96 md:h-96 rounded-full bg-gradient-to-br from-[#1a1a1a] to-[#0a0a0a] flex items-center justify-center shadow-2xl border border-[#333] animate-[float_6s_ease-in-out_infinite]">
                <i className="fa-solid fa-burger text-9xl drop-shadow-lg" style={{ color: "var(--primary-color)", opacity: 0.8 }}></i>
                <div className="absolute top-10 -right-4 bg-white text-black px-4 py-2 rounded-xl shadow-xl font-bold transform rotate-6 animate-[pulse_2s_infinite]">
                  🔥 Hot & Fresh
                </div>
              </div>
            </div>
          </div>
        </section>
      )}
        
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
        `}} />

      {/* Top Categories Section */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Categories</h2>
              <p className="text-zinc-500 mt-2">Top Categories</p>
            </div>
            <Link href="/menu" className="hidden sm:inline-block border-2 border-red-600 text-red-600 font-bold px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
              View All
            </Link>
          </div>

          {categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
              {categories.map((category) => (
                <Link 
                  key={category.id.toString()} 
                  href={`/menu?category=${category.slug}`}
                  className="group flex flex-col items-center bg-[#1a1a1a] rounded-2xl p-6 hover:bg-[#222] transition-colors border border-[#333] hover:border-red-600/50"
                >
                  <div className="w-24 h-24 rounded-full bg-[#111] shadow-sm flex items-center justify-center mb-4 overflow-hidden group-hover:shadow-[0_0_15px_rgba(220,38,38,0.3)] transition-shadow">
                    <FallbackImage 
                      src={`/storage/app/public/admin-assets/images/category/${category.image}`} 
                      alt={category.category_name}
                      className="w-full h-full object-cover"
                      fallbackSrc={`https://via.placeholder.com/150?text=${encodeURIComponent(category.category_name)}`}
                    />
                  </div>
                  <h3 className="font-bold text-zinc-100 text-center group-hover:text-red-500 transition-colors">{category.category_name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-gray-50 rounded-2xl">
              <p className="text-gray-500">No categories found.</p>
            </div>
          )}
          
          <div className="mt-8 text-center sm:hidden">
            <Link href="/menu" className="inline-block border-2 border-red-600 text-red-600 font-bold px-8 py-3 rounded-lg hover:bg-red-600 hover:text-white transition-colors w-full">
              View All Categories
            </Link>
          </div>
        </div>
      </section>

      {/* Trending Items Section */}
      <section className="py-20 bg-[#111] border-t border-[#222]">
        <div className="container mx-auto px-4 lg:px-8">
           <div className="flex justify-between items-end mb-10">
            <div>
              <h2 className="text-3xl font-extrabold text-white uppercase tracking-tight">Trending</h2>
              <p className="text-zinc-500 mt-2">Top Trending Items</p>
            </div>
            <Link href="/menu" className="hidden sm:inline-block border-2 border-red-600 text-red-600 font-bold px-6 py-2 rounded-lg hover:bg-red-600 hover:text-white transition-colors">
              View All
            </Link>
          </div>
          
          {/* View Mode Rendering */}
          {viewMode === "list" ? (
            <div className="flex flex-col gap-4">
              {trendingItems.map((item) => (
                <div key={item.id.toString()} className="bg-[#1a1a1a] rounded-2xl shadow-sm hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-shadow overflow-hidden group flex flex-col sm:flex-row border border-[#333]">
                  <div className="w-full sm:w-48 h-48 sm:h-auto bg-[#222] relative overflow-hidden flex-shrink-0">
                    <FallbackImage 
                      src={`/storage/app/public/admin-assets/images/item/${item.image}`}
                      alt={item.item_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      fallbackSrc={`https://via.placeholder.com/400x300?text=${encodeURIComponent(item.item_name)}`}
                    />
                  </div>
                  <div className="p-6 flex flex-col flex-grow justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2 gap-2">
                        <h3 className="font-bold text-2xl text-white group-hover:text-red-500 transition-colors line-clamp-2">{item.item_name}</h3>
                        <span className="font-bold text-2xl text-red-500 flex-shrink-0">${item.price}</span>
                      </div>
                      <p className="text-zinc-400 text-sm mb-4 line-clamp-2 sm:line-clamp-none">{item.item_description || "Delicious item ready to be ordered."}</p>
                    </div>
                    <div className="mt-4 flex justify-end">
                      <AddToCartButton item={item} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trendingItems.map((item) => (
                <div key={item.id.toString()} className="bg-[#1a1a1a] rounded-2xl shadow-sm hover:shadow-[0_0_20px_rgba(0,0,0,0.5)] transition-shadow overflow-hidden group border border-[#333]">
                  <div className="h-48 bg-[#222] relative overflow-hidden">
                    <FallbackImage 
                      src={`/storage/app/public/admin-assets/images/item/${item.image}`}
                      alt={item.item_name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      fallbackSrc={`https://via.placeholder.com/400x300?text=${encodeURIComponent(item.item_name)}`}
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2 gap-2">
                      <h3 className="font-bold text-xl text-white group-hover:text-red-500 transition-colors line-clamp-1">{item.item_name}</h3>
                      <span className="font-bold text-lg text-red-500">${item.price}</span>
                    </div>
                    <p className="text-zinc-400 text-sm mb-4 line-clamp-2">{item.item_description || "Delicious item ready to be ordered."}</p>
                    <AddToCartButton item={item} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
