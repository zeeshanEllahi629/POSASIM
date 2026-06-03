import prisma from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import Footer from "@/components/front/Footer";

export default async function Home() {
  const sliders = await prisma.slider.findMany({
    where: { is_available: 1 },
    orderBy: { reorder_id: "asc" },
  });

  const banners = await prisma.banner.findMany({
    where: { is_available: 1 },
    orderBy: { reorder_id: "asc" },
  });

  return (
    <div className="w-full flex flex-col min-h-screen bg-[#050505]">
      {/* Hero Section */}
      {sliders.length > 0 ? (
        <section className="relative overflow-hidden flex-grow min-h-[90vh] flex items-center justify-center">
          <div className="absolute inset-0 z-0">
            {/* Ambient Background Glows */}
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-600/20 blur-[150px] mix-blend-screen animate-[float_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-green-500/10 blur-[120px] mix-blend-screen animate-[float_6s_ease-in-out_infinite_reverse]"></div>
          </div>

          <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-hide h-[90vh] w-full z-10">
            {sliders.map((slider) => (
              <div key={slider.id} className="min-w-full snap-center relative flex items-center justify-center py-20 px-4">
                <img src={slider.image} alt={slider.title} className="absolute inset-0 w-full h-full object-cover opacity-30 mix-blend-overlay scale-105" />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#050505]/50 to-[#050505]"></div>
                
                <div className="relative z-20 text-center animate-[fadeInUp_1s_ease-out] max-w-5xl mx-auto">
                  <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 mb-6 tracking-tight drop-shadow-2xl">
                    {slider.title}
                  </h1>
                  <p className="text-lg md:text-2xl text-gray-300 mb-12 max-w-3xl mx-auto font-medium leading-relaxed">
                    {slider.description}
                  </p>
                  
                  <Link 
                    href="/menu" 
                    className="inline-flex items-center gap-4 font-extrabold text-lg md:text-xl px-10 py-5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 transform hover:scale-105 hover:bg-[#00e676] hover:text-black hover:shadow-[0_0_40px_rgba(0,230,118,0.6)] text-white bg-red-600 group relative overflow-hidden"
                  >
                    <span className="relative z-10">EXPLORE OUR MENU</span>
                    <i className="fa-solid fa-arrow-right relative z-10 group-hover:translate-x-2 transition-transform"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="relative overflow-hidden flex-grow min-h-[90vh] flex items-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-600/20 blur-[150px] mix-blend-screen animate-[float_8s_ease-in-out_infinite]"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-500/10 blur-[120px] mix-blend-screen animate-[float_6s_ease-in-out_infinite_reverse]"></div>
          </div>

          <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between z-10 relative">
            <div className="md:w-1/2 z-10 animate-[slideInLeft_1s_ease-out]">
              <div className="inline-block px-4 py-2 glass border border-red-500/30 text-red-500 font-bold rounded-full mb-6 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
                🚀 #1 Food Delivery App
              </div>
              <h1 className="text-6xl md:text-8xl font-black text-white mb-6 leading-none tracking-tight">
                Taste the <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-500 to-yellow-500 drop-shadow-lg">Difference.</span>
              </h1>
              <p className="text-xl text-gray-300 mb-10 max-w-lg leading-relaxed">
                Experience culinary perfection delivered straight to your door. Fresh ingredients, masterful chefs, and lightning-fast delivery.
              </p>
              
              <Link 
                href="/menu" 
                className="inline-flex items-center gap-4 font-extrabold text-lg px-10 py-5 rounded-full shadow-[0_0_30px_rgba(220,38,38,0.4)] transition-all duration-300 transform hover:scale-105 hover:bg-[#00e676] hover:text-black hover:shadow-[0_0_40px_rgba(0,230,118,0.6)] text-white bg-red-600 group"
              >
                EXPLORE MENU 
                <i className="fa-solid fa-arrow-right group-hover:translate-x-2 transition-transform"></i>
              </Link>
            </div>
            
            <div className="md:w-1/2 mt-16 md:mt-0 z-10 flex justify-center animate-[slideInRight_1s_ease-out]">
              <div className="relative w-80 h-80 md:w-[500px] md:h-[500px] flex items-center justify-center animate-[float_6s_ease-in-out_infinite]">
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-red-600/30 to-orange-500/10 blur-3xl"></div>
                <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80" alt="Delicious Food" className="w-full h-full object-cover rounded-full shadow-[0_0_50px_rgba(220,38,38,0.3)] border-[6px] border-[#111] z-10 relative" />
                
                <div className="absolute -bottom-6 -left-6 glass-card p-4 rounded-2xl flex items-center gap-4 z-20 hover-glow transition-all cursor-default">
                  <div className="w-12 h-12 rounded-full bg-green-500/20 text-green-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(0,230,118,0.3)]">
                    <i className="fa-solid fa-motorcycle"></i>
                  </div>
                  <div>
                    <p className="text-white font-bold tracking-wide">Fast Delivery</p>
                    <p className="text-xs text-gray-400">Under 30 mins</p>
                  </div>
                </div>
                
                <div className="absolute top-10 -right-6 glass-card p-4 rounded-2xl flex items-center gap-4 z-20 hover-glow transition-all cursor-default delay-100">
                  <div className="w-12 h-12 rounded-full bg-orange-500/20 text-orange-500 flex items-center justify-center text-xl shadow-[0_0_15px_rgba(249,115,22,0.3)]">
                    <i className="fa-solid fa-fire"></i>
                  </div>
                  <div>
                    <p className="text-white font-bold tracking-wide">Hot & Fresh</p>
                    <p className="text-xs text-gray-400">Straight from oven</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {banners.length > 0 && (
        <section className="py-16 bg-[#050505] container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {banners.map((banner) => (
              <div key={banner.id} className="rounded-3xl overflow-hidden shadow-[0_0_30px_rgba(0,0,0,0.5)] hover:shadow-[0_0_40px_rgba(220,38,38,0.2)] hover:-translate-y-2 transition-all duration-300 relative group cursor-pointer border border-[#222]">
                <img src={banner.image} alt="Promotional Banner" className="w-full h-56 object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                  <span className="text-white font-bold bg-red-600 px-4 py-2 rounded-full text-sm">Order Now</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="py-32 bg-[#0a0a0a] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-20 animate-[fadeInUp_1s_ease-out]">
            <h2 className="text-5xl md:text-6xl font-black text-white mb-6 tracking-tight">Why Choose Foodefy?</h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-xl leading-relaxed">We don't just deliver food, we deliver an experience. Here's what makes us special.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              { icon: "fa-leaf", color: "text-green-500", bg: "bg-green-500/10", shadow: "shadow-[0_0_20px_rgba(0,230,118,0.2)]", title: "Fresh Ingredients", desc: "Every dish is prepared with locally sourced, fresh ingredients to ensure maximum flavor and quality." },
              { icon: "fa-truck-fast", color: "text-red-500", bg: "bg-red-600/10", shadow: "shadow-[0_0_20px_rgba(220,38,38,0.2)]", title: "Fastest Delivery", desc: "Our advanced routing and dedicated drivers ensure your food arrives piping hot in record time." },
              { icon: "fa-medal", color: "text-yellow-500", bg: "bg-yellow-500/10", shadow: "shadow-[0_0_20px_rgba(234,179,8,0.2)]", title: "Award-Winning Chefs", desc: "Our kitchen is run by passionate professionals dedicated to creating unforgettable culinary masterpieces." }
            ].map((feature, i) => (
              <div key={i} className="glass-card p-10 rounded-3xl hover:-translate-y-3 transition-all duration-500 group relative overflow-hidden border border-[#222]">
                <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl group-hover:bg-white/10 transition-colors"></div>
                <div className={`w-20 h-20 rounded-2xl ${feature.bg} ${feature.color} flex items-center justify-center text-4xl mb-8 group-hover:scale-110 transition-transform duration-500 ${feature.shadow}`}>
                  <i className={`fa-solid ${feature.icon}`}></i>
                </div>
                <h3 className="text-2xl font-bold text-white mb-4 tracking-wide">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
        <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#333] to-transparent"></div>
      </section>

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
