const audio = document.getElementById('music');
const infinitePulse = document.querySelector('body');
const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
const source = audioContext.createMediaElementSource(audio);

source.connect(analyser);
analyser.connect(audioContext.destination);

analyser.fftSize = 256;
const bufferLength = analyser.frequencyBinCount;
const dataArray = new Uint8Array(bufferLength);

const volumeThreshold = 120;
const peakDetectionDelay = 150;
let lastPeakTime = 0;

function analisarAudio() {
    analyser.getByteFrequencyData(dataArray);

    let volumeSum = 0;
    for (let i = 0; i < bufferLength; i++) {
        volumeSum += dataArray[i];
    }
    const averageVolume = volumeSum / bufferLength;
    const currentTime = Date.now();

    if (averageVolume > volumeThreshold && (currentTime - lastPeakTime) > peakDetectionDelay) {
        infinitePulse.classList.add('music-vibrate');
        lastPeakTime = currentTime;

        setTimeout(() => {
            infinitePulse.classList.remove('music-vibrate');
        }, 150);
    }

    requestAnimationFrame(analisarAudio);
}

audio.onplay = () => {
    audioContext.resume();
    analisarAudio();
};