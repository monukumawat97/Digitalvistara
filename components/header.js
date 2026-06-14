// Site Header Web Component - Digital Vistara
// Dynamically renders standard navigation bar across all pages

class SiteHeader extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <header class="fixed top-0 left-0 w-full z-40 px-6 py-4 transition-all duration-300">
        <nav class="max-w-7xl mx-auto flex items-center justify-between glass-panel px-6 py-3.5 rounded-full border border-white/20">
          <!-- Logo & Brand Title -->
          <a href="#/" class="flex items-center gap-2 group">
            <span class="w-9 h-9 rounded-full bg-[#8B5C7E] flex items-center justify-center text-white font-bold text-lg shadow-md group-hover:scale-105 transition-transform">DV</span>
            <span class="font-outfit font-extrabold text-xl tracking-tight text-[#8B5C7E] group-hover:text-[#2F7D5B] transition-colors">
              DIGITAL<span class="text-[#2F7D5B]">VISTARA</span>
            </span>
          </a>

          <!-- Desktop Navigation Link Items -->
          <div class="hidden md:flex items-center gap-8 text-sm font-medium text-[#2D242B]">
            <a href="#/" class="hover:text-[#8B5C7E] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#8B5C7E] hover:after:w-full after:transition-all">Home</a>
            <a href="#/about" class="hover:text-[#8B5C7E] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#8B5C7E] hover:after:w-full after:transition-all">About</a>
            <a href="#/services" class="hover:text-[#8B5C7E] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#8B5C7E] hover:after:w-full after:transition-all">Services</a>
            <a href="#/portfolio" class="hover:text-[#8B5C7E] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#8B5C7E] hover:after:w-full after:transition-all">Portfolio</a>
            <a href="#/blog" class="hover:text-[#8B5C7E] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#8B5C7E] hover:after:w-full after:transition-all">Blog</a>
            <a href="#/contact" class="hover:text-[#8B5C7E] transition-colors relative after:content-[''] after:absolute after:bottom-[-4px] after:left-0 after:w-0 after:h-0.5 after:bg-[#8B5C7E] hover:after:w-full after:transition-all">Contact</a>
          </div>

          <!-- Action Buttons / CTA -->
          <div class="hidden md:flex items-center gap-4">
            <button id="theme-toggle-btn" class="w-9 h-9 rounded-full bg-[#8B5C7E]/5 hover:bg-[#8B5C7E]/10 flex items-center justify-center text-[#8B5C7E] transition-all focus:outline-none" aria-label="Toggle Theme">
              <svg id="theme-toggle-icon" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></svg>
            </button>
            <a href="#/contact" class="gradient-accent text-white text-xs font-semibold px-5 py-2.5 rounded-full hover:shadow-md hover:scale-105 transition-all">Start Growing</a>
          </div>

          <!-- Hamburger Button (Mobile Menu Trigger) -->
          <button id="menu-btn" class="md:hidden flex flex-col justify-between w-6 h-4 focus:outline-none" aria-label="Toggle Menu">
            <span class="menu-btn-line w-full h-0.5 bg-[#8B5C7E] rounded-full"></span>
            <span class="menu-btn-line w-full h-0.5 bg-[#8B5C7E] rounded-full"></span>
            <span class="menu-btn-line w-full h-0.5 bg-[#8B5C7E] rounded-full"></span>
          </button>
        </nav>
      </header>

      <!-- Mobile Navigation Drawer Overlay -->
      <div id="mobile-menu" class="fixed inset-0 z-30 bg-white/95 backdrop-blur-lg hidden flex-col justify-center items-center gap-8 text-xl font-semibold text-[#2D242B] px-6">
        <a href="#/" class="hover:text-[#8B5C7E] transition-colors">Home</a>
        <a href="#/about" class="hover:text-[#8B5C7E] transition-colors">About</a>
        <a href="#/services" class="hover:text-[#8B5C7E] transition-colors">Services</a>
        <a href="#/portfolio" class="hover:text-[#8B5C7E] transition-colors">Portfolio</a>
        <a href="#/blog" class="hover:text-[#8B5C7E] transition-colors">Blog</a>
        <a href="#/contact" class="hover:text-[#8B5C7E] transition-colors">Contact</a>
        <button id="theme-toggle-mobile" class="flex items-center gap-2 text-sm text-[#8B5C7E] hover:underline focus:outline-none">
          <svg id="theme-toggle-icon-mobile" xmlns="http://www.w3.org/2000/svg" class="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"></svg>
          <span id="theme-toggle-text-mobile">Dark Mode</span>
        </button>
        <a href="#/contact" class="gradient-accent text-white text-sm px-8 py-3.5 rounded-full mt-4 hover:shadow-lg transition-shadow">Start Growing</a>
      </div>
    `;

    // Handle active link highlights depending on current window hash
    const updateActiveLink = () => {
      const hash = window.location.hash || '#/';
      const links = this.querySelectorAll('nav a, #mobile-menu a');
      links.forEach(link => {
        const href = link.getAttribute('href');
        if (href) {
          // Check if active (excluding query parameters for matching)
          const isMatch = (hash.split('?')[0] === href.split('?')[0]) || 
                          (hash === '#/' && href === '#/') ||
                          (hash === '' && href === '#/');
          
          if (isMatch) {
            link.classList.add('text-[#8B5C7E]');
            if (link.classList.contains('relative')) {
              link.classList.remove('after:w-0');
              link.classList.add('after:w-full');
            }
          } else {
            link.classList.remove('text-[#8B5C7E]');
            if (link.classList.contains('relative')) {
              link.classList.add('after:w-0');
              link.classList.remove('after:w-full');
            }
          }
        }
      });
    };

    window.addEventListener('hashchange', updateActiveLink);
    updateActiveLink();

    // Toggle header opacity on scroll
    window.addEventListener('scroll', () => {
      const header = this.querySelector('header');
      if (header) {
        if (window.scrollY > 50) {
          header.classList.add('py-2', 'bg-white/10', 'backdrop-blur-md');
          header.classList.remove('py-4');
        } else {
          header.classList.add('py-4');
          header.classList.remove('py-2', 'bg-white/10', 'backdrop-blur-md');
        }
      }
    });

    // --- Dynamic Light/Dark Theme Logic ---
    const sunIcon = `<path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/><circle cx="12" cy="12" r="5"/>`;
    const moonIcon = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

    const updateThemeUI = () => {
      const activeDark = document.documentElement.classList.contains('dark');
      
      const icon = this.querySelector('#theme-toggle-icon');
      if (icon) icon.innerHTML = activeDark ? sunIcon : moonIcon;

      const iconMobile = this.querySelector('#theme-toggle-icon-mobile');
      if (iconMobile) iconMobile.innerHTML = activeDark ? sunIcon : moonIcon;

      const textMobile = this.querySelector('#theme-toggle-text-mobile');
      if (textMobile) textMobile.innerText = activeDark ? 'Light Mode' : 'Dark Mode';
    };

    const toggleBtn = this.querySelector('#theme-toggle-btn');
    const toggleMobile = this.querySelector('#theme-toggle-mobile');

    const toggleTheme = () => {
      const willBeDark = !document.documentElement.classList.contains('dark');
      if (willBeDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
      }
      updateThemeUI();
    };

    toggleBtn?.addEventListener('click', toggleTheme);
    toggleMobile?.addEventListener('click', toggleTheme);

    updateThemeUI();
  }
}

customElements.define('site-header', SiteHeader);
