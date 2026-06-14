// Digital Vistara - Main Website Client Engine
// Integrates API Data Hydration, Socket.io Real-time Reloads, and GSAP Animations

// --- GLOBAL STATIC FALLBACK DATASETS (Used in static/preview mode when backend is inactive) ---
window.DEFAULT_SERVICES = [
  { id: 1, title: 'Growth Strategy', description: 'Data-driven business analysis and scalable growth roadmap designed to accelerate market acquisition.', icon: 'trending-up', price: 'Custom', sort_order: 1 },
  { id: 2, title: 'Website Development', description: 'High-speed, premium, search-optimized websites and web ecosystems engineered with modern visuals.', icon: 'code', price: 'Starting at $1,200', sort_order: 2 },
  { id: 3, title: 'Performance Marketing', description: 'ROI-focused paid campaigns on Meta, Google, and LinkedIn targeting qualified buyer personas.', icon: 'activity', price: 'Monthly Retainer', sort_order: 3 },
  { id: 4, title: 'Branding & Creative Design', description: 'Premium corporate identity development including logos, typography packages, and UI/UX guides.', icon: 'feather', price: 'Custom', sort_order: 4 },
  { id: 5, title: 'Social Media Growth', description: 'Content planning, authority-building, and organic distribution frameworks that turn profiles into revenue channels.', icon: 'users', price: 'Monthly Retainer', sort_order: 5 },
  { id: 6, title: 'SEO & Content Marketing', description: 'High-authority search engine optimization and quality blog writing designed to drive organic inbound leads.', icon: 'search', price: 'Monthly Retainer', sort_order: 6 },
  { id: 7, title: 'Local SEO', description: 'Optimizing Google Maps, directory citations, and locally targeted reviews to command dominant search positioning.', icon: 'map-pin', price: 'Starting at $400', sort_order: 7 },
  { id: 8, title: 'Video Editing & Reels Production', description: 'Premium vertical video scripting, filming blueprints, dynamic editing, and visual hooks tailored for virality.', icon: 'video', price: 'Starting at $600', sort_order: 8 },
  { id: 9, title: 'Automation & CRM Integration', description: 'Eliminating manual task bottlenecks by connecting HubSpot, Salesforce, or custom CRMs with visual triggers.', icon: 'cpu', price: 'Custom', sort_order: 9 }
];

window.DEFAULT_TEAM = [
  { id: 1, name: 'Monu Kumawat', designation: 'Founder & COO', bio: 'Operational systems expert orchestrating delivery cycles, lead management systems, and client success workflows.', photo: '/assets/images/team/monu.jpg', linkedin_url: 'https://linkedin.com/in/monukumawat', sort_order: 1 },
  { id: 2, name: 'Nikhil Anand', designation: 'Founder CEO & CTO', bio: 'Tech leader architecting database systems, enterprise infrastructure, API architecture, and digital engineering.', photo: '/assets/images/team/nikhil.jpg', linkedin_url: 'https://linkedin.com/in/nikhilanand', sort_order: 2 },
  { id: 3, name: 'Gyan Prakash Yadav', designation: 'Founder & CMO', bio: 'Marketing mastermind crafting scaling pipelines, high-ROI marketing strategies, and viral growth loops.', photo: '/assets/images/team/gyan.jpg', linkedin_url: 'https://linkedin.com/in/gyanprakash', sort_order: 3 }
];

window.DEFAULT_TESTIMONIALS = [
  { id: 1, client_name: 'Rajesh Sharma', client_company: 'Sharma Logistics', client_image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&q=80', rating: 5, review_text: 'Digital Vistara transformed our legacy website into a modern lead-generation machine. Our inbound inquires increased by 140%!' },
  { id: 2, client_name: 'Anya Singh', client_company: 'Vibe Wearables', client_image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&q=80', rating: 5, review_text: 'The performance marketing execution by the team was outstanding. They lowered our customer acquisition cost (CAC) by 35%.' },
  { id: 3, client_name: 'Devendra Verma', client_company: 'Nexa FinTech', client_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&q=80', rating: 5, review_text: 'Highly professional and detail-oriented developers. Their technical approach to CRM automations saved our sales team hours.' }
];

window.DEFAULT_PORTFOLIO_CATEGORIES = [
  { id: 1, name: 'Web Development', slug: 'web-development' },
  { id: 2, name: 'Branding', slug: 'branding' },
  { id: 3, name: 'Digital Marketing', slug: 'digital-marketing' }
];

window.DEFAULT_PORTFOLIO = [
  {
    id: 101,
    title: "Vishal Photos",
    description: "Premium photography booking and portfolio showcase application.",
    image: "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80",
    project_url: "https://vishalphotos.com",
    category_id: 1,
    category_name: "Web Development",
    category_slug: "web-development",
    sort_order: 1
  },
  {
    id: 102,
    title: "DOP Film City",
    description: "Cinematic film studio production workflow and studio space booking system.",
    image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    project_url: "#",
    category_id: 1,
    category_name: "Web Development",
    category_slug: "web-development",
    sort_order: 2
  },
  {
    id: 103,
    title: "Nexa E-Commerce",
    description: "Multi-channel campaigns driving high impressions and 3.2x ROI gains.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    project_url: "#",
    category_id: 3,
    category_name: "Digital Marketing",
    category_slug: "digital-marketing",
    sort_order: 3
  },
  {
    id: 104,
    title: "FinTech Automation Pipeline",
    description: "Enterprise CRM integrations eliminating manual customer sync drag.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    project_url: "#",
    category_id: 1,
    category_name: "Web Development",
    category_slug: "web-development",
    sort_order: 4
  },
  {
    id: 105,
    title: "Logistics Brand Design",
    description: "Corporate visual identities, brand style guides, and layout assets.",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    project_url: "#",
    category_id: 2,
    category_name: "Branding",
    category_slug: "branding",
    sort_order: 5
  }
];

window.DEFAULT_BLOGS_CATEGORIES = [
  { id: 1, name: 'Growth Strategy', slug: 'growth-strategy' },
  { id: 2, name: 'Tech & Dev', slug: 'tech-and-dev' },
  { id: 3, name: 'Marketing', slug: 'marketing' }
];

window.DEFAULT_BLOGS = [
  {
    id: 201,
    title: "Mastering CRM Automation in 2026",
    slug: "mastering-crm-automation-2026",
    summary: "Discover how to eliminate operational drag by connecting Salesforce or HubSpot with modern triggers.",
    content: "<p>In the digital age, operational efficiency is the dividing line between high-margin scaling and structural stagnation. Automated CRM integrations allow your sales and client success pipelines to flow smoothly without manual data entries.</p><p>By setting up direct visual triggers between your lead ingestion forms (like the ones built on Digital Vistara platforms) and platforms like HubSpot or Salesforce, contact records are instantly created, tagged, and routed to the correct account manager. Micro-automations, such as automated calendar invite senders and WhatsApp follow-up triggers, guarantee that leads are contacted in under 5 minutes, boosting close rates by up to 80%.</p>",
    featured_image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80",
    category_name: "Growth Strategy",
    category_slug: "growth-strategy",
    views: 1420,
    created_at: "2026-06-01T10:00:00Z"
  },
  {
    id: 202,
    title: "Designing Websites for 90+ Lighthouse Scores",
    slug: "designing-for-lighthouse-90",
    summary: "Speed is a primary search engine ranking factor. Here is our checklist for high-fidelity performance.",
    content: "<p>Search engine algorithms prioritize user experience above almost all else. A latency spike of 1 second can cost B2B brands up to 20% in conversion drops. Designing for 90+ Lighthouse score is not just a badge of honor; it is a financial necessity.</p><p>To build ultra-fast, premium layouts, developers must transition from bulky framework layers to lightweight vanilla compilation. Compressing image assets into WebP/AVIF formats, utilizing lazy-loading, minifying scripts, and employing server-side meta injection (rather than heavy client-side CSR) ensures that your pages load in under 500 milliseconds. Digital Vistara follows this speed-first architecture on all static and dynamic builds.</p>",
    featured_image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80",
    category_name: "Tech & Dev",
    category_slug: "tech-and-dev",
    views: 980,
    created_at: "2026-06-05T12:00:00Z"
  },
  {
    id: 203,
    title: "Performance Marketing Strategies That Scale",
    slug: "performance-marketing-strategies",
    summary: "How to lower your customer acquisition cost (CAC) while expanding overall conversions.",
    content: "<p>Media buying is a highly competitive arena. Throwing ad budget at generic lookalike audiences leads to rising acquisition costs. To scale profitably, marketing campaigns must rely on structured, persona-driven landing experiences and continuous creative testing.</p><p>By mapping meta campaigns to custom, high-speed landing pages containing specific copywriting hooks, conversions increase dramatically. Adding automated retargeting loops across Google Display Network and LinkedIn guarantees that interested prospects remain inside your sales ecosystem. At Digital Vistara, our CMO Gyan Yadav specializes in optimizing these loops to achieve average 3.2x ROI multipliers for client brands.</p>",
    featured_image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80",
    category_name: "Marketing",
    category_slug: "marketing",
    views: 1150,
    created_at: "2026-06-08T09:30:00Z"
  },
  {
    id: 204,
    title: "Why Branding Dictates Market Valuation",
    slug: "branding-and-market-valuation",
    summary: "Explore how premium design builds consumer trust and allows startups to charge higher margins.",
    content: "<p>A company's brand is not just a logo—it is the sum total of consumer trust, perceived authority, and design premium. Companies with clean, luxury visual identities command up to 45% higher price margins than generic competitors.</p><p>When a startup presents an award-winning UI/UX interface with soft parallax scrolling, smooth GSAP entries, and premium typography, it signals quality. This aesthetic trust translates directly to perceived business stability, enabling brands to scale contract sizes and attract venture capital easily. Digital Vistara designs custom branding packages tailored to reflect high-end corporate presence.</p>",
    featured_image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80",
    category_name: "Growth Strategy",
    category_slug: "growth-strategy",
    views: 840,
    created_at: "2026-06-10T14:15:00Z"
  },
  {
    id: 205,
    title: "The Future of Reels & Organic Video Distribution",
    slug: "future-of-reels-organic",
    summary: "Leverage vertical short-form video hooks to command organic brand awareness in search maps.",
    content: "<p>Short-form vertical video (Instagram Reels, YouTube Shorts, TikToks) is the most dominant organic reach engine in the world. Brands that script and produce high-hooks content can acquire customers without paying a single dollar in ad spend.</p><p>The key to short-form virality is visual speed and structural hooks. Editing vertical reels with dynamic text callouts, sound effects, and fast pacing holds viewer retention rates. When paired with local map SEO, short-form videos create massive organic pipelines for retail brands and local services alike.</p>",
    featured_image: "https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80",
    category_name: "Marketing",
    category_slug: "marketing",
    views: 1730,
    created_at: "2026-06-12T16:00:00Z"
  }
];

let socket;
let websiteSettings = {};

document.addEventListener('DOMContentLoaded', () => {

  // 1. Initialize GSAP ScrollTrigger
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);
  }

  // 2. Fetch and Hydrate Global Configurations
  fetchSettings();

  // 3. Setup Socket.io Real-Time Synchronization
  initRealtimeSync();

  // 4. Initialize Mobile Navigation Menu
  initMobileNav();
});

/**
 * Initialize Socket.io Connection & Listeners for Real-Time CMS Updates
 */
function initRealtimeSync() {
  if (typeof io === 'undefined') {
    console.warn('Socket.io client library not loaded. Real-time updates disabled.');
    return;
  }

  socket = io();

  socket.on('connect', () => {
    console.log('Real-Time Engine: Connected to Digital Vistara Socket server.');
  });

  // Listen for changes emitted by Admin CRUD controllers
  socket.on('services_update', (data) => {
    console.log('Real-Time Update: Services changed', data);
    showLiveToast('Services section updated live!');
    if (typeof loadServices === 'function') loadServices();
  });

  socket.on('portfolio_update', (data) => {
    console.log('Real-Time Update: Portfolio changed', data);
    showLiveToast('Portfolio items updated live!');
    if (typeof loadPortfolio === 'function') loadPortfolio();
  });

  socket.on('blogs_update', (data) => {
    console.log('Real-Time Update: Blogs updated', data);
    showLiveToast('Blog articles updated live!');
    if (typeof loadBlogs === 'function') loadBlogs();
  });

  socket.on('team_update', (data) => {
    console.log('Real-Time Update: Team updated', data);
    showLiveToast('Team directory updated live!');
    if (typeof loadTeamMembers === 'function') loadTeamMembers();
  });

  socket.on('testimonials_update', (data) => {
    console.log('Real-Time Update: Testimonials updated', data);
    showLiveToast('Client reviews updated live!');
    if (typeof loadTestimonials === 'function') loadTestimonials();
  });

  socket.on('settings_update', (data) => {
    console.log('Real-Time Update: Settings changed', data);
    showLiveToast('Website configurations updated live!');
    applySettings(data.settings);
  });
}

/**
 * Show a sleek visual toast when a section is hot-reloaded
 */
function showLiveToast(message) {
  let toast = document.getElementById('live-cms-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'live-cms-toast';
    toast.className = 'fixed bottom-5 right-5 z-50 glass-panel px-5 py-3 rounded-full flex items-center gap-3 border border-[#8B5C7E]/30 text-sm font-medium shadow-lg transition-all transform translate-y-20 opacity-0';
    document.body.appendChild(toast);
  }

  toast.innerHTML = `
    <span class="w-2.5 h-2.5 rounded-full bg-[#2F7D5B] animate-ping"></span>
    <span class="text-[#8B5C7E]">${message}</span>
  `;

  // Animate toast in and out using GSAP
  if (typeof gsap !== 'undefined') {
    const tl = gsap.timeline();
    tl.to(toast, { translateY: 0, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' })
      .to(toast, { translateY: 100, opacity: 0, delay: 3, duration: 0.5, ease: 'power2.in' });
  } else {
    toast.classList.remove('translate-y-20', 'opacity-0');
    setTimeout(() => toast.classList.add('translate-y-20', 'opacity-0'), 3000);
  }
}

/**
 * Fetch site settings from API
 */
async function fetchSettings() {
  try {
    const res = await fetch('/api/settings');
    const json = await res.json();
    if (json.success) {
      websiteSettings = json.data;
      applySettings(websiteSettings);
    }
  } catch (error) {
    console.error('Error fetching settings:', error);
  }
}

/**
 * Apply website settings variables and copy texts directly onto the DOM
 */
function applySettings(settings) {
  // Hero Section Header updates
  const heroTitle = document.getElementById('hero-title');
  if (heroTitle && settings.hero_title) heroTitle.innerText = settings.hero_title;

  const heroSubtitle = document.getElementById('hero-subtitle');
  if (heroSubtitle && settings.hero_subtitle) heroSubtitle.innerText = settings.hero_subtitle;

  const heroCtaPrimary = document.getElementById('hero-cta-primary');
  if (heroCtaPrimary && settings.hero_cta_primary) heroCtaPrimary.innerText = settings.hero_cta_primary;

  const heroCtaSecondary = document.getElementById('hero-cta-secondary');
  if (heroCtaSecondary && settings.hero_cta_secondary) heroCtaSecondary.innerText = settings.hero_cta_secondary;

  // About Section text updates
  const aboutTitle = document.getElementById('about-title');
  if (aboutTitle && settings.about_title) aboutTitle.innerText = settings.about_title;

  const aboutText = document.getElementById('about-text');
  if (aboutText && settings.about_text) aboutText.innerText = settings.about_text;

  // Footer / Header info updates
  const footerEmail = document.getElementById('footer-email');
  if (footerEmail && settings.contact_email) {
    footerEmail.innerText = settings.contact_email;
    footerEmail.href = `mailto:${settings.contact_email}`;
  }

  // Update multiple phone fields if available
  const footerPhone1 = document.getElementById('footer-phone-1');
  if (footerPhone1 && settings.contact_phone_1) {
    footerPhone1.innerText = `+91 ${settings.contact_phone_1}`;
    footerPhone1.href = `tel:${settings.contact_phone_1}`;
  }
  const footerPhone2 = document.getElementById('footer-phone-2');
  if (footerPhone2 && settings.contact_phone_2) {
    footerPhone2.innerText = `+91 ${settings.contact_phone_2}`;
    footerPhone2.href = `tel:${settings.contact_phone_2}`;
  }
  const footerPhone3 = document.getElementById('footer-phone-3');
  if (footerPhone3 && settings.contact_phone_3) {
    footerPhone3.innerText = `+91 ${settings.contact_phone_3}`;
    footerPhone3.href = `tel:${settings.contact_phone_3}`;
  }

  // Social handles
  const socialLinks = {
    'social-linkedin': settings.social_linkedin,
    'social-instagram': settings.social_instagram,
    'social-facebook': settings.social_facebook,
    'social-twitter': settings.social_twitter
  };

  Object.keys(socialLinks).forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      if (socialLinks[id]) {
        el.href = socialLinks[id];
        el.style.display = '';
      } else {
        el.style.display = 'none';
      }
    }
  });

  // Inject user custom colors if overridden
  if (settings.brand_primary_purple) {
    document.documentElement.style.setProperty('--primary-purple', settings.brand_primary_purple);
  }
  if (settings.brand_accent_green) {
    document.documentElement.style.setProperty('--accent-green', settings.brand_accent_green);
  }
}

/**
 * Standard GSAP entrance animation presets for cards and containers
 */
function animateEntrance(selector, stagger = 0.15) {
  if (typeof gsap === 'undefined' || !gsap.utils.toArray(selector).length) return;

  gsap.from(selector, {
    scrollTrigger: {
      trigger: selector,
      start: 'top 85%',
      toggleActions: 'play none none none'
    },
    y: 50,
    opacity: 0,
    duration: 0.8,
    stagger: stagger,
    ease: 'power3.out'
  });
}

/**
 * Mobile Hamburger Menu toggler
 */
function initMobileNav() {
  const menuBtn = document.getElementById('menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');

  if (!menuBtn || !mobileMenu) return;

  menuBtn.addEventListener('click', () => {
    const isOpen = menuBtn.classList.contains('menu-open');
    if (isOpen) {
      menuBtn.classList.remove('menu-open');
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    } else {
      menuBtn.classList.add('menu-open');
      mobileMenu.classList.remove('hidden');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close when link clicked
  const mobileLinks = mobileMenu.querySelectorAll('a');
  mobileLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuBtn.classList.remove('menu-open');
      mobileMenu.classList.add('hidden');
      document.body.style.overflow = '';
    });
  });
}

/**
 * Utility: Render feather icons SVG template paths dynamically based on a slug identifier
 */
function getIconSvg(iconName) {
  const icons = {
    'trending-up': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline><polyline points="17 6 23 6 23 12"></polyline></svg>`,
    'code': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="16 18 22 12 16 6"></polyline><polyline points="8 6 2 12 8 18"></polyline></svg>`,
    'activity': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"></polyline></svg>`,
    'feather': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.24 12.24a6 6 0 0 0-8.49-8.49L5 10.5V19h8.5z"></path><line x1="16" y1="8" x2="2" y2="22"></line><line x1="17.5" y1="15" x2="9" y2="15"></line></svg>`,
    'users': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>`,
    'search': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`,
    'map-pin': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path><circle cx="12" cy="10" r="3"></circle></svg>`,
    'video': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>`,
    'cpu': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect><rect x="9" y="9" width="6" height="6"></rect><line x1="9" y1="1" x2="9" y2="4"></line><line x1="15" y1="1" x2="15" y2="4"></line><line x1="9" y1="20" x2="9" y2="23"></line><line x1="15" y1="20" x2="15" y2="23"></line><line x1="20" y1="9" x2="23" y2="9"></line><line x1="20" y1="15" x2="23" y2="15"></line><line x1="1" y1="9" x2="4" y2="9"></line><line x1="1" y1="15" x2="4" y2="15"></line></svg>`,
    'briefcase': `<svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path></svg>`
  };

  return icons[iconName] || icons['briefcase'];
}
