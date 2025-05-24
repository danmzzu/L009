const contactForm = document.getElementById('contact');
const contactError = document.getElementById('contact-error');

contactForm.addEventListener('submit', function(event) {
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
    contactError.innerHTML = errorMessage.join(' ');
    contactError.style.display = 'block';
} else {
        fetch('/sua-api-endpoint', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: contactName,
                phone: contactPhone,
                subject: contactSubject,
                message: contactMessage
            })
        }).then(response => {
            if (!response.ok) { 
                return response.json().then(errorData => {
                    throw new Error(errorData.message || 'Erro ao enviar o formulário.');
                });
            }
            return response.json();
        }).then(data => {
            console.log('Sucesso:', data);
            alert('Formulário enviado com sucesso!');
            contactForm.reset();
            contactError.style.display = 'none';
        }).catch((error) => {
            console.error('Erro ao enviar o formulário:', error);
            contactError.textContent = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
            contactError.style.display = 'block';
        });
    }
});