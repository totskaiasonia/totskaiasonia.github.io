export type Theme = 'medsahra' | 'boucherie' | 'tagsly' | 'olive';

export type Project = {
  slug: string;
  index: string;
  code: string;
  title: string;
  liveName: string;
  subtitle: string;
  tagline: string;
  year: string;
  locale: string;
  role: string;
  stack: string[];
  problem: string;
  solution: string;
  pullQuote: string;
  highlights: string[];
  surfaces: string[];
  links: { label: string; href: string }[];
  palette: { name: string; hex: string }[];
  theme: Theme;
  poster: string;
  reel: string;
};

export const projects: Project[] = [
  {
    slug: 'medsahra',
    index: '01',
    code: 'MSH · GCC',
    title: 'MedSahra',
    liveName: 'medsahra.com',
    subtitle: 'B2B medtech marketplace for the Gulf',
    tagline: 'Equipment, services, and healthcare businesses — one trusted catalog.',
    year: '2025–2026',
    locale: 'EN · AR',
    role: 'Full-stack (MedMarketAE): Next.js product, Express API, Stripe subscriptions, Vite admin/compliance.',
    stack: [
      'Next.js 16 App Router',
      'React 19',
      'Tailwind v4',
      'next-intl',
      'TanStack Query · Zustand',
      'Express · MongoDB',
      'Stripe Elements',
      'Vite admin panel',
    ],
    problem:
      'GCC healthcare commerce still runs on trade shows, spreadsheets, and private networks. Clinics cannot compare equipment, services, or acquisition targets in one bilingual, compliance-aware place.',
    solution:
      'MedSahra is a subscription-gated B2B platform: SEO public pages, searchable listings, in-platform chat, AI comparison, seller tools, ads, and role-split admin (admin / support / compliance). Built as Next.js BFF + REST API + separate ops panel.',
    pullQuote:
      'A middle layer for a healthcare market projected to nearly double toward 2030.',
    highlights: [
      'SSR/ISR listings with locale routing (en/ar) and BFF fetch patterns',
      'Stripe subscriptions, webhooks, promotions, and ads checkout',
      'JWT auth (cookies + bearer), verification documents, seller profiles',
      'In-platform chat, favorites, notes, inquiry history',
      'Internal queues: users, listings, payments, analytics, ads manager',
    ],
    surfaces: ['Public marketing', 'Catalog & sellers', 'Buyer/seller dashboards', 'Admin · compliance · support'],
    links: [
      { label: 'medsahra.com', href: 'https://medsahra.com' },
      { label: 'GitHub MedMarketAE', href: 'https://github.com/MedMarketAE' },
    ],
    palette: [
      { name: 'Primary', hex: '#0071E3' },
      { name: 'Ink', hex: '#222225' },
      { name: 'Warm paper', hex: '#F7F6F4' },
      { name: 'Premium', hex: '#EDE9E4' },
    ],
    theme: 'medsahra',
    poster: '/captures/medsahra-hero.jpg',
    reel: '/captures/medsahra-reel.webm',
  },
  {
    slug: 'la-boucherie',
    index: '02',
    code: 'LBK · DXB',
    title: 'La Boucherie',
    liveName: 'laboucheriemealplan.ae',
    subtitle: 'Premium kosher meal-plan subscriptions, Dubai',
    tagline: 'Restaurant-quality kosher meals, delivered daily.',
    year: '2025–2026',
    locale: 'EN · HE · RU · FR',
    role: 'Product front-end & delivery flows (Kosher-Food): Vite storefront, NestJS API, Stripe, live ops board.',
    stack: [
      'Vite · React 19',
      'React Router 7',
      'Tailwind v4',
      'Framer Motion',
      'NestJS 11',
      'MongoDB',
      'Stripe',
      'Socket.IO',
    ],
    problem:
      'Dubai’s kosher audience needs certification trust, calorie/plan configuration, Shabbat rules, and reliable daily delivery — not a generic meal-kit template.',
    solution:
      'La Boucherie Meal Plan is a subscription storefront: plan configurator, weekly menus, kosher certificate surface, checkout + account, support tickets, and an admin delivery board. Copy and photography lead with “Healthy Kosher Meals Delivered.”',
    pullQuote: 'Strictly kosher, restaurant-quality meal plans — delivered across Dubai.',
    highlights: [
      'Plan configurator, weekly menus, calorie logic, Shabbat add-ons',
      'Stripe checkout, account subscriptions, delivery addresses (UAE)',
      'Kosher certificate PDF viewer and legal document set',
      'i18n: English, Hebrew, Russian, French',
      'Admin: orders, subscriptions, daily delivery board',
    ],
    surfaces: ['Marketing hero', 'Plan configurator', 'Account & support', 'Kitchen/ops admin'],
    links: [{ label: 'laboucheriemealplan.ae', href: 'https://laboucheriemealplan.ae/' }],
    palette: [
      { name: 'Sage', hex: '#6B9E5A' },
      { name: 'Gold', hex: '#D4AF37' },
      { name: 'Citrus', hex: '#FF6B35' },
      { name: 'Ink', hex: '#2D2D2D' },
    ],
    theme: 'boucherie',
    poster: '/captures/boucherie-hero.jpg',
    reel: '/captures/boucherie-reel.webm',
  },
  {
    slug: 'tags-ly',
    index: '03',
    code: 'TLY',
    title: 'tags.ly',
    liveName: 'tags.ly',
    subtitle: 'UTM builder, short links, QR, AI analytics',
    tagline: 'From campaign idea to click intelligence in thirty seconds.',
    year: '2025–2026',
    locale: 'EN · i18n',
    role: 'Full-stack (tags.ly): Vite marketing + app, Express/Mongo API, Google OAuth, OpenAI insights.',
    stack: [
      'Vite · React 19',
      'React Router',
      'i18next',
      'Recharts',
      'Express',
      'MongoDB',
      'Google OAuth',
      'OpenAI',
    ],
    problem:
      'Marketers still assemble UTMs in spreadsheets, then lose attribution across short links, QR, and paid channels — no shared presets, no campaign structure, weak AI on the click stream.',
    solution:
      'tags.ly is a one-click UTM builder with saved presets, branded short URLs, QR, project/campaign folders, geo/device/referrer stats, and AI recommendations. Google sign-in, partner program, and a separate admin panel.',
    pullQuote: 'Click-to-select tags. Shorten. QR. Then let AI point at the growth channel.',
    highlights: [
      'Smart UTM builder with frequency-sorted tags and personal presets',
      'Short links + QR (html-to-image / jsPDF exports)',
      'Analytics: countries, devices, time windows, UTM segments',
      'AI insights via OpenAI; maps via react-simple-maps',
      'Google OAuth, referral codes, admin ops',
    ],
    surfaces: ['Marketing landing', 'Link studio', 'Analytics + AI', 'Admin'],
    links: [{ label: 'tags.ly', href: 'https://tags.ly/' }],
    palette: [
      { name: 'Signal', hex: '#2563EB' },
      { name: 'Ink', hex: '#0F172A' },
      { name: 'Grid', hex: '#E2E8F0' },
      { name: 'Accent', hex: '#22D3EE' },
    ],
    theme: 'tagsly',
    poster: '/captures/tagsly-hero.jpg',
    reel: '/captures/tagsly-reel.webm',
  },
  {
    slug: 'family-olive-club',
    index: '04',
    code: 'FOC · GEO',
    title: 'Family Olive Club',
    liveName: 'familyoliveclub.com',
    subtitle: 'Olive agribusiness + exclusive real estate',
    tagline: 'A path into profitable olive groves and private land offerings.',
    year: '2025–2026',
    locale: 'Multi',
    role: 'Full-stack (FamilyOliveClub): Next.js marketing + auth, Prisma/Postgres, Three.js globe, GSAP, Cloudinary.',
    stack: [
      'Next.js 16',
      'React 19',
      'Tailwind v4',
      'Prisma · PostgreSQL',
      'GSAP · Framer Motion',
      'Three.js globe',
      'Cloudinary',
      'JWT · Nodemailer',
    ],
    problem:
      'Olive investment and land offerings are sold through PDFs and fairs. Buyers need a cinematic, trustworthy path: regions, lots, questionnaires, private offerings, and an admin for media and applicants.',
    solution:
      'Family Olive Club is a Next.js site with a globe of regions, exhibition/events storytelling, private offerings, questionnaires, news, and an admin for lots, users, and Cloudinary media. Beige paper + acid yellow/green brand system.',
    pullQuote: 'Your path to a profitable olive business and exclusive real estate.',
    highlights: [
      'Public cinematic home: hero, exhibitions, regions globe, FAQ',
      'Auth, questionnaires, private offerings, offer pages',
      'Prisma lots/news/users; Cloudinary media pipeline',
      'Three.js globe + GSAP transitions',
      'Admin: lots, questionnaires, news, media, users',
    ],
    surfaces: ['Cinematic home', 'Globe of regions', 'Offer / questionnaire', 'Admin CMS'],
    links: [{ label: 'familyoliveclub.com', href: 'https://familyoliveclub.com/' }],
    palette: [
      { name: 'Acid yellow', hex: '#EAFF00' },
      { name: 'Olive leaf', hex: '#9AD768' },
      { name: 'Beige', hex: '#F1E8DA' },
      { name: 'Grove', hex: '#1D4B01' },
    ],
    theme: 'olive',
    poster: '/captures/olive-hero.jpg',
    reel: '/captures/olive-reel.webm',
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
