// FILE: src/components/store/layout/Footer.tsx
import Link from 'next/link';
import { Store, Facebook, Instagram, Twitter, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-brand-dark text-white pt-16 pb-8">
      <div className="container mx-auto px-4">
        {/* Top: 4 Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          
          {/* Col 1: About */}
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-brand-primary flex items-center justify-center">
                <Store size={22} className="text-white" />
              </div>
              <div>
                <p className="font-display text-2xl font-bold leading-none">Limra</p>
              </div>
            </Link>
            <p className="text-brand-border/70 text-sm leading-relaxed mt-4">
              Limra Manufacturing Company brings you the finest handcrafted Indian decor, preserving traditional artisanal skills and delivering premium quality directly to your home.
            </p>
            <div className="flex items-center gap-4 mt-6">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                <Facebook size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                <Instagram size={18} />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-brand-primary hover:text-white transition-colors">
                <Twitter size={18} />
              </a>
            </div>
          </div>

          {/* Col 2: Quick Links */}
          <div>
            <h4 className="font-display text-xl font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <li><Link href="/products" className="text-brand-border/70 hover:text-white transition-colors text-sm">All Products</Link></li>
              <li><Link href="/categories" className="text-brand-border/70 hover:text-white transition-colors text-sm">Shop by Category</Link></li>
              <li><Link href="/about" className="text-brand-border/70 hover:text-white transition-colors text-sm">Our Story</Link></li>
              <li><Link href="/blog" className="text-brand-border/70 hover:text-white transition-colors text-sm">Artisan Blog</Link></li>
              <li><Link href="/track-order" className="text-brand-border/70 hover:text-white transition-colors text-sm">Track Order</Link></li>
            </ul>
          </div>

          {/* Col 3: Customer Service */}
          <div>
            <h4 className="font-display text-xl font-bold mb-6">Customer Service</h4>
            <ul className="space-y-3">
              <li><Link href="/contact" className="text-brand-border/70 hover:text-white transition-colors text-sm">Contact Us</Link></li>
              <li><Link href="/faq" className="text-brand-border/70 hover:text-white transition-colors text-sm">FAQ</Link></li>
              <li><Link href="/returns" className="text-brand-border/70 hover:text-white transition-colors text-sm">Returns & Exchanges</Link></li>
              <li><Link href="/shipping" className="text-brand-border/70 hover:text-white transition-colors text-sm">Shipping Policy</Link></li>
              <li><Link href="/privacy" className="text-brand-border/70 hover:text-white transition-colors text-sm">Privacy Policy</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact */}
          <div>
            <h4 className="font-display text-xl font-bold mb-6">Contact Us</h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-brand-accent flex-shrink-0 mt-0.5" />
                <span className="text-brand-border/70 text-sm">123 Artisan Valley, Craft District,<br/>New Delhi, India 110001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-brand-accent flex-shrink-0" />
                <span className="text-brand-border/70 text-sm">+91 98765 43210</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-brand-accent flex-shrink-0" />
                <span className="text-brand-border/70 text-sm">hello@limramanufacturing.com</span>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-brand-border/50 text-sm text-center md:text-left">
            &copy; {new Date().getFullYear()} Limra Manufacturing Company. All rights reserved.
          </p>
          <div className="flex items-center gap-4 opacity-70">
            {/* Simple payment icons representation */}
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-brand-dark text-[10px] font-bold">VISA</div>
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-brand-dark text-[10px] font-bold">MC</div>
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-brand-dark text-[10px] font-bold">UPI</div>
            <div className="w-10 h-6 bg-white rounded flex items-center justify-center text-brand-dark text-[10px] font-bold">RUPAY</div>
          </div>
        </div>
      </div>
    </footer>
  );
}
