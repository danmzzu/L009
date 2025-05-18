document.addEventListener('DOMContentLoaded', () => {
    const typerElements = document.querySelectorAll('.typer');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (!entry.target.dataset.typed) {
                    startTyping(entry.target);
                    entry.target.dataset.typed = 'true';
                    observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    typerElements.forEach(element => {
        element.dataset.originalText = element.textContent;
        element.textContent = '';
        observer.observe(element);
    });

    function startTyping(element) {
        const originalText = element.dataset.originalText;
        let charIndex = 0;
        const typingSpeed = 5;

        function type() {
            if (charIndex < originalText.length) {
                element.textContent += originalText.charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            }
        }
        type();
    }
});