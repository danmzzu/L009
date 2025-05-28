// Fade In Cards
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card, .divider, footer, header');
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

    cards.forEach(card => {
        observer.observe(card);
    });
});

// Internal # Links Middle of Screen
document.addEventListener('DOMContentLoaded', () => {
    const internalLinks = document.querySelectorAll('a[href^="#"]');

    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'center'
                });

                window.history.pushState(null, '', targetId);
            }
        });
    });
});