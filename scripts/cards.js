// Card Feedback Stars
document.addEventListener('DOMContentLoaded', function() {
    const starContainers = document.querySelectorAll('.card-feedback-stars');

    starContainers.forEach(container => {
        const stars = container.querySelectorAll('i');
        const animationStyle = stars[0].style.animation;

        function disableAnimation() {
            stars.forEach(star => {
                star.style.animation = 'none';
            });
        }

        function enableAnimation() {
            stars.forEach((star, index) => {
                star.style.animation = animationStyle;
            });
        }

        function triggerAnimationCycle() {
            enableAnimation();
            setTimeout(() => {
                disableAnimation();
                setTimeout(triggerAnimationCycle, 2000);
            }, (0.1 * stars.length * 1000) + 600);
        }

        triggerAnimationCycle();
    });
});

document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.card');
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