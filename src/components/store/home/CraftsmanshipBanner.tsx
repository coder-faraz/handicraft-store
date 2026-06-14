// FILE: src/components/store/home/CraftsmanshipBanner.tsx
import Link from 'next/link';
import { Award, Users, Star } from 'lucide-react';

export default function CraftsmanshipBanner() {
  return (
    <section className="py-20 bg-brand-light">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-stretch bg-white rounded-2xl overflow-hidden shadow-warm-md border border-brand-border">
          {/* Left: Image */}
          <div className="w-full lg:w-1/2 relative min-h-[300px] lg:min-h-[500px] bg-brand-dark">
            <img
              src="https://images.unsplash.com/photo-1610996841178-aa86f52e519e?auto=format&fit=crop&q=80&w=1000"
              alt="Artisan crafting a pot"
              className="absolute inset-0 w-full h-full object-cover opacity-90"
            />
            {/* Storytelling Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-dark/90 via-transparent to-transparent flex items-end p-8">
              <p className="font-accent text-2xl text-brand-accent tracking-wide drop-shadow-md">
                "Every piece tells a story of generations."
              </p>
            </div>
          </div>

          {/* Right: Content */}
          <div className="w-full lg:w-1/2 p-8 md:p-12 lg:p-16 flex flex-col justify-center">
            <p className="font-semibold text-brand-primary uppercase tracking-widest text-sm mb-3">
              Our Heritage
            </p>
            <h2 className="font-display text-4xl lg:text-5xl font-bold text-brand-dark mb-6 leading-tight">
              Crafted by Skilled Artisans
            </h2>
            <p className="text-brand-muted leading-relaxed mb-10 text-lg">
              At Limra Manufacturing Company, we partner directly with master craftspeople across India. Our mission is to preserve centuries-old techniques while bringing premium, ethically-sourced home decor to your doorstep.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10 border-t border-b border-brand-border py-8">
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-primary mb-3">
                  <Award size={24} />
                </div>
                <p className="font-display text-2xl font-bold text-brand-dark">25+</p>
                <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Years Exp.</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-primary mb-3">
                  <Users size={24} />
                </div>
                <p className="font-display text-2xl font-bold text-brand-dark">500+</p>
                <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Artisans</p>
              </div>
              <div className="flex flex-col items-center text-center">
                <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center text-brand-primary mb-3">
                  <Star size={24} />
                </div>
                <p className="font-display text-2xl font-bold text-brand-dark">10K+</p>
                <p className="text-xs text-brand-muted uppercase tracking-wider font-semibold">Happy Buyers</p>
              </div>
            </div>

            <Link href="/about" className="btn-primary self-start px-8 py-3.5 text-base shadow-warm">
              Discover Our Story
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
