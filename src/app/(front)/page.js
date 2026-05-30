import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/front/Footer";

export default async function Home() {
  // Fetch sliders for Hero
  const sliders = await prisma.slider.findMany({
    where: { is_available: 1 },
    orderBy: { reorder_id: "asc" },
  });

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Hero / Slider Area */}
      {sliders.length > 0 ? (
        <section className="bg-[#111] py-20 relative overflow-hidden flex-grow">
          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[80vh] md:h-[85vh]">
            {sliders.map((slider) => (
              <div key={slider.id} className="min-w-full snap-center relative flex items-center justify-center">
                <img src={slider.image} alt={slider.title} className="absolute inset-0 w-full h-full object-cover opacity-40 mix-blend-overlay" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[#050505]"></div>
                
                <div className="relative z-10 text-center px-4 animate-[fadeInUp_1s_ease-out]">
                  <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight drop-shadow-2xl">
                    {slider.title}
                  </h1>
                  <p className="text-xl md:text-2xl text-zinc-300 mb-10 max-w-3xl mx-auto drop-shadow-lg font-medium">
                    {slider.description}
                  </p>
                  
                  {/* Explore Menu Button (Red to Green on Hover) */}
                  <Link 
                    href="/menu" 
                    className="inline-block font-extrabold text-xl px-12 py-5 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all transform hover:scale-105 hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] text-white bg-red-600 group"
                  >
                    EXPLORE OUR MENU 
                    <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="bg-gradient-to-br from-[#1a0505] to-[#050505] relative overflow-hidden flex-grow flex items-center min-h-[90vh]">
          {/* Decorative background elements */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-red-900/20 blur-[120px]"></div>
            <div className="absolute top-[60%] -right-[10%] w-[40%] h-[40%] rounded-full bg-orange-900/20 blur-[100px]"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between z-10 relative">
            <div className="md:w-1/2 z-10 animate-[slideInLeft_1s_ease-out]">
              <div className="inline-block px-4 py-2 bg-red-600/20 text-red-500 font-bold rounded-full mb-6 border border-red-500/30">
                🚀 #1 Food Delivery App
              </div>
              <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 leading-tight drop-shadow-lg">
                Taste the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-400">Difference.</span>
              </h1>
              <p className="text-xl text-zinc-300 mb-10 max-w-lg leading-relaxed">
                Experience culinary perfection delivered straight to your door. Fresh ingredients, masterful chefs, and lightning-fast delivery.
              </p>
              
              <Link 
                href="/menu" 
                className="inline-block font-extrabold text-xl px-12 py-5 rounded-full shadow-[0_0_20px_rgba(220,38,38,0.6)] transition-all duration-300 transform hover:scale-105 hover:bg-green-500 hover:shadow-[0_0_30px_rgba(34,197,94,0.8)] text-white bg-red-600 group"
              >
                EXPLORE MENU 
                <i className="fa-solid fa-arrow-right ml-3 group-hover:translate-x-2 transition-transform"></i>
              </Link>
              
              <div className="mt-12 flex items-center gap-6">
                <div className="flex -space-x-4">
                  <img className="w-12 h-12 rounded-full border-2 border-[#111]" src="https://i.pravatar.cc/100?img=1" alt="User 1" />
                  <img className="w-12 h-12 rounded-full border-2 border-[#111]" src="https://i.pravatar.cc/100?img=2" alt="User 2" />
                  <img className="w-12 h-12 rounded-full border-2 border-[#111]" src="https://i.pravatar.cc/100?img=3" alt="User 3" />
                  <div className="w-12 h-12 rounded-full border-2 border-[#111] bg-red-600 flex items-center justify-center font-bold text-xs">
                    5k+
                  </div>
                </div>
                <div>
                  <div className="text-yellow-400 text-lg">
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                    <i className="fa-solid fa-star"></i>
                  </div>
                  <p className="text-sm text-zinc-400 font-medium mt-1">Happy Customers</p>
                </div>
              </div>
            </div>
            
            <div className="md:w-1/2 mt-16 md:mt-0 z-10 flex justify-center animate-[slideInRight_1s_ease-out]">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
                {/* A nice placeholder image or an actual plate of food. */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/30 to-orange-500/10 blur-3xl"></div>
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Delicious Food" className="w-full h-full object-cover rounded-full shadow-[0_0_50px_rgba(220,38,38,0.3)] border-4 border-[#222] z-10 relative" />
                
                <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] border border-[#333] p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-20">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-motorcycle"></i>
                  </div>
                  <div>
                    <p className="text-white font-bold">Fast Delivery</p>
                    <p className="text-xs text-zinc-400">Under 30 mins</p>
                  </div>
                </div>
                
                <div className="absolute top-10 -right-6 bg-[#1a1a1a] border border-[#333] p-4 rounded-2xl shadow-2xl flex items-center gap-4 z-20">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xl">
                    <i className="fa-solid fa-fire"></i>
                  </div>
                  <div>
                    <p className="text-white font-bold">Hot & Fresh</p>
                    <p className="text-xs text-zinc-400">Straight from oven</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Features Section */}
      <section className="py-24 bg-[#0a0a0a] border-y border-[#222]">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4">Why Choose Foodefy?</h2>
            <p className="text-zinc-400 max-w-2xl mx-auto text-lg">We don't just deliver food, we deliver an experience. Here's what makes us special.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-[#111] border border-[#222] p-10 rounded-3xl hover:border-red-600/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-leaf"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Fresh Ingredients</h3>
              <p className="text-zinc-400 leading-relaxed">Every dish is prepared with locally sourced, fresh ingredients to ensure maximum flavor and quality.</p>
            </div>
            <div className="bg-[#111] border border-[#222] p-10 rounded-3xl hover:border-red-600/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-truck-fast"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Fastest Delivery</h3>
              <p className="text-zinc-400 leading-relaxed">Our advanced routing and dedicated drivers ensure your food arrives piping hot in record time.</p>
            </div>
            <div className="bg-[#111] border border-[#222] p-10 rounded-3xl hover:border-red-600/50 transition-colors group">
              <div className="w-16 h-16 rounded-2xl bg-red-600/10 text-red-500 flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform">
                <i className="fa-solid fa-medal"></i>
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Award-Winning Chefs</h3>
              <p className="text-zinc-400 leading-relaxed">Our kitchen is run by passionate professionals dedicated to creating unforgettable culinary masterpieces.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer />

      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes slideInRight { from { opacity: 0; transform: translateX(50px); } to { opacity: 1; transform: translateX(0); } }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(30px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes float { 0% { transform: translateY(0px); } 50% { transform: translateY(-20px); } 100% { transform: translateY(0px); } }
      `}} />
    </div>
  );
}
