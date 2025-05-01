const contactLink = document.getElementById('contact-link');
const contactModal = document.getElementById('contact-modal');
const contactClose = document.getElementById('contact-close');
const contactForm = document.getElementById('contact-form');

contactLink.addEventListener('click', function (e) {
    e.preventDefault();
    contactModal.style.display = 'grid';
});

contactClose.addEventListener('click', function (e) {
    e.preventDefault();
    contactModal.style.display = 'none';
});

contactForm.addEventListener('submit', function (e) {
    e.preventDefault();
    alert('ok');
});