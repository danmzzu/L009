const sky = document.querySelector('#background_stars');
const numStars = 15;

function createStar() {
    const size = Math.random() * 3 + 1;
    const x = Math.random() * window.innerWidth;
    const y = Math.random() * window.innerHeight;
    const delay = Math.random() * 2;
    const star = document.createElement('div');

    star.classList.add('star');
    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${x}px`;
    star.style.top = `${y}px`;
    star.style.animationDelay = `${delay}s`;
    sky.appendChild(star);
}

for (let i = 0; i < numStars; i++) {
    createStar();
}