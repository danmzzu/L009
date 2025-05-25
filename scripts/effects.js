// Fade In Cards
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.card, .divider, footer, header, p:not(.infinite-subtitle), a, h1, h2, h3, h4, img, i, ul, input, textarea, button, small');
    let lastScrollY = window.scrollY;

    const observer = new IntersectionObserver(entries => {
        const currentScrollY = window.scrollY;
        const isScrollingDown = currentScrollY > lastScrollY;

        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (isScrollingDown) {
                    entry.target.classList.add('visible-from-bottom');
                    entry.target.classList.remove('visible-from-top');
                } else {
                    entry.target.classList.add('visible-from-top');
                    entry.target.classList.remove('visible-from-bottom');
                }
            } else {
                entry.target.classList.remove('visible-from-bottom');
                entry.target.classList.remove('visible-from-top');
            }
        });
        lastScrollY = currentScrollY;
    }, { threshold: 0.1 });

    elements.forEach(card => {
        observer.observe(card);
    });
});