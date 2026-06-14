// Site Footer Web Component - Digital Vistara
// Dynamically renders branding, contact information, and social connections

class SiteFooter extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <footer class="w-full bg-[#EDEDED]/45 border-t border-[#8B5C7E]/10 py-16 px-6 relative overflow-hidden">
        <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 relative z-10">
          
          <!-- Column 1: Brand & Bio -->
          <div class="flex flex-col gap-4">
            <a href="#/" class="flex items-center gap-2">
              <span class="w-8 h-8 rounded-full bg-[#8B5C7E] flex items-center justify-center text-white font-bold text-sm">DV</span>
              <span class="font-outfit font-extrabold text-lg tracking-tight text-[#8B5C7E]">
                DIGITAL<span class="text-[#2F7D5B]">VISTARA</span>
              </span>
            </a>
            <p class="text-sm text-gray-600 leading-relaxed mt-2">
              Empowering startups and high-growth brands to scale through cutting-edge technology integrations, premium web architectures, and metrics-driven digital marketing.
            </p>
          </div>

          <!-- Column 2: Navigation Links -->
          <div>
            <h4 class="font-outfit font-bold text-sm text-[#8B5C7E] uppercase tracking-wider mb-6">Quick Links</h4>
            <div class="flex flex-col gap-3.5 text-sm font-medium text-gray-600">
              <a href="#/" class="hover:text-[#8B5C7E] transition-colors">Home</a>
              <a href="#/about" class="hover:text-[#8B5C7E] transition-colors">About Agency</a>
              <a href="#/services" class="hover:text-[#8B5C7E] transition-colors">Our Services</a>
              <a href="#/portfolio" class="hover:text-[#8B5C7E] transition-colors">Portfolio</a>
              <a href="#/blog" class="hover:text-[#8B5C7E] transition-colors">Insights & Blog</a>
              <a href="#/contact" class="hover:text-[#8B5C7E] transition-colors">Contact Us</a>
            </div>
          </div>

          <!-- Column 3: Contact Information -->
          <div>
            <h4 class="font-outfit font-bold text-sm text-[#8B5C7E] uppercase tracking-wider mb-6">Inquiries</h4>
            <div class="flex flex-col gap-4 text-sm text-gray-600">
              <div class="flex items-start gap-2.5">
                <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#2F7D5B] mt-0.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
                <a id="footer-email" href="mailto:digitalvistara.in@gmail.com" class="hover:underline hover:text-[#8B5C7E]">digitalvistara.in@gmail.com</a>
              </div>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-2.5">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-5 h-5 text-[#2F7D5B]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path></svg>
                  <a id="footer-phone-1" href="tel:9772566884" class="hover:underline hover:text-[#8B5C7E]">+91 9772566884</a>
                </div>
                <div class="flex items-center gap-2.5 pl-7.5">
                  <a id="footer-phone-2" href="tel:8809092662" class="hover:underline hover:text-[#8B5C7E]">+91 8809092662</a>
                </div>
                <div class="flex items-center gap-2.5 pl-7.5">
                  <a id="footer-phone-3" href="tel:8755607281" class="hover:underline hover:text-[#8B5C7E]">+91 8755607281</a>
                </div>
              </div>
            </div>
          </div>

          <!-- Column 4: Newsletter & Social Connection -->
          <div class="flex flex-col gap-6">
            <div>
              <h4 class="font-outfit font-bold text-sm text-[#8B5C7E] uppercase tracking-wider mb-4">Connect with us</h4>
              <div class="flex items-center gap-3">
                <a id="social-linkedin" href="https://linkedin.com/company/digitalvistara" target="_blank" class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#8B5C7E] border border-white/20 transition-all hover:scale-105" aria-label="LinkedIn">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path><rect x="2" y="9" width="4" height="12"></rect><circle cx="4" cy="4" r="2"></circle></svg>
                </a>
                <a id="social-instagram" href="https://instagram.com/digitalvistara" target="_blank" class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#8B5C7E] border border-white/20 transition-all hover:scale-105" aria-label="Instagram">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line></svg>
                </a>
                <a id="social-facebook" href="https://facebook.com/digitalvistara" target="_blank" class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#8B5C7E] border border-white/20 transition-all hover:scale-105" aria-label="Facebook">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                </a>
                <a id="social-twitter" href="https://twitter.com/digitalvistara" target="_blank" class="w-10 h-10 rounded-full glass-panel flex items-center justify-center text-gray-600 hover:text-white hover:bg-[#8B5C7E] border border-white/20 transition-all hover:scale-105" aria-label="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path></svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div class="max-w-7xl mx-auto border-t border-[#8B5C7E]/10 mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-semibold text-gray-500 relative z-10">
          <p>© 2026 Digital Vistara. All Rights Reserved.</p>
          <div class="flex items-center gap-6">
            <a href="#" class="hover:underline">Privacy Policy</a>
            <a href="#" class="hover:underline">Terms of Service</a>
            <a href="/admin/index.html" class="hover:underline text-[#8B5C7E] flex items-center gap-1">
              <svg xmlns="http://www.w3.org/2000/svg" class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
              Admin CMS Portal
            </a>
          </div>
        </div>
        
        <!-- Soft decorative background gradients -->
        <div class="absolute bottom-[-150px] right-[-150px] w-[350px] h-[350px] rounded-full bg-[#D9CED6]/20 blur-[100px] pointer-events-none"></div>
      </footer>
    `;

    // Dynamically insert WhatsApp floating icon
    if (!document.getElementById('floating-whatsapp-btn')) {
      const waBtn = document.createElement('a');
      waBtn.id = 'floating-whatsapp-btn';
      waBtn.href = 'https://wa.me/919772566884'; // Seed contact number
      waBtn.target = '_blank';
      waBtn.className = 'fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full bg-[#25D366] hover:bg-[#20BA56] flex items-center justify-center text-white shadow-lg hover:scale-110 hover:rotate-6 transition-all duration-300 group';
      waBtn.setAttribute('aria-label', 'Chat on WhatsApp');
      waBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" class="w-7 h-7 fill-current" viewBox="0 0 448 512">
          <path d="M380.9 97.1C339 55.1 283.2 32 223.9 32c-122.4 0-222 99.6-222 222 0 39.1 10.2 77.3 29.6 111L0 480l117.7-30.9c32.4 17.7 68.9 27 106.1 27h.1c122.3 0 224.1-99.6 224.1-222 0-59.3-25.2-115-67.1-157zm-157 341.6c-33.2 0-65.7-8.9-94-25.7l-6.7-4-69.8 18.3L72 359.2l-4.4-7c-18.5-29.4-28.2-63.3-28.2-98.2 0-101.7 82.8-184.5 184.6-184.5 49.3 0 95.6 19.2 130.4 54.1 34.8 34.9 56.2 81.2 56.1 130.5 0 101.8-84.9 184.6-186.6 184.6zm101.2-138.2c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.6-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2-3.7 0-9.7 1.4-14.8 6.9-5.1 5.6-19.4 19-19.4 46.3 0 27.3 19.9 53.7 22.6 57.4 2.8 3.7 39.1 59.7 94.8 83.8 35.2 15.2 49 16.5 66.6 13.9 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.6z"/>
        </svg>
        <span class="absolute right-16 bg-white dark:bg-[#1E171D] border border-[#25D366]/20 text-[#2F7D5B] dark:text-brandGreen text-xs font-bold px-3 py-1.5 rounded-xl shadow-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
          Chat on WhatsApp
        </span>
      `;
      document.body.appendChild(waBtn);
    }
  }
}

customElements.define('site-footer', SiteFooter);
