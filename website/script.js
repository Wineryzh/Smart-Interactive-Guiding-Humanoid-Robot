const header = document.querySelector('.site-header');
const toggle = document.querySelector('.menu-toggle');
const toggleLabel = toggle.querySelector('.sr-only');
const navigation = document.querySelector('.nav-links');
const navigationLinks = [...document.querySelectorAll('.nav-links a')];
const sections = [...document.querySelectorAll('main section[id]')];

const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 20);

toggle.addEventListener('click', () => {
  const isOpen = navigation.classList.toggle('open');
  toggle.setAttribute('aria-expanded', String(isOpen));
  toggleLabel.textContent = isOpen ? '关闭导航' : '打开导航';
});

navigationLinks.forEach((link) => {
  link.addEventListener('click', () => {
    navigation.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggleLabel.textContent = '打开导航';
  });
});

const revealItems = [...document.querySelectorAll('.reveal')];

try {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.remove('reveal-pending');
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealItems.forEach((item) => {
    item.classList.add('reveal-pending');
    revealObserver.observe(item);
  });
} catch (error) {
  revealItems.forEach((item) => item.classList.remove('reveal-pending'));
}

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;
    navigationLinks.forEach((link) => {
      link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`);
    });
  });
}, { rootMargin: '-25% 0px -65% 0px' });

sections.forEach((section) => sectionObserver.observe(section));
window.addEventListener('scroll', updateHeader, { passive: true });
updateHeader();
document.querySelector('#year').textContent = new Date().getFullYear();
