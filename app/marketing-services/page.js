import MarketingHero from '@/frontend/components/MarketingHero';
import StageDivider from '@/frontend/components/StageDivider';
import MarketingOutcomes from '@/frontend/components/MarketingOutcomes';
import MarketingServicesExplorer from '@/frontend/components/MarketingServicesExplorer';
import { getMarketingMedia } from '@/backend/lib/marketing-media';
import '../marketing-services.css';
import '../marketing-services-explorer.css';

const title = 'Marketing Services — Grostage';
const description = 'We connect bold ideas, standout content and smart campaigns to meaningful business growth.';

export const metadata = {
  title,
  description,
  alternates: { canonical: 'https://grostage.com/marketing-services' },
  openGraph: {
    title,
    description,
    url: 'https://grostage.com/marketing-services',
    type: 'website',
  },
};

export default async function MarketingServicesPage() {
  const media = await getMarketingMedia();
  return (
    <main id="main-content" className="marketing-services-page">
      <MarketingHero />
      <StageDivider from="#050505" to="#f0f3ef" accent="#104850" />
      <MarketingOutcomes media={media} />
      <MarketingServicesExplorer media={media} />
    </main>
  );
}
