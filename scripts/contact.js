// Seleciona os elementos do DOM
const contactForm = document.getElementById('contact');
const contactButton = document.getElementById('contact-button');

// Elementos de feedback geral
const contactError = document.getElementById('contact-error'); // Mensagens de erro gerais
const contactStatus = document.getElementById('contact-status'); // Mensagens de status (enviando, sucesso)

// URLs da API
const API_URL = 'https://l009-api-sendmail-railway.up.railway.app/'; // URL da sua API de envio de e-mail

// Função para limpar todas as mensagens de erro específicas dos campos
function clearFieldErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// Função para exibir uma mensagem de erro específica para um campo
function showFieldError(fieldId, message) {
    const errorElement = document.getElementById(`${fieldId}-error`);
    if (errorElement) {
        errorElement.innerHTML = message;
        errorElement.style.display = 'block';
    }
}

// Função para exibir uma mensagem de status geral
function showGeneralStatus(message, isError = false) {
    if (contactStatus) {
        contactStatus.innerHTML = message;
        contactStatus.style.display = 'block';
        contactStatus.style.color = isError ? 'red' : 'green'; // Exemplo de estilo
    } else if (contactError) {
        // Fallback se contactStatus não existir, usando contactError para status
        contactError.innerHTML = message;
        contactError.style.display = 'block';
        contactError.style.color = isError ? 'red' : 'green'; // Exemplo de estilo
    }
}

// Função para limpar mensagens gerais após um tempo
function clearGeneralMessagesAfterDelay(delay = 5000) {
    setTimeout(() => {
        if (contactStatus) {
            contactStatus.textContent = '';
            contactStatus.style.display = 'none';
        }
        if (contactError) {
            contactError.textContent = '';
            contactError.style.display = 'none';
        }
    }, delay);
}


// Adiciona um listener para o evento de submissão do formulário
contactForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Impede o comportamento padrão de submissão do formulário

    // Limpa mensagens anteriores
    clearFieldErrors(); // Limpa erros de campo
    if (contactError) { // Limpa erro geral
        contactError.textContent = '';
        contactError.style.display = 'none';
    }
    if (contactStatus) { // Limpa status geral
        contactStatus.textContent = '';
        contactStatus.style.display = 'none';
    }

    // Obtém os valores dos campos e remove espaços em branco
    const contactName = document.getElementById('contact-name').value.trim();
    const contactPhone = document.getElementById('contact-phone').value.trim();
    const contactSubject = document.getElementById('contact-subject').value.trim();
    const contactMessage = document.getElementById('contact-message').value.trim();

    let isValid = true; // Flag para validar o formulário

    // Validação de cada campo
    if (contactName === '') {
        showFieldError('contact-name', 'O campo <strong>Nome completo</strong> é obrigatório.');
        isValid = false;
    }

    if (contactPhone === '') {
        showFieldError('contact-phone', 'O campo <strong>Telefone</strong> é obrigatório.');
        isValid = false;
    }

    if (contactSubject === '') {
        showFieldError('contact-subject', 'O campo <strong>Assunto</strong> é obrigatório.');
        isValid = false;
    }

    if (contactMessage === '') {
        showFieldError('contact-message', 'O campo <strong>Mensagem</strong> é obrigatório.');
        isValid = false;
    }

    // Se o formulário não for válido, para a execução
    if (!isValid) {
        if (contactError) {
            contactError.innerHTML = 'Por favor, preencha todos os campos obrigatórios.';
            contactError.style.display = 'block';
            contactError.style.color = 'red';
        }
        return;
    }

    // Desabilita o botão de envio para evitar múltiplos cliques
    contactButton.disabled = true;
    showGeneralStatus('Enviando sua mensagem...', false); // Exibe mensagem de "Enviando..."

    // Constrói a mensagem HTML completa para o e-mail
    const fullMessage = `
        <p><strong>Nome:</strong> ${contactName}</p>
        <p><strong>Telefone:</strong> ${contactPhone}</p>
        <p><strong>Assunto:</strong> ${contactSubject}</p>
        <p><strong>Mensagem:</strong> ${contactMessage}</p>
    `;

    // Dados do e-mail a serem enviados para a API
    const emailData = {
        To: "contato@l009.com.br", // Destinatário fixo
        Subject: `L009 - Notificação: ${contactSubject}`, // Assunto com prefixo
        Message: fullMessage,
        html: true // Indica que a mensagem é HTML
    };

    try {
        // Faz a requisição POST para a API de envio de e-mail
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json' // Define o tipo de conteúdo como JSON
            },
            body: JSON.stringify(emailData) // Converte os dados para JSON string
        });

        if (!response.ok) {
            // Se a resposta não for bem-sucedida (status 4xx ou 5xx)
            const errorData = await response.json();
            console.error('Erro ao enviar e-mail:', errorData.error || errorData.message || 'Erro desconhecido na API.');
            showGeneralStatus('Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.', true); // Exibe erro geral
            return; // Sai da função
        }

        // Se a resposta for bem-sucedida (status 2xx)
        const data = await response.json();
        console.log('E-mail enviado com sucesso!', data.message);
        showGeneralStatus('Sua mensagem foi enviada com sucesso!', false); // Exibe mensagem de sucesso

        contactForm.reset(); // Reseta o formulário
    } catch (error) {
        // Captura erros de rede ou outros erros de requisição
        console.error('Erro na requisição fetch:', error);
        showGeneralStatus('Houve um problema de conexão. Verifique sua internet ou tente novamente.', true); // Exibe erro de conexão
    } finally {
        contactButton.disabled = false; // Reabilita o botão de envio
        clearGeneralMessagesAfterDelay(5000); // Limpa mensagens de status/erro após 5 segundos
    }
});