async function fazerPerguntaPost(pergunta) {
    const url = 'http://localhost:3000/question';
  
    try {
      const resposta = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ question: pergunta }),
      });
  
      if (!resposta.ok) {
        const erro = await resposta.json();
        console.error('Erro na requisição:', erro);
        return `Erro ao obter resposta: ${resposta.status}`;
      }
  
      const data = await resposta.json();
      return data.answer;
    } catch (error) {
      console.error('Erro ao enviar requisição:', error);
      return 'Ocorreu um erro ao se comunicar com o servidor.';
    }
  }
  
  // Exemplo de uso:
  const perguntaUsuarioPost = 'qual a capital do brasil';
  fazerPerguntaPost(perguntaUsuarioPost)
    .then(resposta => console.log('Resposta (POST):', resposta));
  
  const perguntaUsuarioInsulto = 'você é burro?';
  fazerPerguntaPost(perguntaUsuarioInsulto)
    .then(resposta => console.log('Resposta (POST - Insulto):', resposta));