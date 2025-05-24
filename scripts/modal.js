const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.modal-close');
const modalOpen = document.querySelectorAll('.modal-open');

function openModal(event) {
    event.preventDefault();
    modal.style.display = 'grid';
}

function closeModal() {
    modal.style.display = 'none';
}

modalOpen.forEach(link => {
    link.addEventListener('click', openModal);
});

if (modalClose) {
    modalClose.addEventListener('click', closeModal);
}

if (modal) {
    modal.addEventListener('click', function(event) {
        if (event.target === modal) { closeModal(); }
    });
}