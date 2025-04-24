async function sendQuestion(q) {
    const url = 'http://localhost:3000/';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ question: q }),
        });

        if (!response.ok) {
            const erro = await response.json();
            return `Erro ao obter resposta: ${response.status}\n`;
        }

        const data = await response.json();
        return data.answer + '\n';
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        return 'Ocorreu um erro ao se comunicar com o servidor.\n';
    }
}

const form = document.getElementById('loo9-ia-form');
const input = document.getElementById('loo9-ia-input');
const button = document.getElementById('loo9-ia-button');
const outputDiv = document.getElementById('loo9-ia-output');

function typeWriterEffect(element, text, className = '') {
    return new Promise((resolve) => {
        let i = 0;
        const messageDiv = document.createElement('div');
        if (className) {
            messageDiv.classList.add(className);
        }
        element.appendChild(messageDiv);

        const timer = setInterval(() => {
            if (i < text.length) {
                messageDiv.innerHTML += text.charAt(i);
                element.scrollTop = element.scrollHeight;
                i++;
            } else {
                clearInterval(timer);
                element.scrollTop = element.scrollHeight;
                resolve();
            }
        }, 15);
    });
}

form.addEventListener('submit', async function (e) {
    e.preventDefault();
    const question = input.value;
    if (question.trim() !== "") {
        input.disabled = true;
        button.disabled = true;

        await typeWriterEffect(outputDiv, "Pergunta: " + question, 'ia-question');
        outputDiv.scrollTop = outputDiv.scrollHeight;

        const loadingDiv = document.createElement('div');
        outputDiv.appendChild(loadingDiv);
        await typeWriterEffect(loadingDiv, "Pensando...", 'ia-info');
        outputDiv.scrollTop = outputDiv.scrollHeight;

        try {
            const response = await sendQuestion(question);
            if (outputDiv.contains(loadingDiv)) {
                outputDiv.removeChild(loadingDiv);
            }
            await typeWriterEffect(outputDiv, "LOO9-IA: " + response, 'ia-response');
        } catch (error) {
            if (outputDiv.contains(loadingDiv)) {
                outputDiv.removeChild(loadingDiv);
            }
            await typeWriterEffect(outputDiv, "Ocorreu um erro ao processar sua pergunta.", 'ia-error');
        } finally {
            input.value = "";
            input.disabled = false;
            button.disabled = false;
            input.focus();
        }
    } else {
        await typeWriterEffect(outputDiv, "Por favor, digite sua pergunta.", 'ia-error');
        input.focus();
    }
});