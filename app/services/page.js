import PageIntro from '@/frontend/components/PageIntro';
import StageDivider from '@/frontend/components/StageDivider';
import CTA from '@/frontend/components/CTA';
import {services} from '@/backend/lib/content';
import ServicesExplorer from '@/frontend/components/ServicesExplorer';
export const metadata={title:'Services — Grostage'};
export default function Services(){return <main id="main-content"><PageIntro label="WHAT WE DO" title="Four capabilities." accent="One digital partner." description="From first idea to continuous growth. Practical technology, thoughtful design and the expertise to bring it all together." /><StageDivider from="#060908" to="#f0f3ef" /><ServicesExplorer services={services} /><StageDivider from="#f0f3ef" to="#060908" flip /><CTA /></main>;}
