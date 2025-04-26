document.addEventListener('DOMContentLoaded', function() {
    const timeElement = document.querySelector('small time');
  
    if (timeElement) {
      const agora = new Date();
      const ano = agora.getFullYear();
      const mes = String(agora.getMonth() + 1).padStart(2, '0');
      const dia = String(agora.getDate()).padStart(2, '0');
      const dataFormatadaParaAtributo = `${ano}-${mes}-${dia}`;
      const diasSemana = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
      const mesesAno = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
      const diaSemana = diasSemana[agora.getDay()];
      const diaMes = agora.getDate();
      const mesAno = mesesAno[agora.getMonth()];
      const anoAtual = agora.getFullYear();
      const dataFormatadaParaExibicao = `${diaMes} de ${mesAno} de ${anoAtual}`;
      const hora = String(agora.getHours()).padStart(2, '0');
      const minuto = String(agora.getMinutes()).padStart(2, '0');
      const horaFormatada = `${hora}:${minuto}`;
  
      timeElement.setAttribute('datetime', dataFormatadaParaAtributo);
      timeElement.textContent = dataFormatadaParaExibicao;
  
      const smallElement = timeElement.parentNode;
      if (smallElement) {
        const textoOriginal = smallElement.textContent;
            const partes = textoOriginal.split(' - ');
            if (partes.length >= 2) {
                smallElement.textContent = `${partes[0].split(':')[0]}: ${dataFormatadaParaExibicao} - ${horaFormatada} - ${partes[2]}`;
            } else {
                smallElement.textContent = `Atualizado em: ${dataFormatadaParaExibicao} - ${horaFormatada} - Daniel Mazzeu`;
            }
        }
    }
});