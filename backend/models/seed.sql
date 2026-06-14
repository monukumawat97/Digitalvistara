-- Seed Data for Digital Vistara
-- Sets up default content, settings, and structure

-- Web Settings Group: general
INSERT INTO website_settings (setting_key, setting_value, group_name) VALUES 
('site_name', 'Digital Vistara', 'general'),
('site_logo', '/assets/images/logo.png', 'general'),
('contact_email', 'digitalvistara.in@gmail.com', 'general'),
('contact_phone_1', '9772566884', 'general'),
('contact_phone_2', '8809092662', 'general'),
('contact_phone_3', '8755607281', 'general'),
('contact_address', 'Jaipur, Rajasthan, India', 'general');

-- Web Settings Group: hero
INSERT INTO website_settings (setting_key, setting_value, group_name) VALUES 
('hero_title', 'Transform Your Business Into A Powerful Digital Brand', 'hero'),
('hero_subtitle', 'We help businesses grow faster through strategy, technology, marketing, branding, and digital transformation.', 'hero'),
('hero_cta_primary', 'Start Growing', 'hero'),
('hero_cta_secondary', 'Book Consultation', 'hero');

-- Web Settings Group: about
INSERT INTO website_settings (setting_key, setting_value, group_name) VALUES 
('about_title', 'We Don’t Just Build Brands — We Build Digital Growth Systems', 'about'),
('about_text', 'Digital Vistara helps startups and businesses scale through modern technology, branding, automation, and digital marketing solutions. Our methodology aligns strategy, design, and analytics to capture market share and drive scalable revenues.', 'about');

-- Web Settings Group: socials
INSERT INTO website_settings (setting_key, setting_value, group_name) VALUES 
('social_linkedin', 'https://linkedin.com/company/digitalvistara', 'socials'),
('social_instagram', 'https://instagram.com/digitalvistara', 'socials'),
('social_facebook', 'https://facebook.com/digitalvistara', 'socials'),
('social_twitter', 'https://twitter.com/digitalvistara', 'socials');

-- Web Settings Group: seo
INSERT INTO website_settings (setting_key, setting_value, group_name) VALUES 
('seo_meta_title', 'Digital Vistara | Premium Digital Growth Agency', 'seo'),
('seo_meta_description', 'Digital Vistara is a premium growth agency providing top-tier strategy, website development, branding, automation, performance marketing, and digital transformation solutions.', 'seo'),
('seo_meta_keywords', 'digital marketing, website development, branding agency, growth strategy, SEO, CRM automation, reels production', 'seo');

-- Blog Categories
INSERT INTO blog_categories (name, slug) VALUES 
('Growth Strategy', 'growth-strategy'),
('Tech & Dev', 'tech-and-dev'),
('Marketing', 'marketing');

-- Portfolio Categories
INSERT INTO portfolio_categories (name, slug) VALUES 
('Web Development', 'web-development'),
('Branding', 'branding'),
('Digital Marketing', 'digital-marketing');

-- Services Seed
INSERT INTO services (title, description, icon, price, sort_order) VALUES 
('Growth Strategy', 'Data-driven business analysis and scalable growth roadmap designed to accelerate market acquisition and expansion.', 'trending-up', 'Custom', 1),
('Website Development', 'High-speed, premium, search-optimized websites and web ecosystems engineered with modern visuals and UX layouts.', 'code', 'Starting at $1,200', 2),
('Performance Marketing', 'ROI-focused paid campaigns on Meta, Google, and LinkedIn targeting qualified buyer personas to boost conversions.', 'activity', 'Monthly Retainer', 3),
('Branding & Creative Design', 'Premium corporate identity development including logos, typography packages, UI/UX guides, and marketing assets.', 'feather', 'Custom', 4),
('Social Media Growth', 'Content planning, authority-building, and organic distribution frameworks that turn profiles into revenue channels.', 'users', 'Monthly Retainer', 5),
('SEO & Content Marketing', 'High-authority search engine optimization and quality blog writing designed to drive organic inbound customer inquiries.', 'search', 'Monthly Retainer', 6),
('Local SEO', 'Optimizing Google Maps, directory citations, and locally targeted reviews to command dominant search positioning in your region.', 'map-pin', 'Starting at $400', 7),
('Video Editing & Reels Production', 'Premium vertical video scripting, filming blueprints, dynamic editing, and visual hooks tailored to capture viral views.', 'video', 'Starting at $600', 8),
('Automation & CRM Integration', 'Eliminating manual task bottlenecks by connecting HubSpot, Salesforce, or custom CRMs with visual triggers and email automations.', 'cpu', 'Custom', 9);

-- Team Members Seed
INSERT INTO team_members (name, designation, bio, photo, linkedin_url, sort_order) VALUES 
('Monu Kumawat', 'Founder & COO', 'Operational systems expert orchestrating delivery cycles, lead management systems, and client success workflows.', '/assets/images/team/monu.jpg', 'https://linkedin.com/in/monukumawat', 1),
('Nikhil Anand', 'Founder CEO & CTO', 'Tech leader architecting database systems, enterprise infrastructure, API architecture, and digital engineering.', '/assets/images/team/nikhil.jpg', 'https://linkedin.com/in/nikhilanand', 2),
('Gyan Prakash Yadav', 'Founder & CMO', 'Marketing mastermind crafting scaling pipelines, high-ROI marketing strategies, and viral growth loops.', '/assets/images/team/gyan.jpg', 'https://linkedin.com/in/gyanprakash', 3);

-- Testimonials Seed
INSERT INTO testimonials (client_name, client_company, rating, review_text) VALUES 
('Rajesh Sharma', 'Sharma Logistics', 5, 'Digital Vistara transformed our legacy website into a modern lead-generation machine. Our inbound inquires increased by 140% in just two months!'),
('Anya Singh', 'Vibe Wearables', 5, 'The performance marketing execution by the team was outstanding. They lowered our customer acquisition cost (CAC) by 35% while scaling overall sales volume.'),
('Devendra Verma', 'Nexa FinTech', 5, 'Highly professional and detail-oriented developers. Their technical approach to branding and CRM automations saved our sales team hours of manual data entry.');

-- Seed Portfolio Projects
INSERT INTO portfolio (category_id, title, description, image, project_url, sort_order) VALUES 
((SELECT id FROM portfolio_categories WHERE slug = 'web-development'), 'Vishal Photos', 'Premium photography booking and portfolio showcase application.', 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80', 'https://vishalphotos.com', 1),
((SELECT id FROM portfolio_categories WHERE slug = 'web-development'), 'DOP Film City', 'Cinematic film studio production workflow and studio space booking system.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80', '#', 2),
((SELECT id FROM portfolio_categories WHERE slug = 'digital-marketing'), 'Nexa E-Commerce', 'Multi-channel campaigns driving high impressions and 3.2x ROI gains.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', '#', 3),
((SELECT id FROM portfolio_categories WHERE slug = 'web-development'), 'FinTech Automation Pipeline', 'Enterprise CRM integrations eliminating manual customer sync drag.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', '#', 4),
((SELECT id FROM portfolio_categories WHERE slug = 'branding'), 'Logistics Brand Design', 'Corporate visual identities, brand style guides, and layout assets.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', '#', 5);

-- Seed Blogs
INSERT INTO blogs (category_id, title, slug, content, summary, featured_image, status, views) VALUES 
((SELECT id FROM blog_categories WHERE slug = 'growth-strategy'), 'Mastering CRM Automation in 2026', 'mastering-crm-automation-2026', '<p>In the digital age, operational efficiency is the dividing line between high-margin scaling and structural stagnation. Automated CRM integrations allow your sales and client success pipelines to flow smoothly without manual data entries.</p><p>By setting up direct visual triggers between your lead ingestion forms (like the ones built on Digital Vistara platforms) and platforms like HubSpot or Salesforce, contact records are instantly created, tagged, and routed to the correct account manager. Micro-automations, such as automated calendar invite senders and WhatsApp follow-up triggers, guarantee that leads are contacted in under 5 minutes, boosting close rates by up to 80%.</p>', 'Discover how to eliminate operational drag by connecting Salesforce or HubSpot with modern triggers.', 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&q=80', 'published', 1420),
((SELECT id FROM blog_categories WHERE slug = 'tech-and-dev'), 'Designing Websites for 90+ Lighthouse Scores', 'designing-for-lighthouse-90', '<p>Search engine algorithms prioritize user experience above almost all else. A latency spike of 1 second can cost B2B brands up to 20% in conversion drops. Designing for 90+ Lighthouse score is not just a badge of honor; it is a financial necessity.</p><p>To build ultra-fast, premium layouts, developers must transition from bulky framework layers to lightweight vanilla compilation. Compressing image assets into WebP/AVIF formats, utilizing lazy-loading, minifying scripts, and employing server-side meta injection (rather than heavy client-side CSR) ensures that your pages load in under 500 milliseconds. Digital Vistara follows this speed-first architecture on all static and dynamic builds.</p>', 'Speed is a primary search engine ranking factor. Here is our checklist for high-fidelity performance.', 'https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=800&q=80', 'published', 980),
((SELECT id FROM blog_categories WHERE slug = 'marketing'), 'Performance Marketing Strategies That Scale', 'performance-marketing-strategies', '<p>Media buying is a highly competitive arena. Throwing ad budget at generic lookalike audiences leads to rising acquisition costs. To scale profitably, marketing campaigns must rely on structured, persona-driven landing experiences and continuous creative testing.</p><p>By mapping meta campaigns to custom, high-speed landing pages containing specific copywriting hooks, conversions increase dramatically. Adding automated retargeting loops across Google Display Network and LinkedIn guarantees that interested prospects remain inside your sales ecosystem. At Digital Vistara, our CMO Gyan Yadav specializes in optimizing these loops to achieve average 3.2x ROI multipliers for client brands.</p>', 'How to lower your customer acquisition cost (CAC) while expanding overall conversions.', 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=800&q=80', 'published', 1150),
((SELECT id FROM blog_categories WHERE slug = 'growth-strategy'), 'Why Branding Dictates Market Valuation', 'branding-and-market-valuation', '<p>A company''s brand is not just a logo—it is the sum total of consumer trust, perceived authority, and design premium. Companies with clean, luxury visual identities command up to 45% higher price margins than generic competitors.</p><p>When a startup presents an award-winning UI/UX interface with soft parallax scrolling, smooth GSAP entries, and premium typography, it signals quality. This aesthetic trust translates directly to perceived business stability, enabling brands to scale contract sizes and attract venture capital easily. Digital Vistara designs custom branding packages tailored to reflect high-end corporate presence.</p>', 'Explore how premium design builds consumer trust and allows startups to charge higher margins.', 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80', 'published', 840),
((SELECT id FROM blog_categories WHERE slug = 'marketing'), 'The Future of Reels & Organic Video Distribution', 'future-of-reels-organic', '<p>Short-form vertical video (Instagram Reels, YouTube Shorts, TikToks) is the most dominant organic reach engine in the world. Brands that script and produce high-hooks content can acquire customers without paying a single dollar in ad spend.</p><p>The key to short-form virality is visual speed and structural hooks. Editing vertical reels with dynamic text callouts, sound effects, and fast pacing holds viewer retention rates. When paired with local map SEO, short-form videos create massive organic pipelines for retail brands and local services alike.</p>', 'Leverage vertical short-form video hooks to command organic brand awareness in search maps.', 'https://images.unsplash.com/photo-1478720568477-152d9b164e26?w=800&q=80', 'published', 1730);
