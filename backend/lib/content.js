import { q } from './db';

// Public preview content transcribed/adapted from the supplied company profile.
// Database-backed management and seeding are the next review stages.
export const services = [
  {title: 'Digital Products', slug: 'digital-products', icon: '◇', description: 'Digital experiences built around real users and real business requirements.', items: ['Websites & e-commerce', 'Mobile applications', 'SaaS & product development', 'Custom software'], detail: 'From a single-page website to a complete digital product, we build for the next stage of the business. Corporate websites, custom stores, payment integrations and cross-platform applications bring the experience together.'},
  {title: 'Business Technology', slug: 'business-technology', icon: '⌘', description: 'The right software, connected to the way your business actually works.', items: ['ERP & CRM systems', 'Operations & inventory', 'Workflow automation', 'APIs & integrations'], detail: 'We turn business processes into digital systems. Sales, purchasing, accounting, customer management and reporting come together in tools designed around your operations.'},
  {title: 'AI & Data', slug: 'ai-data', icon: '✳', description: 'Make data useful. Make automation intelligent. Turn information into action.', items: ['AI assistants & chatbots', 'AI-powered workflows', 'Power BI & analytics', 'Document processing'], detail: 'We use AI, automation and analytics to help businesses reduce repetitive work and make better decisions. Our capabilities include AI integrations, automated reporting, operational dashboards and notifications.'},
  {title: 'Digital Growth', slug: 'digital-growth', icon: '↗', description: 'Connect your digital products with the people who need them.', items: ['Strategy & performance', 'Social media & content', 'SEO & digital presence', 'Campaigns & video'], detail: 'A digital product is only valuable when it reaches the right audience. Our growth services combine strategy, creative execution and performance marketing, from campaign planning to search and social.'},
];
export const steps = [['Discover', 'Understand the business, users and objectives.'], ['Define', 'Translate requirements into a clear strategy and scope.'], ['Design', 'Create the experience, workflows and product architecture.'], ['Build', 'Develop, integrate, test and refine.'], ['Launch', 'Deploy the solution and prepare the business for adoption.'], ['Grow', 'Measure, optimize, automate and continuously improve.']];
export const works = [
  {id: 1, slug: 'fruitup', title: 'FruitUp', category: 'E-commerce / Digital product', image: '/projects/profile-11-0.jpeg', tags: ['E-commerce', 'Subscriptions', 'Brand website'], excerpt: 'Fresh thinking for fresh-cut fruit. A brand-led commerce platform built around everyday goals.', content: "A brand-led e-commerce platform for FruitUp’s fresh-cut fruit boxes, with a goal-based product catalogue and both subscription and single-purchase ordering.\n\n## The experience\n\nThe platform brings a brand website and product catalogue together, giving customers routes to discover fruit boxes and choose how they want to order.\n\n## Built around the business\n\nDigital marketing alongside the FruitUp platform connects content, campaigns and performance channels so the product reaches the right customers.", gallery: '/projects/profile-6-0.jpeg'},
  {id: 2, slug: 'chanakya-properties', title: 'Chanakya Properties', category: 'Real estate / Web experience', image: '/projects/profile-11-2.jpeg', tags: ['Website', 'Property search', 'UI/UX'], excerpt: 'A clearer path to the right property, with discovery at the heart of the experience.', content: 'A property platform with search by location, type and budget, verified listings, and dedicated routes to post a requirement or list a property.\n\n## Purposeful discovery\n\nThe digital experience organizes property search around the criteria people use to make decisions: where they want to live, the kind of property they need, and their budget.\n\n## Connected journeys\n\nDedicated routes support people looking for a property as well as those listing one, bringing both sides of the process into one platform.'},
  {id: 3, slug: 'custom-erp', title: 'Custom ERP', category: 'Business systems / Automation', image: '/projects/profile-11-1.jpeg', tags: ['ERP', 'CRM', 'Reporting'], excerpt: 'One connected view of selling, stock, accounting and customer relationships.', content: 'A business system covering selling, stock, accounting and CRM, with shortcuts, reports and sales trends that work across desktop, tablet and mobile.\n\n## Operations, connected\n\nThe system brings core business functions into a shared working environment. Shortcuts and reports help teams move between everyday tasks and the information behind them.\n\n## Across devices\n\nDesktop, tablet and mobile views keep the operational experience available across different working contexts.'},
  {id: 4, slug: 'warehouse-app', title: 'Warehouse App', category: 'Mobile application / Logistics', image: '/projects/profile-11-3.jpeg', tags: ['Mobile app', 'Operations', 'Logistics'], excerpt: 'Warehouse operations, from item search to dispatch, in the palm of your hand.', content: 'A warehouse operations app for item search, sales and purchase orders, pick lists, stock by location and a live view of dispatches and deliveries.\n\n## Designed for everyday operations\n\nItem search and stock by location bring warehouse information into a mobile workflow. Sales orders, purchase orders and pick lists support the next operational step.\n\n## A live view\n\nDispatch and delivery views connect the warehouse workflow with the movement of goods.'},
  {id: 5, slug: 'samsung-exclusive-store', title: 'Samsung Exclusive Store', category: 'Campaigns / Social media', image: '/projects/profile-13-0.jpeg', imageAlt: 'Samsung exclusive store campaign and giveaway creative by Grostage', representative: true, tags: ['Social Media Management', 'Campaign Strategy', 'Poster Design', 'Real Shoot Video', 'Motion Graphics', 'AI Video', 'Meta Ads', 'Giveaway Campaign'], excerpt: 'Full-spectrum social media and campaign work for a Samsung exclusive retail store — real-shoot video, motion graphics, AI video, Meta ads, and a viral giveaway that drove massive local engagement.', content: 'End-to-end social media management and campaign work for a Samsung exclusive retail store, combining premium creative production with a precisely engineered giveaway campaign designed to drive local buzz and measurable footfall.\n\n## Social Media Management\n\nFull ongoing social media management across platforms — a consistent content calendar of product highlights, store stories, promotions and lifestyle posts that kept the Samsung brand vivid and relevant in the local market every single week.\n\n## Creative Production: Posters, Real Shoot & Motion\n\nIn-house poster designs and real-shoot video productions captured the energy of the store and its products. Motion graphics gave every reel and story polished movement, while AI video added a layer of high-production-value content that would otherwise require a full studio budget.\n\n## Meta Ads & Performance Campaigns\n\nTargeted Meta advertising campaigns amplified top-performing organic content and drove store traffic. Ad creative, audience segmentation, budget pacing and A/B testing were managed end-to-end to maximise reach and cost efficiency for each campaign window.\n\n## Viral Giveaway Campaign\n\nA gamified smartphone giveaway was engineered for maximum organic sharing. Entry mechanics were optimised to incentivise tagging, reposting and friend referrals, turning the launch into a local social moment. High-energy giveaway creative, countdown posts and winner announcements kept the store top-of-mind throughout the campaign lifecycle.'},
  {id: 6, slug: 'soorya-solar', title: 'Soorya Solar', category: 'Brand growth / Digital marketing', image: '/projects/profile-8-0.jpeg', imageAlt: 'Soorya Solar social media and campaign creative by Grostage', representative: true, tags: ['Social Media Management', 'Poster Design', 'Real Shoot Video', 'Motion Graphics', 'AI Video', 'Meta Ads', 'Brand Strategy', 'Content Creation'], excerpt: 'Full-spectrum social media management for Soorya Solar — posters, real-shoot video, motion graphics, AI video and Meta ads — building a premium digital presence for a solar brand with growing regional reach.', content: 'A comprehensive, ongoing social media management engagement for Soorya Solar, covering every layer of digital presence from brand strategy and content creation to professional video production and paid performance campaigns.\n\n## Social Media Management & Content Calendar\n\nEnd-to-end management of Soorya Solar\'s social presence across platforms, with a structured weekly content calendar covering product education, installation showcases, customer stories, and seasonal promotions — building a consistent, authoritative voice for the brand in a competitive clean energy market.\n\n## Creative Production: Posters & Graphic Design\n\nHigh-impact poster designs tailored for feed and story placements — product features, offer announcements, awareness campaigns and branded templates — all designed to reflect the premium positioning of the Soorya Solar brand and stand out in local feeds.\n\n## Real Shoot Video & Motion Graphics\n\nOn-location real shoot videos captured genuine product installations, customer moments and behind-the-scenes brand content. Motion graphics added polish to every video asset — animated intros, kinetic text, and branded overlays that elevated the production quality across all formats.\n\n## AI Video Production\n\nAI-powered video content extended the production pipeline, enabling high-quality explainer videos, product showcases and promotional reels at pace and scale — without the cost of a full studio for every asset.\n\n## Meta Ads & Performance Campaigns\n\nMeta advertising campaigns amplified the strongest organic content with targeted local and regional reach. Creative, segmentation, budget management and reporting were handled end-to-end, ensuring every rupee in ad spend drove qualified leads and meaningful brand awareness for Soorya Solar.'},
  {id: 7, slug: 'circuit-india', title: 'Circuit India', category: 'Hospitality & Travel / Web Platform', image: '/projects/circuit-india.webp', imageAlt: 'Circuit India luxury resort booking website interface and AI travel assistant', representative: false, tags: ['Full-Stack Development', 'Resort Booking', 'Payment Gateway', 'AI Chatbot', 'Custom CMS', 'Reviews & Ratings'], excerpt: 'A full-stack resort booking platform with seamless payments, verified reviews, an AI chatbot for easy discovery, and fully customizable content.', content: 'A bespoke full-stack resort booking platform engineered for Circuit India, bringing luxury resort discovery, friction-free reservations, and granular content management into a single modern web experience.\n\n## AI Chatbot & Smart Discovery\n\nAn intelligent conversational booking chatbot helps prospective travelers find and filter resorts effortlessly. Guests can search by destination, price tier, travel dates, party size, and tailored amenities—from private pool villas to wellness retreats. Live inventory checks ensure instant clarity before booking.\n\n## Secure Payments & Direct Booking\n\nAn integrated end-to-end reservation engine with multi-channel payment gateway support handles instant card and UPI transactions. Travelers receive automated email and SMS confirmations with QR booking vouchers, while administrators track real-time occupancy and revenue.\n\n## Verified Reviews & Social Proof\n\nA comprehensive guest feedback system allows verified travelers to share ratings and reviews, establishing immediate trust for future guests.\n\n## Fully Customizable Content & Dynamic Links\n\nBuilt with a custom editorial backend, the Circuit India marketing team can modify text, banners, promotional links, destination highlights, and seasonal packages across the entire site without writing a single line of code.'},
  {id: 8, slug: 'chanakya-erp', title: 'Chanakya ERP', category: 'Enterprise Systems / AI Automation', image: '/projects/chanakya-erp.webp', imageAlt: 'Chanakya ERP custom dashboard with bilingual English and Malayalam AI assistant', representative: false, tags: ['Custom ERP', 'AI Voice Assistant', 'Bilingual AI', 'Finance & Accounting', 'CRM', 'Employee Management', 'Attendance System'], excerpt: 'A custom ERP built from the ground up featuring a bilingual English & Malayalam AI chatbot and voice assistant, plus finance, CRM, and HR attendance modules.', content: 'A bespoke enterprise resource planning system engineered from the ground up for Chanakya, unifying company-wide operations, financial control, and human resources within a blazing-fast, proprietary platform.\n\n## Bilingual AI Chatbot & Voice Assistant\n\nA groundbreaking conversational AI assistant with speech recognition and natural language understanding in both English and Malayalam. Team members and executives can issue voice commands or chat queries to generate financial summaries, check attendance, or look up customer records on the go.\n\n## Finance, Invoicing & Tax Compliance\n\nA robust accounting suite managing real-time general ledgers, GST-compliant invoicing, automated expense tracking, vendor disbursements, and predictive cash flow analytics for complete balance-sheet clarity.\n\n## Full-Funnel CRM & Pipeline\n\nEnd-to-end customer relationship management tracking inquiries from initial lead acquisition through proposals, follow-ups, and deal closure, with automated handoffs to billing and project execution.\n\n## Employee Management & Attendance\n\nA unified human resource module featuring geo-tagged attendance logging, biometric hardware synchronization, shift rostering, leave workflows, and automated payroll computations.\n\n## Ground-Up Enterprise Architecture\n\nBuilt entirely without bloated generic templates or third-party license lock-ins, Chanakya ERP provides sub-second screen transitions, strict role-based access control (RBAC), and responsive layouts for desktop, tablet, and mobile.'},
  {id: 9, slug: 'bright-bee', title: 'Bright Bee', category: 'EdTech / Web Design', image: '/clients/bright%20bee.webp', imageAlt: 'Bright Bee multi-page educational website built by Grostage', representative: false, tags: ['Multi-Page Website', 'EdTech', 'Web Design', 'SEO', 'Lead Capture', 'Responsive Design'], excerpt: 'A professionally designed multi-page website for Bright Bee — purpose-built to showcase courses, capture enquiries and rank consistently on search engines.', content: 'A clean, professional multi-page website built for Bright Bee, an education and training provider, designed to present their courses with clarity, generate enquiries, and perform strongly in local search.\n\n## Multi-Page Website Architecture\n\nThe site spans a structured set of pages — home, courses, about, and contact — each purpose-designed to guide visitors through the educational offering and convert interest into a direct enquiry. Navigation is simple and purposeful, built around how parents and prospective students actually explore a training provider.\n\n## Design & Visual Identity\n\nThe design reflects Bright Bee\'s brand: clean, approachable, and professional. Typography, colour and layout choices project credibility and warmth simultaneously, making the site feel trustworthy for parents making decisions about their children\'s education.\n\n## Mobile-First & Responsive\n\nFully responsive across mobile, tablet and desktop — with careful attention to touch interactions, readable font sizes and fast loading on mobile data connections, where the majority of the target audience browses.\n\n## SEO & Organic Discovery\n\nBuilt with SEO fundamentals in place from the ground up: semantic HTML structure, keyword-targeted page titles and meta descriptions, optimised heading hierarchies and fast page speeds — designed to surface consistently in local search results for relevant course queries.\n\n## Lead Capture & Enquiry Forms\n\nStrategically placed enquiry forms and clear calls to action on every key page convert organic visitors into genuine leads, making the site a continuous source of inbound student enquiries for the Bright Bee team.'},
];

const workColumns = `id,title,slug,category,excerpt,content,image,image_alt,representative,gallery,tags,published,created_at`;

export function normalizeWork(row) {
  return {
    ...row,
    tags: Array.isArray(row.tags)
      ? row.tags
      : String(row.tags || '').split(',').map(tag => tag.trim()).filter(Boolean),
    imageAlt: row.image_alt || row.imageAlt || '',
    representative: Boolean(row.representative),
  };
}

let worksReady;
export async function ensureWorksTable() {
  if (!worksReady) worksReady = (async () => {
    await q(`CREATE TABLE IF NOT EXISTS works (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      slug TEXT UNIQUE NOT NULL,
      category TEXT DEFAULT '',
      excerpt TEXT DEFAULT '',
      content TEXT DEFAULT '',
      image TEXT DEFAULT '',
      image_alt TEXT DEFAULT '',
      representative BOOLEAN DEFAULT false,
      gallery TEXT DEFAULT '',
      tags TEXT DEFAULT '',
      published BOOLEAN DEFAULT true,
      created_at TIMESTAMPTZ DEFAULT now()
    )`);
    // Only adds projects that are missing; never overwrites what was edited in the admin.
    for (const work of works) {
      await q(`INSERT INTO works(title,slug,category,excerpt,content,image,image_alt,representative,gallery,tags,published)
        VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,true)
        ON CONFLICT(slug) DO NOTHING`, [
        work.title, work.slug, work.category, work.excerpt, work.content, work.image,
        work.imageAlt || '', Boolean(work.representative), work.gallery || '', work.tags.join(', ')
      ]);
    }
  })().catch(error => { worksReady = null; throw error; });
  return worksReady;
}

export async function getWorks({ includeDrafts = false } = {}) {
  try {
    await ensureWorksTable();
    const rows = await q(`SELECT ${workColumns} FROM works ${includeDrafts ? '' : 'WHERE published'} ORDER BY id ASC`);
    const normalized = rows.map(normalizeWork);
    return includeDrafts ? normalized : normalized.map(work => ({
      ...work,
      image: String(work.image || '').trim() || '/projects/work-placeholder.svg',
    }));
  } catch (error) {
    console.error('Work content read failed', error);
    return includeDrafts ? [] : works;
  }
}

export async function getWork(slug, { includeDrafts = false } = {}) {
  try {
    await ensureWorksTable();
    const rows = await q(`SELECT ${workColumns} FROM works WHERE slug=$1 ${includeDrafts ? '' : 'AND published'} LIMIT 1`, [slug]);
    return rows[0] ? normalizeWork(rows[0]) : null;
  } catch (error) {
    console.error('Work content read failed', error);
    return works.find(work => work.slug === slug) || null;
  }
}
export const samplePosts = [
  {id: 'sample-1', slug: 'technology-with-a-business-purpose', title: 'Technology with a business purpose.', category: 'Perspective', image: '/projects/profile-13-0.jpeg', excerpt: 'Start with the problem. Then build the right digital solution around it.', content: 'Businesses rarely need technology for the sake of technology. They need better ways to acquire customers, manage operations, automate repetitive work, understand data and deliver better experiences.\n\n## Start with the business\n\nGrostage works with businesses to understand the problem first, then design and build the right digital solution around it. Strategy gives the work direction: understanding the business, its goals and its challenges.\n\n## Bring the disciplines together\n\nDesign creates clear and purposeful experiences. Technology turns those experiences into reliable websites, software and systems. Growth connects the product with marketing, automation and measurable business objectives.\n\n## Build for what comes next\n\nA practical solution needs to be useful and maintainable. The next stage of the business should shape the decisions made today.'},
  {id: 'sample-2', slug: 'from-information-to-action', title: 'From information to insight to action.', category: 'AI & Data', image: '/projects/profile-8-0.jpeg', excerpt: 'Where AI, automation and analytics meet everyday business operations.', content: 'Grostage uses AI, automation and analytics to help businesses reduce repetitive work and make better decisions. The focus is practical: useful information, clearer insight and workflows that support action.\n\n## Make data useful\n\nPower BI dashboards, sales analytics, financial reporting and operational dashboards bring information into the context of business decisions. Automated reporting connects this information to recurring needs.\n\n## Make automation intelligent\n\nAI assistants, chatbots, document processing and AI-powered workflows can become parts of a broader business system. Integrations connect these capabilities with the tools a team uses.\n\n## Connect the workflow\n\nWorkflow automation, API integrations, data processing and notifications connect information with the next step. The starting point remains the business process that needs to improve.'},
  {id: 'sample-3', slug: 'building-commerce-around-customers', title: 'Build commerce around your customers.', category: 'Digital Products', image: '/projects/profile-11-0.jpeg', excerpt: 'A look at brand, product discovery and choice through the FruitUp platform.', content: 'The FruitUp platform combines a brand-led e-commerce experience with a goal-based catalogue for fresh-cut fruit boxes. It supports both subscription and single-purchase ordering.\n\n## Give discovery a purpose\n\nA goal-based catalogue organizes products around what customers are looking for. The website and commerce experience work together to connect brand identity with product discovery.\n\n## Support different ways to order\n\nSubscriptions and individual purchases offer different routes through the same platform. The product experience brings these choices into the ordering journey.\n\n## Connect the platform with growth\n\nDigital marketing alongside FruitUp connects content, campaigns and performance channels so the product reaches the right customers.'},
  {id: 'sample-4', slug: 'from-business-problem-to-outcome', title: 'Six steps from problem to possibility.', category: 'Our Approach', image: '/projects/profile-11-1.jpeg', excerpt: 'Discover, define, design, build, launch and grow—with the business at the centre.', content: 'Grostage’s approach starts with the business problem and carries through to continuous improvement. Six connected stages give the work a clear direction.\n\n## Discover and define\n\nFirst, understand the business, users and objectives. Then translate the requirements into a clear strategy and scope. These stages establish what the solution needs to achieve.\n\n## Design and build\n\nCreate the experience, workflows and product architecture. Develop, integrate, test and refine the solution around that foundation.\n\n## Launch and grow\n\nDeploy the solution and prepare the business for adoption. After launch, measure, optimize, automate and continuously improve. The partnership continues as the business moves forward.'},
  {id: 'sample-5', slug: 'when-a-spreadsheet-becomes-a-system', title: 'When a spreadsheet becomes a system.', category: 'Business Technology', image: '/projects/profile-11-3.jpeg', excerpt: 'The signs that daily operations have outgrown shared files, and what to build next.', content: 'Placeholder article. Many businesses run on spreadsheets long after they stop fitting the way the team works. Duplicate entries, version confusion and manual reports are the usual signs.\n\n## What changes\n\nA connected system gives every team one source of truth: stock, orders, customers and reports in one place, on desktop and mobile.\n\nReplace this placeholder with a real article from the admin.'},
  {id: 'sample-6', slug: 'consistency-beats-campaigns', title: 'Consistency beats the one big campaign.', category: 'Digital Growth', image: '/projects/profile-13-0.jpeg', excerpt: 'Why a steady, recognisable presence does more for local brands than a single launch.', content: 'Placeholder article. A single campaign can create a moment, but a consistent presence across social, search and content is what keeps a brand in mind.\n\n## Building the rhythm\n\nA clear voice, a regular publishing plan and simple measurement make growth repeatable.\n\nReplace this placeholder with a real article from the admin.'},
].map((p, i) => ({...p, created_at: new Date(Date.UTC(2026, 9, 12 - i * 9)).toISOString(), sample: true, published: true}));

export const testimonials = [
  {
    quote: "Grostage's lead generation system drove incredible engagement for our smartphone campaign.",
    name: 'Samsung',
    role: 'Consumer Electronics',
    initials: 'S',
    company: 'Samsung',
    logo: '/clients/samsung.svg'
  },
  {
    quote: 'Grostage built us a custom ERP from the ground up that streamlined our operations, connected our departments, and made daily tracking effortless.',
    name: 'Chanakya',
    role: 'Enterprise Operations & ERP',
    initials: 'CP',
    company: 'Chanakya',
    logo: '/clients/chanakya.png'
  },
  {
    quote: 'Grostage built us a full-stack resort booking website with seamless payments and smart discovery that elevated our direct booking experience.',
    name: 'Circuit India',
    role: 'Hospitality & Travel',
    initials: 'CI',
    company: 'Circuit India',
    logo: '/clients/circuit%20india.png'
  },
  {
    quote: 'Grostage built an ERP for us that unified our sales, inventory and dispatch, making our entire company operations remarkably smoother and easier.',
    name: 'Floor Collections',
    role: 'Interiors & Operations / Custom ERP',
    initials: 'FC',
    company: 'Floor Collections',
    logo: '/clients/FLOOR_NEW_LOGO_24_page-0001-removebg-preview.webp'
  },
  {
    quote: 'Grostage built us a clean, tailored multi-page website backed by solid SEO, and produced high-impact AI videos that cut our production costs and consistently attract new students and parents.',
    name: 'Bright Bee',
    role: 'EdTech & Education',
    initials: 'BB',
    company: 'Bright Bee',
    logo: '/clients/bright%20bee.webp'
  },
  {
    quote: 'Our inbound leads doubled within three months of implementing their content system.',
    name: 'WTD',
    role: 'Lifestyle Brand & Media',
    initials: 'WTD',
    company: 'WTD',
    logo: '/clients/what%20the%20data.webp'
  },
  {
    quote: 'Social media is now our top source of inquiries. Highly recommended.',
    name: 'PK Doors',
    role: 'Home Improvement & Materials',
    initials: 'PK',
    company: 'PK Doors',
    logo: '/clients/pkdoorbg.webp'
  },
  {
    quote: 'Fast, high-quality AI video production that perfectly explained our complex product.',
    name: 'Wetex',
    role: 'Industrial Tech & Manufacturing',
    initials: 'WX',
    company: 'Wetex',
    logo: '/clients/WETEX%20LOGO%20(1).webp'
  },
  {
    quote: 'Our social media content has never looked better. We see new customers every day.',
    name: 'Woodlands',
    role: 'Hospitality & Living',
    initials: 'WL',
    company: 'Woodlands',
    logo: '/clients/wooodlands.webp'
  },
  {
    quote: 'Professional AI video content that positioned us as industry leaders.',
    name: 'Lead Networking',
    role: 'Education & Professional Growth',
    initials: 'LN',
    company: 'Lead Networking',
    logo: '/clients/leads%20logo.webp'
  },
];

let testimonialsReady;
export async function ensureTestimonialsTable() {
  if (!testimonialsReady) testimonialsReady = (async () => {
    await q(`CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT DEFAULT '',
      quote TEXT NOT NULL,
      initials TEXT DEFAULT '',
      company TEXT DEFAULT '',
      logo TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT now()
    )`);
    await q(`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT ''`);
    const countRow = await q('SELECT count(*)::int as cnt FROM testimonials');
    if (!countRow[0]?.cnt) {
      for (const t of testimonials) {
        await q(`INSERT INTO testimonials(name, role, quote, initials, company, logo)
          VALUES($1, $2, $3, $4, $5, $6)`, [
          t.name, t.role, t.quote, t.initials || '', t.company || t.name, t.logo || ''
        ]);
      }
    }
  })().catch(error => { testimonialsReady = null; console.error('Testimonials table check error:', error); });
  return testimonialsReady;
}

export async function getTestimonials() {
  try {
    await ensureTestimonialsTable();
    const rows = await q(`SELECT id, name, role, quote, initials, company, logo FROM testimonials ORDER BY id ASC`);
    return rows && rows.length > 0 ? rows : testimonials;
  } catch (error) {
    console.error('Testimonials read failed, fallback to static list:', error);
    return testimonials;
  }
}

// Client wall on /clients. Add a logo path (e.g. '/clients/fruitup.svg' in public/) to show the logo;
// without one the name is set as a wordmark. Placeholders are marked and should be replaced before launch.
export const clients = [
  { name: 'Samsung', industry: 'Consumer Electronics & Retail', logo: '/clients/samsung.svg' },
  { name: 'Chanakya Properties', industry: 'Real Estate & Property', logo: '/clients/chanakya.png' },
  { name: 'Circuit India', industry: 'Travel & Hospitality', logo: '/clients/circuit%20india.png' },
  { name: 'Soorya Solar', industry: 'Renewable Energy', logo: '/clients/soorya%20solar.webp' },
  { name: 'Datacorrel', industry: 'Data Analytics & AI', logo: '/clients/Datacorrel2svg.svg' },
  { name: 'Ayurjeevan', industry: 'Healthcare & Wellness', logo: '/clients/ayurjeevan.webp' },
  { name: 'Royal Convention Center', industry: 'Events & Hospitality', logo: '/clients/Royal%20convention%20center.png' },
  { name: 'Floor Collections', industry: 'Interior & Flooring', logo: '/clients/FLOOR_NEW_LOGO_24_page-0001-removebg-preview.webp' },
  { name: 'Wetex', industry: 'Manufacturing & Industrial', logo: '/clients/WETEX%20LOGO%20(1).webp' },
  { name: 'Bright Bee', industry: 'Education & Learning', logo: '/clients/bright%20bee.webp' },
  { name: 'Data Tutorial', industry: 'EdTech & Learning', logo: '/clients/data-tutorial.webp' },
  { name: 'Digitillam', industry: 'Digital Systems', logo: '/clients/digitillam%20logo_page-0001.webp' },
  { name: 'Emperial', industry: 'Lifestyle & Retail', logo: '/clients/emperial.webp' },
  { name: 'Fab Global', industry: 'Import & Export', logo: '/clients/fab%20global.webp' },
  { name: 'Galaxy', industry: 'Technology & Hardware', logo: '/clients/galaxy.webp' },
  { name: 'Leads', industry: 'Marketing & Growth', logo: '/clients/leads%20logo.webp' },
  { name: 'MIS Data', industry: 'Business Intelligence', logo: '/clients/mis%20data%20logo-01-cropped.svg' },
  { name: 'Mottengattil', industry: 'Enterprise & Consulting', logo: '/clients/mottengattil.webp' },
  { name: 'NurtrHR', industry: 'HR Tech & People Ops', logo: '/clients/nurtrhr.webp' },
  { name: 'PK Door', industry: 'Building Materials', logo: '/clients/pkdoorbg.webp' },
  { name: 'PM Zara', industry: 'Fashion & Retail', logo: '/clients/pmzara.webp' },
  { name: 'Samson', industry: 'Engineering & Machinery', logo: '/clients/samson.png' },
  { name: 'Savees Group', industry: 'Diversified Business', logo: '/clients/savees%20group.webp' },
  { name: 'What The Data', industry: 'Data Science & Media', logo: '/clients/what%20the%20data.webp' },
  { name: 'Woodlands', industry: 'Hospitality & Living', logo: '/clients/wooodlands.webp' },
  { name: 'FruitUp', industry: 'E-commerce & Fresh Produce', logo: '/clients/fruitup.png' },
];

