"use client";

import Link from "next/link";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="bg-zinc-900 text-white mt-auto">
      {/* Features Bar */}
      <div className="bg-red-600">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-truck-fast text-3xl"></i>
              <h3 className="font-bold text-lg">Fast Delivery</h3>
              <p className="text-sm text-red-100">Within 30 minutes</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-medal text-3xl"></i>
              <h3 className="font-bold text-lg">Best Quality</h3>
              <p className="text-sm text-red-100">Fresh ingredients</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-tags text-3xl"></i>
              <h3 className="font-bold text-lg">Great Offers</h3>
              <p className="text-sm text-red-100">On all online orders</p>
            </div>
            <div className="flex flex-col items-center gap-2">
              <i className="fa-solid fa-headset text-3xl"></i>
              <h3 className="font-bold text-lg">24/7 Support</h3>
              <p className="text-sm text-red-100">Always here for you</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="container mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div>
            <Link href="/">
              <span className="text-3xl font-extrabold tracking-tight text-white mb-4 block">
                foodefy
              </span>
            </Link>
            <p className="text-zinc-400 text-sm leading-relaxed mb-6">
              Welcome to foodefy! The best place to order your favorite meals online. We ensure high-quality food delivered right to your doorstep.
            </p>
          </div>

          {/* Pages */}
          <div>
            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Pages</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><Link href="/about-us" className="hover:text-red-500 transition">About Us</Link></li>
              <li><Link href="/privacy-policy" className="hover:text-red-500 transition">Privacy Policy</Link></li>
              <li><Link href="/refund-policy" className="hover:text-red-500 transition">Refund Policy</Link></li>
              <li><Link href="/terms-conditions" className="hover:text-red-500 transition">Terms & Conditions</Link></li>
            </ul>
          </div>

          {/* Other Links */}
          <div>
            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Other Links</h4>
            <ul className="space-y-2 text-zinc-400 text-sm">
              <li><Link href="/menu" className="hover:text-red-500 transition">Menu</Link></li>
              <li><Link href="/faq" className="hover:text-red-500 transition">FAQ</Link></li>
              <li><Link href="/contact-us" className="hover:text-red-500 transition">Contact Us</Link></li>
              <li><Link href="/gallery" className="hover:text-red-500 transition">Gallery</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-4 uppercase tracking-wider">Contact Us</h4>
            <ul className="space-y-3 text-zinc-400 text-sm">
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-location-dot mt-1 text-red-500"></i>
                <span>123 Food Street, City, Country</span>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-phone mt-1 text-red-500"></i>
                <a href="tel:+1234567890" className="hover:text-white transition">+1 234 567 890</a>
              </li>
              <li className="flex items-start gap-3">
                <i className="fa-solid fa-envelope mt-1 text-red-500"></i>
                <a href="mailto:info@foodefy.com" className="hover:text-white transition">info@foodefy.com</a>
              </li>
            </ul>
            <div className="flex gap-3 mt-6">
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-red-600 transition"><i className="fa-brands fa-facebook-f text-sm"></i></a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-red-600 transition"><i className="fa-brands fa-twitter text-sm"></i></a>
              <a href="#" className="w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center hover:bg-red-600 transition"><i className="fa-brands fa-instagram text-sm"></i></a>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-black py-4">
        <div className="container mx-auto px-4 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-zinc-500 text-xs">
            © {new Date().getFullYear()} foodefy. All rights reserved.
          </p>
          <div className="flex gap-2">
            <i className="fa-brands fa-cc-visa text-2xl text-zinc-600"></i>
            <i className="fa-brands fa-cc-mastercard text-2xl text-zinc-600"></i>
            <i className="fa-brands fa-cc-paypal text-2xl text-zinc-600"></i>
            <i className="fa-brands fa-cc-stripe text-2xl text-zinc-600"></i>
          </div>
        </div>
      </div>
    </footer>
  );
}
