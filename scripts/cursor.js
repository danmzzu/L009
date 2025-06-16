let body = document.querySelector('body');
let cursor = document.getElementById('cursor');

function createAndAnimateFragment(x, y) {
    let fragment = document.createElement('div');
    fragment.className = 'fragment';
    body.prepend(fragment);

    fragment.style.left = x + 'px';
    fragment.style.top = y + 'px';

    setTimeout(function () {
        let directionX = Math.random() < 0.5 ? -1 : 1;
        let directionY = Math.random() < 0.5 ? -1 : 1;

        fragment.style.left = parseInt(fragment.style.left) - (directionX * (Math.random() * 200)) + 'px';
        fragment.style.top = parseInt(fragment.style.top) - (directionY * (Math.random() * 200)) + 'px';
        fragment.style.opacity = 0;
        fragment.style.transform = 'scale(10)';

        setTimeout(function () {
            fragment.remove();
        }, 400);
        
    }, 1);
}

document.onmousemove = function(e) {
    if (cursor) {
        cursor.style.top = e.pageY + 'px';
        cursor.style.left = e.pageX + 'px';
        createAndAnimateFragment(cursor.getBoundingClientRect().x, cursor.getBoundingClientRect().y);
    } else {
        createAndAnimateFragment(e.pageX, e.pageY);
    }
};

document.addEventListener('touchstart', function(e) {
    e.preventDefault();
    let touchX = e.touches[0].pageX;
    let touchY = e.touches[0].pageY;
    createAndAnimateFragment(touchX, touchY);
});

document.addEventListener('touchmove', function(e) {
    e.preventDefault();
    let touchX = e.touches[0].pageX;
    let touchY = e.touches[0].pageY;
    createAndAnimateFragment(touchX, touchY);
});