let body = document.querySelector('body');
let cursor = document.getElementById('cursor');

// Variáveis para o Long Press
let touchTimer;
const longPressDuration = 500; // Tempo em milissegundos para considerar um "long press"
let isLongPressing = false; // Flag para indicar se um long press está ativo

function createAndAnimateFragment(x, y, isLongPress = false) {
    let fragment = document.createElement('div');
    fragment.className = 'fragment';

    // Adiciona uma classe diferente se for um long press para estilização ou animação diferente
    if (isLongPress) {
        fragment.classList.add('long-press-fragment');
        // Você pode ajustar o estilo ou animação aqui para fragmentos de long press
        fragment.style.backgroundColor = 'purple'; // Exemplo: cor diferente
        fragment.style.transform = 'scale(2)'; // Exemplo: começa maior
    }
    
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

// Evento para movimento do mouse (permanece inalterado para criar fragmentos)
document.onmousemove = function(e) {
    if (cursor) {
        cursor.style.top = e.pageY + 'px';
        cursor.style.left = e.pageX + 'px';
        createAndAnimateFragment(cursor.getBoundingClientRect().x, cursor.getBoundingClientRect().y);
    } else {
        createAndAnimateFragment(e.pageX, e.pageY);
    }
};

// --- Funções para Long Press ---

function handleTouchStart(e) {
    // Se você quiser evitar o comportamento padrão de zoom/scroll do navegador em dispositivos móveis
    // e.preventDefault(); 

    isLongPressing = false; // Reseta a flag
    // Inicia o temporizador para o long press
    touchTimer = setTimeout(() => {
        isLongPressing = true; // Marca que um long press ocorreu
        // Chama a função com a flag isLongPress = true
        createAndAnimateFragment(e.touches[0].pageX, e.touches[0].pageY, true); 
        console.log("Long Press detectado!");
        // Você pode adicionar um loop aqui para criar vários fragmentos enquanto o dedo estiver pressionado,
        // mas é preciso ter cuidado para não sobrecarregar.
        // Ou, se for uma ação única, não precisa de loop.
    }, longPressDuration);
}

function handleTouchEnd() {
    // Limpa o temporizador se o dedo for levantado
    if (touchTimer) {
        clearTimeout(touchTimer);
        touchTimer = null;
    }
    // Reseta a flag de long press
    isLongPressing = false; 
}

function handleTouchMove(e) {
    // Se já estamos em um long press ativo, podemos continuar a criar fragmentos
    // ou fazer algo diferente. Para este exemplo, vou manter o comportamento original do touchmove
    // se não for um long press.
    
    // Calcula a distância do movimento. Se for muito grande, cancela o long press.
    // Você pode precisar ajustar esse 'limiar' dependendo da sensibilidade desejada.
    const touchX = e.touches[0].pageX;
    const touchY = e.touches[0].pageY;

    if (touchTimer) {
        // Obter as coordenadas iniciais do toque para calcular o movimento
        // Isso requer armazenar as coordenadas no touchstart
        // Por simplicidade, vamos apenas limpar se houver movimento significativo do dedo no touchmove
        // Você pode refinar isso para calcular a distância e cancelar apenas se for > um certo threshold.
        clearTimeout(touchTimer);
        touchTimer = null;
    }

    // Se um long press não está ativo, chama createAndAnimateFragment como antes para movimento normal
    if (!isLongPressing) {
        e.preventDefault(); // Ainda previne o scroll padrão
        createAndAnimateFragment(touchX, touchY);
    }
}

// Adiciona os event listeners para eventos de toque
document.addEventListener('touchstart', handleTouchStart, { passive: false }); // Usar { passive: false } se você usar e.preventDefault()
document.addEventListener('touchend', handleTouchEnd);
document.addEventListener('touchmove', handleTouchMove, { passive: false }); // Usar { passive: false } se você usar e.preventDefault()