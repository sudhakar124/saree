import Link from 'next/link';
import { Mail, Phone, MapPin, ShieldCheck, Truck, Clock, Globe, MessageCircle } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Trust Badges Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pb-12 border-b border-slate-800 mb-12">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full text-rose-500">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Verified Sellers</h4>
              <p className="text-sm text-slate-400">All our B2B sellers undergo strict GST and business verification.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full text-rose-500">
              <Truck className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">Pan-India Delivery</h4>
              <p className="text-sm text-slate-400">Reliable wholesale shipping across all states in India.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-slate-800 rounded-full text-rose-500">
              <Clock className="w-8 h-8" />
            </div>
            <div>
              <h4 className="text-white font-bold text-lg">24/7 B2B Support</h4>
              <p className="text-sm text-slate-400">Dedicated account managers for large volume buyers.</p>
            </div>
          </div>
        </div>

        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          
          {/* Brand & About */}
          <div className="space-y-4">
            <Link href="/" className="text-3xl font-extrabold text-white tracking-tight">
              Saree<span className="text-rose-500">Wholesale</span>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              India's premier B2B marketplace connecting verified saree manufacturers directly with retailers and boutique owners globally.
            </p>
            <div className="flex space-x-4 pt-2">
              <a href="#" className="text-slate-400 hover:text-white transition"><Globe className="w-5 h-5" /></a>
              <a href="#" className="text-slate-400 hover:text-white transition"><MessageCircle className="w-5 h-5" /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Quick Links</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/" className="hover:text-rose-400 transition">Home</Link></li>
              <li><Link href="/login" className="hover:text-rose-400 transition">Wholesale Login</Link></li>
              <li><Link href="/register" className="hover:text-rose-400 transition">Become a Seller</Link></li>
              <li><Link href="/delivery" className="hover:text-rose-400 transition">Delivery Partner Portal</Link></li>
              <li><Link href="#" className="hover:text-rose-400 transition">About Us</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Support</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="#" className="hover:text-rose-400 transition">Help Center</Link></li>
              <li><Link href="#" className="hover:text-rose-400 transition">Bulk Order Returns</Link></li>
              <li><Link href="#" className="hover:text-rose-400 transition">Shipping Policy</Link></li>
              <li><Link href="#" className="hover:text-rose-400 transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-white font-bold text-lg mb-6">Contact Us</h3>
            <ul className="space-y-4 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-rose-500 shrink-0 mt-0.5" />
                <span>123 Textile Market, Ring Road, Surat, Gujarat 395002, India</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-rose-500 shrink-0" />
                <span>+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-rose-500 shrink-0" />
                <span>b2b@sareewholesale.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-sm text-slate-500 flex flex-col md:flex-row justify-between items-center gap-4">
          <p>&copy; {new Date().getFullYear()} Saree Wholesale Pro. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition">B2B Agreement</Link>
          </div>
        </div>

      </div>
    </footer>
  );
};

export default Footer;
