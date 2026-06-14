// FILE: src/components/store/home/Testimonials.tsx
import { Star, Quote } from 'lucide-react';

const REVIEWS = [
  {
    id: 1,
    name: 'Ananya Sharma',
    city: 'Mumbai',
    rating: 5,
    text: 'The brass decor items I ordered are absolutely stunning. The craftsmanship is evident in every detail. It completely transformed my living room!',
  },
  {
    id: 2,
    name: 'Rahul Verma',
    city: 'New Delhi',
    rating: 5,
    text: 'I bought a hand-painted wooden tray for my mother\'s birthday, and she loved it. The quality and finish are premium. Highly recommended!',
  },
  {
    id: 3,
    name: 'Priya Desai',
    city: 'Bangalore',
    rating: 5,
    text: 'Customer service is excellent. I had a query about the terracotta vases and they responded immediately. The products look even better in person.',
  },
];

export default function Testimonials() {
  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="font-display text-3xl md:text-4xl font-bold text-brand-dark mb-4">What Our Customers Say</h2>
          <div className="w-16 h-1 bg-brand-primary mx-auto rounded-full mb-4" />
          <p className="text-brand-muted max-w-xl mx-auto">
            Don't just take our word for it. Here's what our community of handicraft lovers has to say about their experience.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {REVIEWS.map((review) => (
            <div
              key={review.id}
              className="bg-brand-light/50 rounded-2xl p-8 border border-brand-border relative hover:bg-brand-light transition-colors"
            >
              <Quote size={40} className="absolute top-6 right-6 text-brand-primary/10" />
              
              <div className="flex text-brand-accent mb-6">
                {Array.from({ length: review.rating }).map((_, i) => (
                  <Star key={i} size={18} className="fill-current" />
                ))}
              </div>
              
              <p className="text-brand-dark/80 italic leading-relaxed mb-8 relative z-10">
                "{review.text}"
              </p>
              
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-brand-primary/20 flex items-center justify-center text-brand-primary font-bold text-lg">
                  {review.name.charAt(0)}
                </div>
                <div>
                  <h4 className="font-bold text-brand-dark">{review.name}</h4>
                  <p className="text-xs text-brand-muted">{review.city}, India</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
