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
            console.error('Erro na requisição:', erro);
            return `Erro ao obter resposta: ${response.status}\n`;
        }

        const data = await response.json();
        return data.answer + '\n';
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        return 'Ocorreu um erro ao se comunicar com o servidor.\n';
    }
}

const input = document.getElementById('loo9-ia-input');
const button = document.getElementById('loo9-ia-button');
const textarea = document.getElementById('loo9-ia-textarea');

function typeWriterEffect(element, text, speed = 15) {
    return new Promise((resolve) => {
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                element.value += text.charAt(i);
                i++;
            } else {
                clearInterval(timer);
                element.scrollTop = element.scrollHeight;
                resolve();
            }
        }, speed);
    });
}

button.addEventListener('click', function () {
    const question = input.value;
    if (question.trim() !== "") {
        input.disabled = true;
        button.disabled = true;
        textarea.value += (textarea.value ? '\n' : '') + "Você: " + question + '\nCarregando...\n';
        textarea.scrollTop = textarea.scrollHeight;

        sendQuestion(question)
            .then(response => {
                return typeWriterEffect(textarea, "LOO9-IA: " + response);
            })
            .then(() => {
                input.value = "";
                input.disabled = false;
                button.disabled = false;
            })
            .catch(error => {
                textarea.value += "LOO9-IA: Ocorreu um erro ao processar sua pergunta.\n";
                textarea.scrollTop = textarea.scrollHeight;
                button.disabled = false;
            });
    } else {
        textarea.value += (textarea.value ? '\n' : '') + "Por favor, digite sua pergunta.\n";
        textarea.scrollTop = textarea.scrollHeight;
    }
});