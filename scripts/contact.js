const contactForm = document.getElementById('contact');
const contactError = document.getElementById('contact-error');

contactForm.addEventListener('submit', async function(event) {
    event.preventDefault();

    const contactName = document.getElementById('contact-name').value.trim();
    const contactPhone = document.getElementById('contact-phone').value.trim();
    const contactSubject = document.getElementById('contact-subject').value.trim();
    const contactMessage = document.getElementById('contact-message').value.trim();

    contactError.textContent = '';
    contactError.style.display = 'none';

    let isValid = true;
    let errorMessage = [];

    if (contactName === '') {
        errorMessage.push('O campo <strong>Nome completo</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (contactPhone === '') {
        errorMessage.push('O campo <strong>Telefone</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (contactSubject === '') {
        errorMessage.push('O campo <strong>Assunto</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (contactMessage === '') {
        errorMessage.push('O campo <strong>Mensagem</strong> é obrigatório.<br>');
        isValid = false;
    }

    if (!isValid) {
        contactError.innerHTML = errorMessage.join('');
        contactError.style.display = 'block';
    } else {
        const fullMessage = `
            <p><strong>Nome:</strong> ${contactName}</p>
            <p><strong>Telefone:</strong> ${contactPhone}</p>
            <p><strong>Assunto:</strong> ${contactSubject}</p>
            <p><strong>Mensagem:</strong> ${contactMessage}</p>
        `;

        const emailData = {
            Brand: "L009",
            To: "danmzzu@gmail.com",
            Subject: `L009 - Novo Contato: ${contactSubject}`,
            Message: fullMessage,
            html: true
        };

        try {
            const response = await fetch('https://l009-api-sendmail-railway.up.railway.app/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(emailData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('Erro ao Enviar Email:', errorData.error || 'Erro desconhecido.');
                contactError.innerHTML = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
                contactError.style.display = 'block';
                return;
            }

            const data = await response.json();

            console.log('Email enviado com sucesso!', data.message);
            alert('Sua mensagem foi enviada com sucesso!');

            contactForm.reset();
            contactError.style.display = 'none';
        } catch (error) {
            console.error('Erro na requisição fetch:', error);
            contactError.innerHTML = 'Houve um problema de conexão. Verifique sua internet ou tente novamente.';
            contactError.style.display = 'block';
        }
    }
});