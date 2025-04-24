async function sendQuestion(q) {
    const url = 'loo9-loo9-ia-api-production.up.railway.app/';
  
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
            return `Erro ao obter resposta: ${response.status}`;
        }
    
        const data = await response.json();
        return data.answer;
    } catch (error) {
        console.error('Erro ao enviar requisição:', error);
        return 'Ocorreu um erro ao se comunicar com o servidor.';
    }
}
  
const perguntaUsuarioPost = 'qual a capital do brasil';
sendQuestion(perguntaUsuarioPost).then(response => console.log('resposta (POST):', response));

const perguntaUsuarioInsulto = 'você é burro?';
sendQuestion(perguntaUsuarioInsulto).then(response => console.log('resposta (POST - Insulto):', response));