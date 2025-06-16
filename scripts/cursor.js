let cursor = document.getElementById('cursor');
let body = document.querySelector('body');

document.onmousemove = function(e) {
    cursor.style.top = e.pageY + 'px';
    cursor.style.left = e.pageX + 'px';

    let fragment = document.createElement('div');
    fragment.className = 'fragment';
    body.prepend(fragment);

    fragment.style.left = cursor.getBoundingClientRect().x + 'px';
    fragment.style.top = cursor.getBoundingClientRect().y + 'px';

    setTimeout(function () {
        let currentFragment = document.querySelectorAll('.fragment')[0],
        directionX = Math.random() < .5 ? -1 : 1,
        directionY = Math.random() < .5 ? -1 : 1;

        currentFragment.style.left = parseInt(currentFragment.style.left) - (directionX * (Math.random() * 200)) + 'px';
        currentFragment.style.top = parseInt(currentFragment.style.top) - (directionY * (Math.random() * 200)) + 'px';

        currentFragment.style.opacity = 0;
        currentFragment.style.transform = 'scale(0.25)';

        setTimeout(function () {
            fragment.remove();
        }, 350);
        
    }, 1);
}
