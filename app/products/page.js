import PageIntro from '@/frontend/components/PageIntro';
import StageDivider from '@/frontend/components/StageDivider';
import ProductsCatalog from '@/frontend/components/ProductsCatalog';
import CTA from '@/frontend/components/CTA';
import { getProducts } from '@/backend/lib/content';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Our Products — Grostage',
  description: 'Explore proprietary software products built by Grostage, including HallSpot — an internal booking, room inventory, and accounting platform for convention centers.',
  openGraph: {
    title: 'Our Products — Grostage',
    description: 'Proprietary software platforms engineered by Grostage for real business operations, including HallSpot.',
    url: 'https://grostage.com/products',
    images: [{ url: '/projects/hallspot.jpg', width: 1200, height: 630, alt: 'HallSpot by Grostage' }],
  },
  alternates: { canonical: 'https://grostage.com/products' },
};

export default async function ProductsPage() {
  const products = await getProducts();

  return (
    <main id="main-content">
      <PageIntro
        label="OUR PRODUCTS"
        title="Built in-house."
        accent="Built to scale."
        description="Proprietary software platforms engineered by Grostage from the ground up — designed for real teams, operational clarity, and everyday speed."
      />
      <StageDivider from="#060908" to="#f0f3ef" />
      <ProductsCatalog products={products} />
      <StageDivider from="#f0f3ef" to="#060908" flip />
      <CTA />
    </main>
  );
}

