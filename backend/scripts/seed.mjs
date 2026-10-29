import pg from 'pg';
import fs from 'fs';
import crypto from 'node:crypto';

function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.scryptSync(password, salt, 64).toString('hex');
  return `${salt}:${hash}`;
}

// Load environment variables (.env.local, .env)
for (const file of ['.env.local', '.env']) {
  if (!fs.existsSync(file)) continue;
  for (const line of fs.readFileSync(file, 'utf8').split(/\r?\n/)) {
    const match = line.match(/^\s*([A-Z_][A-Z0-9_]*)=(.*)\s*$/i);
    if (match && process.env[match[1]] === undefined) {
      process.env[match[1]] = match[2].replace(/^['"]|['"]$/g, '');
    }
  }
}

const client = new pg.Client({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.PGSSL === 'true' ? { rejectUnauthorized: false } : undefined,
});

const works = [
  {
    slug: 'fruitup',
    title: 'FruitUp',
    category: 'E-commerce / Digital product',
    image: '/projects/profile-11-0.jpeg',
    tags: 'E-commerce, Subscriptions, Brand website',
    excerpt: 'Fresh thinking for fresh-cut fruit. A brand-led commerce platform built around everyday goals.',
    content: "A brand-led e-commerce platform for FruitUp’s fresh-cut fruit boxes, with a goal-based product catalogue and both subscription and single-purchase ordering.\n\n## The experience\n\nThe platform brings a brand website and product catalogue together, giving customers routes to discover fruit boxes and choose how they want to order.\n\n## Built around the business\n\nDigital marketing alongside the FruitUp platform connects content, campaigns and performance channels so the product reaches the right customers.",
    gallery: '/projects/profile-6-0.jpeg',
    representative: false,
    image_alt: ''
  },
  {
    slug: 'chanakya-properties',
    title: 'Chanakya Properties',
    category: 'Real estate / Web experience',
    image: '/projects/profile-11-2.jpeg',
    tags: 'Website, Property search, UI/UX',
    excerpt: 'A clearer path to the right property, with discovery at the heart of the experience.',
    content: 'A property platform with search by location, type and budget, verified listings, and dedicated routes to post a requirement or list a property.\n\n## Purposeful discovery\n\nThe digital experience organizes property search around the criteria people use to make decisions: where they want to live, the kind of property they need, and their budget.\n\n## Connected journeys\n\nDedicated routes support people looking for a property as well as those listing one, bringing both sides of the process into one platform.',
    gallery: '',
    representative: false,
    image_alt: ''
  },
  {
    slug: 'custom-erp',
    title: 'Custom ERP',
    category: 'Business systems / Automation',
    image: '/projects/profile-11-1.jpeg',
    tags: 'ERP, CRM, Reporting',
    excerpt: 'One connected view of selling, stock, accounting and customer relationships.',
    content: 'A business system covering selling, stock, accounting and CRM, with shortcuts, reports and sales trends that work across desktop, tablet and mobile.\n\n## Operations, connected\n\nThe system brings core business functions into a shared working environment. Shortcuts and reports help teams move between everyday tasks and the information behind them.\n\n## Across devices\n\nDesktop, tablet and mobile views keep the operational experience available across different working contexts.',
    gallery: '',
    representative: false,
    image_alt: ''
  },
  {
    slug: 'warehouse-app',
    title: 'Warehouse App',
    category: 'Mobile application / Logistics',
    image: '/projects/profile-11-3.jpeg',
    tags: 'Mobile app, Operations, Logistics',
    excerpt: 'Warehouse operations, from item search to dispatch, in the palm of your hand.',
    content: 'A warehouse operations app for item search, sales and purchase orders, pick lists, stock by location and a live view of dispatches and deliveries.\n\n## Designed for everyday operations\n\nItem search and stock by location bring warehouse information into a mobile workflow. Sales orders, purchase orders and pick lists support the next operational step.\n\n## A live view\n\nDispatch and delivery views connect the warehouse workflow with the movement of goods.',
    gallery: '',
    representative: false,
    image_alt: ''
  },
  {
    slug: 'samsung-exclusive-store',
    title: 'Samsung Exclusive Store',
    category: 'Campaigns / Social media',
    image: '/projects/profile-13-0.jpeg',
    image_alt: 'Samsung exclusive store campaign and giveaway creative by Grostage',
    representative: true,
    tags: 'Social Media Management, Campaign Strategy, Poster Design, Real Shoot Video, Motion Graphics, AI Video, Meta Ads, Giveaway Campaign',
    excerpt: 'Full-spectrum social media and campaign work for a Samsung exclusive retail store — real-shoot video, motion graphics, AI video, Meta ads, and a viral giveaway that drove massive local engagement.',
    content: 'End-to-end social media management and campaign work for a Samsung exclusive retail store, combining premium creative production with a precisely engineered giveaway campaign designed to drive local buzz and measurable footfall.\n\n## Social Media Management\n\nFull ongoing social media management across platforms — a consistent content calendar of product highlights, store stories, promotions and lifestyle posts that kept the Samsung brand vivid and relevant in the local market every single week.\n\n## Creative Production: Posters, Real Shoot & Motion\n\nIn-house poster designs and real-shoot video productions captured the energy of the store and its products. Motion graphics gave every reel and story polished movement, while AI video added a layer of high-production-value content that would otherwise require a full studio budget.\n\n## Meta Ads & Performance Campaigns\n\nTargeted Meta advertising campaigns amplified top-performing organic content and drove store traffic. Ad creative, audience segmentation, budget pacing and A/B testing were managed end-to-end to maximise reach and cost efficiency for each campaign window.\n\n## Viral Giveaway Campaign\n\nA gamified smartphone giveaway was engineered for maximum organic sharing. Entry mechanics were optimised to incentivise tagging, reposting and friend referrals, turning the launch into a local social moment. High-energy giveaway creative, countdown posts and winner announcements kept the store top-of-mind throughout the campaign lifecycle.',
    gallery: ''
  },
  {
    slug: 'soorya-solar',
    title: 'Soorya Solar',
    category: 'Brand growth / Digital marketing',
    image: '/projects/profile-8-0.jpeg',
    image_alt: 'Technology illustration from the Grostage company profile',
    representative: true,
    tags: 'Brand, Social media, SEO',
    excerpt: 'A clearer digital presence and a consistent voice across social and search.',
    content: 'Brand-led digital marketing for Soorya Solar, shaping a clearer digital presence and a consistent voice across social and search.\n\n## A connected presence\n\nBrand, social media and SEO form the foundation of this digital marketing engagement.\n\n## Image note\n\nThe company profile describes this engagement without campaign images. The visual shown here is Grostage technology artwork from the supplied profile.',
    gallery: ''
  },
  {
    slug: 'circuit-india',
    title: 'Circuit India',
    category: 'Hospitality & Travel / Web Platform',
    image: '/projects/circuit-india.webp',
    image_alt: 'Circuit India luxury resort booking website interface and AI travel assistant',
    representative: false,
    tags: 'Full-Stack Development, Resort Booking, Payment Gateway, AI Chatbot, Custom CMS, Reviews & Ratings',
    excerpt: 'A full-stack resort booking platform with seamless payments, verified reviews, an AI chatbot for easy discovery, and fully customizable content.',
    content: 'A bespoke full-stack resort booking platform engineered for Circuit India, bringing luxury resort discovery, friction-free reservations, and granular content management into a single modern web experience.\n\n## AI Chatbot & Smart Discovery\n\nAn intelligent conversational booking chatbot helps prospective travelers find and filter resorts effortlessly. Guests can search by destination, price tier, travel dates, party size, and tailored amenities—from private pool villas to wellness retreats. Live inventory checks ensure instant clarity before booking.\n\n## Secure Payments & Direct Booking\n\nAn integrated end-to-end reservation engine with multi-channel payment gateway support handles instant card and UPI transactions. Travelers receive automated email and SMS confirmations with QR booking vouchers, while administrators track real-time occupancy and revenue.\n\n## Verified Reviews & Social Proof\n\nA comprehensive guest feedback system allows verified travelers to share ratings and reviews, establishing immediate trust for future guests.\n\n## Fully Customizable Content & Dynamic Links\n\nBuilt with a custom editorial backend, the Circuit India marketing team can modify text, banners, promotional links, destination highlights, and seasonal packages across the entire site without writing a single line of code.',
    gallery: ''
  },
  {
    slug: 'chanakya-erp',
    title: 'Chanakya ERP',
    category: 'Enterprise Systems / AI Automation',
    image: '/projects/chanakya-erp.webp',
    image_alt: 'Chanakya ERP custom dashboard with bilingual English and Malayalam AI assistant',
    representative: false,
    tags: 'Custom ERP, AI Voice Assistant, Bilingual AI, Finance & Accounting, CRM, Employee Management, Attendance System',
    excerpt: 'A custom ERP built from the ground up featuring a bilingual English & Malayalam AI chatbot and voice assistant, plus finance, CRM, and HR attendance modules.',
    content: 'A bespoke enterprise resource planning system engineered from the ground up for Chanakya, unifying company-wide operations, financial control, and human resources within a blazing-fast, proprietary platform.\n\n## Bilingual AI Chatbot & Voice Assistant\n\nA groundbreaking conversational AI assistant with speech recognition and natural language understanding in both English and Malayalam. Team members and executives can issue voice commands or chat queries to generate financial summaries, check attendance, or look up customer records on the go.\n\n## Finance, Invoicing & Tax Compliance\n\nA robust accounting suite managing real-time general ledgers, GST-compliant invoicing, automated expense tracking, vendor disbursements, and predictive cash flow analytics for complete balance-sheet clarity.\n\n## Full-Funnel CRM & Pipeline\n\nEnd-to-end customer relationship management tracking inquiries from initial lead acquisition through proposals, follow-ups, and deal closure, with automated handoffs to billing and project execution.\n\n## Employee Management & Attendance\n\nA unified human resource module featuring geo-tagged attendance logging, biometric hardware synchronization, shift rostering, leave workflows, and automated payroll computations.\n\n## Ground-Up Enterprise Architecture\n\nBuilt entirely without bloated generic templates or third-party license lock-ins, Chanakya ERP provides sub-second screen transitions, strict role-based access control (RBAC), and responsive layouts for desktop, tablet, and mobile.',
    gallery: ''
  },
  {
    slug: 'bright-bee',
    title: 'Bright Bee',
    category: 'EdTech / Web Design',
    image: '/clients/bright%20bee.webp',
    image_alt: 'Bright Bee multi-page educational website built by Grostage',
    representative: false,
    tags: 'Multi-Page Website, EdTech, Web Design, SEO, Lead Capture, Responsive Design',
    excerpt: 'A professionally designed multi-page website for Bright Bee — purpose-built to showcase courses, capture enquiries and rank consistently on search engines.',
    content: 'A clean, professional multi-page website built for Bright Bee, an education and training provider, designed to present their courses with clarity, generate enquiries, and perform strongly in local search.\n\n## Multi-Page Website Architecture\n\nThe site spans a structured set of pages — home, courses, about, and contact — each purpose-designed to guide visitors through the educational offering and convert interest into a direct enquiry. Navigation is simple and purposeful, built around how parents and prospective students actually explore a training provider.\n\n## Design & Visual Identity\n\nThe design reflects Bright Bee\'s brand: clean, approachable, and professional. Typography, colour and layout choices project credibility and warmth simultaneously, making the site feel trustworthy for parents making decisions about their children\'s education.\n\n## Mobile-First & Responsive\n\nFully responsive across mobile, tablet and desktop — with careful attention to touch interactions, readable font sizes and fast loading on mobile data connections, where the majority of the target audience browses.\n\n## SEO & Organic Discovery\n\nBuilt with SEO fundamentals in place from the ground up: semantic HTML structure, keyword-targeted page titles and meta descriptions, optimised heading hierarchies and fast page speeds — designed to surface consistently in local search results for relevant course queries.\n\n## Lead Capture & Enquiry Forms\n\nStrategically placed enquiry forms and clear calls to action on every key page convert organic visitors into genuine leads, making the site a continuous source of inbound student enquiries for the Bright Bee team.',
    gallery: ''
  }
];

const testimonials = [
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

const posts = [
  {
    slug: 'technology-with-a-business-purpose',
    title: 'Technology with a business purpose.',
    excerpt: 'Start with the problem. Then build the right digital solution around it.',
    image: '/projects/profile-13-0.jpeg',
    content: 'Businesses rarely need technology for the sake of technology. They need better ways to acquire customers, manage operations, automate repetitive work, understand data and deliver better experiences.\n\n## Start with the business\n\nGrostage works with businesses to understand the problem first, then design and build the right digital solution around it. Strategy gives the work direction: understanding the business, its goals and its challenges.\n\n## Bring the disciplines together\n\nDesign creates clear and purposeful experiences. Technology turns those experiences into reliable websites, software and systems. Growth connects the product with marketing, automation and measurable business objectives.\n\n## Build for what comes next\n\nA practical solution needs to be useful and maintainable. The next stage of the business should shape the decisions made today.'
  },
  {
    slug: 'from-information-to-action',
    title: 'From information to insight to action.',
    excerpt: 'Where AI, automation and analytics meet everyday business operations.',
    image: '/projects/profile-8-0.jpeg',
    content: 'Grostage uses AI, automation and analytics to help businesses reduce repetitive work and make better decisions. The focus is practical: useful information, clearer insight and workflows that support action.\n\n## Make data useful\n\nPower BI dashboards, sales analytics, financial reporting and operational dashboards bring information into the context of business decisions. Automated reporting connects this information to recurring needs.\n\n## Make automation intelligent\n\nAI assistants, chatbots, document processing and AI-powered workflows can become parts of a broader business system. Integrations connect these capabilities with the tools a team uses.\n\n## Connect the workflow\n\nWorkflow automation, API integrations, data processing and notifications connect information with the next step. The starting point remains the business process that needs to improve.'
  },
  {
    slug: 'building-commerce-around-customers',
    title: 'Build commerce around your customers.',
    excerpt: 'A look at brand, product discovery and choice through the FruitUp platform.',
    image: '/projects/profile-11-0.jpeg',
    content: 'The FruitUp platform combines a brand-led e-commerce experience with a goal-based catalogue for fresh-cut fruit boxes. It supports both subscription and single-purchase ordering.\n\n## Give discovery a purpose\n\nA goal-based catalogue organizes products around what customers are looking for. The website and commerce experience work together to connect brand identity with product discovery.\n\n## Support different ways to order\n\nSubscriptions and individual purchases offer different routes through the same platform. The product experience brings these choices into the ordering journey.\n\n## Connect the platform with growth\n\nDigital marketing alongside FruitUp connects content, campaigns and performance channels so the product reaches the right customers.'
  },
  {
    slug: 'from-business-problem-to-outcome',
    title: 'Six steps from problem to possibility.',
    excerpt: 'Discover, define, design, build, launch and grow—with the business at the centre.',
    image: '/projects/profile-11-1.jpeg',
    content: 'Grostage’s approach starts with the business problem and carries through to continuous improvement. Six connected stages give the work a clear direction.\n\n## Discover and define\n\nFirst, understand the business, users and objectives. Then translate the requirements into a clear strategy and scope. These stages establish what the solution needs to achieve.\n\n## Design and build\n\nCreate the experience, workflows and product architecture. Develop, integrate, test and refine the solution around that foundation.\n\n## Launch and grow\n\nDeploy the solution and prepare the business for adoption. After launch, measure, optimize, automate and continuously improve. The partnership continues as the business moves forward.'
  },
  {
    slug: 'when-a-spreadsheet-becomes-a-system',
    title: 'When a spreadsheet becomes a system.',
    excerpt: 'The signs that daily operations have outgrown shared files, and what to build next.',
    image: '/projects/profile-11-3.jpeg',
    content: 'Many businesses run on spreadsheets long after they stop fitting the way the team works. Duplicate entries, version confusion and manual reports are the usual signs.\n\n## What changes\n\nA connected system gives every team one source of truth: stock, orders, customers and reports in one place, on desktop and mobile.\n\n## The next operational stage\n\nMoving to a dedicated system connects sales, purchasing, inventory and financial tracking so work moves smoothly without repetitive data entry.'
  },
  {
    slug: 'consistency-beats-campaigns',
    title: 'Consistency beats the one big campaign.',
    excerpt: 'Why a steady, recognisable presence does more for local brands than a single launch.',
    image: '/projects/profile-13-0.jpeg',
    content: 'A single campaign can create a moment, but a consistent presence across social, search and content is what keeps a brand in mind.\n\n## Building the rhythm\n\nA clear voice, a regular publishing plan and simple measurement make growth repeatable.\n\n## Purposeful marketing\n\nAligning content with audience questions builds trust over time, turning casual impressions into long-term customer relationships.'
  }
];

const pages = [
  {
    slug: 'privacy-policy',
    title: 'Privacy Policy',
    excerpt: 'How Grostage collects, uses, and protects your information.',
    image: '/projects/profile-13-0.jpeg',
    content: 'Grostage is committed to protecting the privacy and personal data of our clients, visitors, and partners.\n\n## Information We Collect\n\nWe may collect personal details such as your name, email address, phone number, and company information when you contact us or inquire about our services.\n\n## How We Use Information\n\nInformation gathered is used exclusively to communicate regarding project inquiries, provide requested services, and enhance your experience.\n\n## Data Protection\n\nWe implement standard security safeguards to protect your data against unauthorized access, alteration, or disclosure.'
  },
  {
    slug: 'terms-of-service',
    title: 'Terms of Service',
    excerpt: 'Terms and conditions governing the use of Grostage services and website.',
    image: '/projects/profile-8-0.jpeg',
    content: 'By accessing or using the Grostage website and services, you agree to comply with and be bound by the following terms.\n\n## Scope of Services\n\nGrostage provides digital product development, software engineering, branding, and automation consulting services as outlined in project agreements.\n\n## Intellectual Property\n\nAll content, trademarks, designs, and materials displayed on this website are the intellectual property of Grostage unless otherwise specified.\n\n## Limitation of Liability\n\nGrostage is not liable for indirect or consequential damages arising from the use or inability to use our website or services.'
  }
];

const footerSetting = {
  tagline: 'Digital products. Technology. Growth.',
  email: 'info@grostage.com',
  phone: '',
  address: '',
  links: [
    { label: 'About Us', value: '/about' },
    { label: 'Services', value: '/services' },
    { label: 'Our Work', value: '/work' },
    { label: 'Blog', value: '/blog' },
    { label: 'Client Stories', value: '/client-stories' },
    { label: 'Clients', value: '/clients' },
    { label: 'Contact', value: '/contact' }
  ],
  socials: [
    { label: 'LinkedIn', value: 'https://linkedin.com/company/grostage' },
    { label: 'Instagram', value: 'https://instagram.com/grostage_' }
  ],
  copyright: '© 2026 Grostage. All rights reserved.'
};

async function seed() {
  await client.connect();
  console.log('Connected to database:', process.env.DATABASE_URL.replace(/:[^:@]*@/, ':****@'));

  // 0. Seed Admin user
  console.log('Seeding admin user...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS admins (
      id SERIAL PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);

  const adminEmail = (process.env.ADMIN_EMAIL || 'grostage@gmail.com').trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Admin@12345';
  const hashedPassword = hashPassword(adminPassword);

  await client.query(`
    INSERT INTO admins(email, password_hash)
    VALUES($1, $2)
    ON CONFLICT(email) DO UPDATE SET password_hash = EXCLUDED.password_hash
  `, [adminEmail, hashedPassword]);
  console.log(`✓ Seeded admin user: ${adminEmail}`);

  // 1. Seed Works
  console.log('Seeding works...');
  for (const w of works) {
    await client.query(`
      INSERT INTO works(title, slug, category, excerpt, content, image, image_alt, representative, gallery, tags, published)
      VALUES($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, true)
      ON CONFLICT(slug) DO UPDATE SET
        title = EXCLUDED.title,
        category = EXCLUDED.category,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        image = EXCLUDED.image,
        image_alt = EXCLUDED.image_alt,
        representative = EXCLUDED.representative,
        gallery = EXCLUDED.gallery,
        tags = EXCLUDED.tags,
        published = EXCLUDED.published
    `, [
      w.title, w.slug, w.category, w.excerpt, w.content, w.image,
      w.image_alt || '', Boolean(w.representative), w.gallery || '', w.tags
    ]);
  }
  console.log(`✓ Seeded ${works.length} works`);

  // 2. Seed Posts
  console.log('Seeding posts...');
  for (const p of posts) {
    await client.query(`
      INSERT INTO posts(title, slug, excerpt, content, image, published)
      VALUES($1, $2, $3, $4, $5, true)
      ON CONFLICT(slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        image = EXCLUDED.image,
        published = EXCLUDED.published
    `, [p.title, p.slug, p.excerpt, p.content, p.image]);
  }
  console.log(`✓ Seeded ${posts.length} posts`);

  // 3. Seed Pages
  console.log('Seeding pages...');
  for (const pgItem of pages) {
    await client.query(`
      INSERT INTO pages(title, slug, excerpt, content, image, published)
      VALUES($1, $2, $3, $4, $5, true)
      ON CONFLICT(slug) DO UPDATE SET
        title = EXCLUDED.title,
        excerpt = EXCLUDED.excerpt,
        content = EXCLUDED.content,
        image = EXCLUDED.image,
        published = EXCLUDED.published
    `, [pgItem.title, pgItem.slug, pgItem.excerpt, pgItem.content, pgItem.image]);
  }
  console.log(`✓ Seeded ${pages.length} pages`);

  // 4. Seed Settings (Footer)
  console.log('Seeding settings...');
  await client.query(`
    INSERT INTO settings(key, value)
    VALUES('footer', $1::jsonb)
    ON CONFLICT(key) DO UPDATE SET value = EXCLUDED.value
  `, [JSON.stringify(footerSetting)]);
  console.log('✓ Seeded footer settings');

  // 5. Seed Testimonials
  console.log('Seeding testimonials...');
  await client.query(`
    CREATE TABLE IF NOT EXISTS testimonials (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      role TEXT DEFAULT '',
      quote TEXT NOT NULL,
      initials TEXT DEFAULT '',
      company TEXT DEFAULT '',
      logo TEXT DEFAULT '',
      created_at TIMESTAMPTZ DEFAULT now()
    )
  `);
  await client.query(`ALTER TABLE testimonials ADD COLUMN IF NOT EXISTS logo TEXT DEFAULT ''`);

  await client.query(`TRUNCATE TABLE testimonials RESTART IDENTITY`);
  for (const t of testimonials) {
    await client.query(`
      INSERT INTO testimonials(name, role, quote, initials, company, logo)
      VALUES($1, $2, $3, $4, $5, $6)
    `, [t.name, t.role, t.quote, t.initials || '', t.company || t.name, t.logo || '']);
  }
  console.log(`✓ Seeded ${testimonials.length} testimonials`);

  await client.end();
  console.log('\nAll seed operations completed successfully.');
}

seed().catch(err => {
  console.error('Seed error:', err);
  process.exit(1);
});
