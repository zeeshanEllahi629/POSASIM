import Link from "next/link";
import Image from "next/image";
import prisma from "@/lib/prisma";

export default async function Footer() {
  const settings = await prisma.settings.findFirst();

  return (
    <footer className="bg-[#0a0a0a] border-t border-[#222] text-zinc-400 py-16">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-3xl font-extrabold text-white mb-4">
              {settings?.footer_title || "Foodefy"}<span className="text-red-500">.</span>
            </h2>
            <p className="mb-6 leading-relaxed">
              {settings?.footer_description || "Delivering the best dining experience straight to your door. Fresh ingredients, masterful chefs, fast delivery."}
            </p>
            <div className="flex gap-4">
              {settings?.facebook_link && (
                <a href={settings.facebook_link} target="_blank" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <i className="fa-brands fa-facebook-f"></i>
                </a>
              )}
              {settings?.twitter_link && (
                <a href={settings.twitter_link} target="_blank" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <i className="fa-brands fa-twitter"></i>
                </a>
              )}
              {settings?.instagram_link && (
                <a href={settings.instagram_link} target="_blank" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <i className="fa-brands fa-instagram"></i>
                </a>
              )}
              {settings?.tiktok_link && (
                <a href={settings.tiktok_link} target="_blank" className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors">
                  <i className="fa-brands fa-tiktok"></i>
                </a>
              )}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Quick Links</h3>
            <ul className="space-y-3">
              <li><Link href="/" className="hover:text-red-500 transition-colors">Home</Link></li>
              <li><Link href="/menu" className="hover:text-red-500 transition-colors">Our Menu</Link></li>
              <li><Link href="/about" className="hover:text-red-500 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-red-500 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Our Services</h3>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-red-500 transition-colors">Fast Delivery</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Catering</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Table Booking</a></li>
              <li><a href="#" className="hover:text-red-500 transition-colors">Gift Cards</a></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-white font-bold text-xl mb-4">Newsletter</h3>
            <p className="mb-4">Subscribe for the latest offers and delicious news.</p>
            <form className="flex flex-col gap-3">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="w-full bg-[#1a1a1a] border border-[#333] rounded-lg px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                required 
              />
              <button 
                type="submit" 
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg px-4 py-3 transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-[#222] flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; {new Date().getFullYear()} {settings?.footer_title || "Foodefy"}. All rights reserved.</p>
          <div className="flex gap-4 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
