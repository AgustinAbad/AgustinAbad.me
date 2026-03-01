// sidebar.js
// controla la expansión y contracción de la barra lateral

document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('sidebar');
    const navLinks = sidebar.querySelectorAll('a');
    const sections = document.querySelectorAll('main section');

    // expand/collapse sidebar on hover
    sidebar.addEventListener('mouseenter', () => {
        sidebar.classList.add('expanded');
    });
    sidebar.addEventListener('mouseleave', () => {
        sidebar.classList.remove('expanded');
    });

    // smooth scroll when clicking links (for browsers without css scroll-behavior)
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').slice(1);
            const target = document.getElementById(id);
            if (target) {
                target.scrollIntoView({behavior: 'smooth'});
            }
        });
    });

    // fade-in sections as they enter viewport
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    sections.forEach(sec => observer.observe(sec));
});