// Get references to the form elements
        const contactForm = document.getElementById('contact');
        const contactError = document.getElementById('contact-error');
        const contactStatus = document.getElementById('contact-status');
        const contactButton = document.getElementById('contact-button');

        // Add event listener for form submission
        contactForm.addEventListener('submit', async function(event) {
            event.preventDefault(); // Prevent default form submission

            // Clear previous error and status messages
            contactError.textContent = '';
            contactError.style.display = 'none';
            if (contactStatus) {
                contactStatus.textContent = '';
                contactStatus.style.display = 'none';
            }

            // Get form field values and trim whitespace
            const contactName = document.getElementById('contact-name').value.trim();
            const contactPhone = document.getElementById('contact-phone').value.trim();
            const contactSubject = document.getElementById('contact-subject').value.trim();
            const contactMessage = document.getElementById('contact-message').value.trim();

            let isValid = true;
            let errorMessage = [];

            // Client-side validation checks
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

            // If validation fails, display error messages
            if (!isValid) {
                contactError.innerHTML = errorMessage.join('');
                contactError.style.display = 'block';
            } else {
                // Disable the submit button to prevent multiple submissions
                contactButton.disabled = true;

                // Show sending status message
                if (contactStatus) {
                    contactStatus.textContent = 'Enviando...';
                    contactStatus.style.display = 'block';
                } else {
                    // Fallback if contactStatus element is not found
                    contactError.innerHTML = 'Enviando...';
                    contactError.style.display = 'block';
                }

                // Construct the full HTML message for the email body
                const fullMessage = `
                    <p><strong>Nome:</strong> ${contactName}</p>
                    <p><strong>Telefone:</strong> ${contactPhone}</p>
                    <p><strong>Assunto:</strong> ${contactSubject}</p>
                    <p><strong>Mensagem:</strong><br>${contactMessage.replace(/\n/g, '<br>')}</p>
                `;

                // Prepare the data payload for your Node.js email API
                // Adjusted to match the payload structure observed in your provided error context
                const emailData = {
                    To: "contato@l009.com.br", // Recipient email address - Changed 'to' to 'To'
                    Subject: `L009 - Novo Contato: ${contactSubject}`, // Email subject - Changed 'subject' to 'Subject'
                    Message: fullMessage, // HTML content - Changed 'text' and 'html' to 'Message' and set 'html: true'
                    html: true // Indicates that the 'Message' field contains HTML
                };

                try {
                    // Send the email data to your Node.js API endpoint
                    // This URL is from your error message, assuming it's the correct deployed API
                    const response = await fetch('https://l009-api-sendmail-railway.up.railway.app/', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(emailData)
                    });

                    // Hide the sending status message
                    if (contactStatus) {
                        contactStatus.style.display = 'none';
                    }

                    // Check if the API request was successful
                    if (!response.ok) {
                        const errorData = await response.json();
                        console.error('Erro ao Enviar Email:', errorData.error || 'Erro desconhecido.');
                        contactError.innerHTML = 'Ocorreu um erro ao enviar sua mensagem. Tente novamente mais tarde.';
                        contactError.style.display = 'block';
                        // Keep error style for contactError
                        contactError.classList.remove('success');
                        contactError.classList.add('error');
                        return; // Stop execution if there's an error
                    }

                    const data = await response.json();
                    console.log('Email enviado com sucesso!', data.message);

                    // Display success message
                    contactError.innerHTML = 'Sua mensagem foi enviada com sucesso!';
                    contactError.style.display = 'block';
                    contactError.classList.remove('error'); // Remove error style
                    contactError.classList.add('success'); // Add success style

                    // Reset the form fields
                    contactForm.reset();
                } catch (error) {
                    // Handle network or API connection errors
                    if (contactStatus) {
                        contactStatus.style.display = 'none';
                    }
                    console.error('Erro na requisição fetch:', error);
                    contactError.innerHTML = 'Houve um problema de conexão. Verifique sua internet ou tente novamente.';
                    contactError.style.display = 'block';
                    // Ensure error style is applied for network errors
                    contactError.classList.remove('success');
                    contactError.classList.add('error');
                } finally {
                    // Re-enable the submit button
                    contactButton.disabled = false;
                }
            }
        });