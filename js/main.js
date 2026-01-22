/* ===================================
   ENTREPRENEURSHIP CLUB WEBSITE
   JAVASCRIPT FUNCTIONALITY
   =================================== */

// ===== HEADER SCROLL EFFECT =====
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 100) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// ===== MOBILE MENU TOGGLE =====
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav');

if (menuToggle) {
  menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
  });

  // Close menu when clicking nav links
  const navLinks = document.querySelectorAll('.nav a');
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', (e) => {
    if (!nav.contains(e.target) && !menuToggle.contains(e.target)) {
      menuToggle.classList.remove('active');
      nav.classList.remove('active');
    }
  });
}

// ===== HERO IMAGE SLIDER =====
const heroSlider = document.querySelector('.hero-slider');
if (heroSlider) {
  const slides = document.querySelectorAll('.hero-slide');
  let currentSlide = 0;

  // Set first slide as active
  if (slides.length > 0) {
    slides[0].classList.add('active');
  }

  // Function to change slide
  function changeSlide() {
    slides[currentSlide].classList.remove('active');
    currentSlide = (currentSlide + 1) % slides.length;
    slides[currentSlide].classList.add('active');
  }

  // Auto-play slider every 5 seconds
  if (slides.length > 1) {
    setInterval(changeSlide, 5000);
  }
}

// ===== ACTIVE NAV LINK ON SCROLL =====
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav a');

window.addEventListener('scroll', () => {
  let current = '';

  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.clientHeight;

    if (window.pageYOffset >= sectionTop - 200) {
      current = section.getAttribute('id');
    }
  });

  navLinks.forEach(link => {
    link.classList.remove('active');
    if (link.getAttribute('href') === `#${current}`) {
      link.classList.add('active');
    }
    // Handle home link
    if (current === '' && link.getAttribute('href') === '#home') {
      link.classList.add('active');
    }
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');

    // Only prevent default for hash links on the same page
    if (href !== '#' && href.startsWith('#')) {
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const headerHeight = document.querySelector('.header').offsetHeight;
        const targetPosition = target.offsetTop - headerHeight;

        window.scrollTo({
          top: targetPosition,
          behavior: 'smooth'
        });
      }
    }
  });
});

// ===== FORM SUBMISSION HANDLER =====
const contactForm = document.querySelector('.contact-form form');
if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Get form data
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Basic validation
    if (!name || !email || !message) {
      alert('Please fill in all fields.');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    // Success message (in a real app, this would send to a server)
    alert('Thank you for your message! We will get back to you soon.');
    contactForm.reset();
  });
}

// ===== ENHANCED SCROLL REVEAL ANIMATIONS =====
const revealObserverOptions = {
  threshold: 0.15,
  rootMargin: '0px 0px -80px 0px'
};

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('active');
      // Add stagger delay for children if needed
      if (entry.target.classList.contains('stagger-children')) {
        const children = entry.target.children;
        Array.from(children).forEach((child, index) => {
          child.style.transitionDelay = `${index * 0.1}s`;
        });
      }
    }
  });
}, revealObserverOptions);

// Initialize reveal animations on page load
document.addEventListener('DOMContentLoaded', () => {
  // Add reveal classes to elements
  const sectionHeaders = document.querySelectorAll('.section-header');
  const aboutContent = document.querySelectorAll('.about-content > *');
  const highlightItems = document.querySelectorAll('.highlight-item');
  const eventCards = document.querySelectorAll('.event-card');
  const miniCards = document.querySelectorAll('.mini-card');
  const initiativeCards = document.querySelectorAll('.initiative-card');
  const contactSections = document.querySelectorAll('.contact-form, .contact-info');
  const infoItems = document.querySelectorAll('.info-item');

  // Apply reveal class to section headers
  sectionHeaders.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  // Apply reveal classes with alternating directions for about content
  aboutContent.forEach((el, index) => {
    el.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
    revealObserver.observe(el);
  });

  // Apply reveal-scale to event cards
  eventCards.forEach(el => {
    el.classList.add('reveal-scale');
    revealObserver.observe(el);
  });

  // Apply staggered animation to initiatives grid
  const initiativesGrid = document.querySelectorAll('.initiatives-grid');
  initiativesGrid.forEach(grid => {
    grid.classList.add('stagger-children');
    revealObserver.observe(grid);
  });

  // Apply staggered animation to highlights
  const highlightsContainer = document.querySelectorAll('.about-highlights');
  highlightsContainer.forEach(container => {
    container.classList.add('stagger-children');
    revealObserver.observe(container);
  });

  // Apply reveal to mini cards
  miniCards.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 0.15}s`;
    revealObserver.observe(el);
  });

  // Apply reveal to contact sections
  contactSections.forEach((el, index) => {
    el.classList.add(index % 2 === 0 ? 'reveal-left' : 'reveal-right');
    revealObserver.observe(el);
  });

  // Apply reveal to info items
  infoItems.forEach((el, index) => {
    el.classList.add('reveal');
    el.style.transitionDelay = `${index * 0.1}s`;
    revealObserver.observe(el);
  });

  // Apply reveal to initiative cards individually
  initiativeCards.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });
});

// ===== PARALLAX EFFECT FOR HERO =====
const hero = document.querySelector('.hero');
if (hero) {
  window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = hero.querySelector('.hero-content');
    if (heroContent && scrolled < window.innerHeight) {
      heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
      heroContent.style.opacity = 1 - (scrolled / (window.innerHeight * 0.8));
    }
  });
}

// ===== MAGNETIC BUTTON EFFECT =====
const buttons = document.querySelectorAll('.btn');
buttons.forEach(btn => {
  btn.addEventListener('mousemove', (e) => {
    const rect = btn.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    btn.style.transform = `translate(${x * 0.1}px, ${y * 0.1}px)`;
  });

  btn.addEventListener('mouseleave', () => {
    btn.style.transform = 'translate(0, 0)';
  });
});

// ===== TILT EFFECT FOR CARDS =====
// Only apply to initiative cards, not event cards
const tiltCards = document.querySelectorAll('.initiative-card');
tiltCards.forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
  });
});

// ===== SMOOTH COUNTER ANIMATION =====
function animateCounter(element, target, duration = 2000) {
  let start = 0;
  const increment = target / (duration / 16);

  const timer = setInterval(() => {
    start += increment;
    if (start >= target) {
      element.textContent = target;
      clearInterval(timer);
    } else {
      element.textContent = Math.floor(start);
    }
  }, 16);
}

// ===== TYPING EFFECT FOR HERO HEADLINE =====
const heroHeadline = document.querySelector('.hero-content h1');
if (heroHeadline) {
  const text = heroHeadline.textContent;
  heroHeadline.innerHTML = '';
  heroHeadline.style.opacity = '1';

  let charIndex = 0;
  function typeText() {
    if (charIndex < text.length) {
      heroHeadline.innerHTML += text.charAt(charIndex);
      charIndex++;
      setTimeout(typeText, 50);
    }
  }

  // Start typing after a short delay
  setTimeout(typeText, 500);
}

// ===== SET CURRENT YEAR IN FOOTER =====
const yearElement = document.querySelector('.current-year');
if (yearElement) {
  yearElement.textContent = new Date().getFullYear();
}

