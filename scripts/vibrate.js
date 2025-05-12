const allLinks = document.querySelectorAll('a');
const body = document.body;
let vibrateSound;

function createAudioElement() {
    vibrateSound = document.createElement('audio');
    vibrateSound.id = 'vibrateSound';
    vibrateSound.src = 'audios/vibrate.mp3';
    vibrateSound.preload = 'auto';
    document.body.appendChild(vibrateSound);
}

window.addEventListener('load', createAudioElement);

allLinks.forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();

        if (vibrateSound) {
            vibrateSound.currentTime = 0;
            vibrateSound.play();
        }

        body.classList.add('vibrating');

        setTimeout(() => {
            body.classList.remove('vibrating');
            if (link.target === '_blank') {
                window.open(link.href, '_blank');
            } else {
                window.location.href = link.href;
            }
        }, 1500);
    });
});