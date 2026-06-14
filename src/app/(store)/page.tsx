// FILE: src/app/(store)/page.tsx
import HeroBanner from '@/components/store/home/HeroBanner';
import CategoryGrid from '@/components/store/home/CategoryGrid';
import FeaturedProducts from '@/components/store/home/FeaturedProducts';
import BestSellers from '@/components/store/home/BestSellers';
import CraftsmanshipBanner from '@/components/store/home/CraftsmanshipBanner';
import Testimonials from '@/components/store/home/Testimonials';

import { connectDB } from '@/lib/db';
import Banner from '@/models/Banner';
import Category from '@/models/Category';
import Product from '@/models/Product';

async function getHomepageData() {
  await connectDB();
  
  const [banners, categories, featuredProducts, bestSellers] = await Promise.all([
    Banner.find({ isActive: true, position: 'hero' }).sort({ sortOrder: 1 }).lean(),
    Category.find({}).limit(6).lean(),
    Product.find({ isFeatured: true, status: 'active' }).populate('category', 'name').limit(8).lean(),
    Product.find({ status: 'active' }).populate('category', 'name').sort({ sales: -1, createdAt: -1 }).limit(12).lean()
  ]);

  return {
    banners: JSON.parse(JSON.stringify(banners)),
    categories: JSON.parse(JSON.stringify(categories)),
    featuredProducts: JSON.parse(JSON.stringify(featuredProducts)),
    bestSellers: JSON.parse(JSON.stringify(bestSellers))
  };
}

export default async function StoreHomepage() {
  const data = await getHomepageData();

  return (
    <>
      <HeroBanner banners={data.banners} />
      <CategoryGrid categories={data.categories} />
      <FeaturedProducts products={data.featuredProducts} />
      <CraftsmanshipBanner />
      <BestSellers products={data.bestSellers} />
      <Testimonials />
    </>
  );
}
