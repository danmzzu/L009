closest('form');
    const searchButton = searchForm?.querySelector('input[type="submit"], button[type="submit"], button:not([type])');

    if (searchInput && termoBuscaGlobal) {
      searchInput.value = termoBuscaGlobal;
      if (searchButton) {
        searchButton.click();
        // Após a busca inicial, começar a observar por mudanças na página para extrair e navegar
        iniciarObservador();
      } else {
        console.error('content.js - Botão de busca não encontrado.');
        chrome.runtime.sendMessage({ action: 'finalizarExtracao', links: linksExtraidos, mensagem: 'Botão de busca não encontrado.' });
      }
    } else {
      console.error('content.js - Campo de busca não encontrado.');
      chrome.runtime.sendMessage({ action: 'finalizarExtracao', links: linksExtraidos, mensagem: 'Campo de busca não encontrado.' });
    }
  }
});

function iniciarObservador() {
  observer = new MutationObserver(mutationsList => {
    for (const mutation of mutationsList) {
      if (mutation.type === 'childList' || mutation.type === 'subtree') {
        extrairLinksEContinuar();
        break; // Processar a primeira mudança relevante e parar
      }
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

async function extrairLinksEContinuar() {
  console.log('content.js - Página atual:', paginaAtual);
  const linksDestaPagina = Array.from(document.querySelectorAll('a')).map(link => link.href);
  console.log('content.js - Links encontrados nesta página:', linksDestaPagina.length);
  linksExtraidos.push(...linksDestaPagina);
  chrome.runtime.sendMessage({ action: 'linksExtraidos', links: linksExtraidos });

  if (paginaAtual < numPaginasGlobal) {
    const proximoLink = encontrarProximoLinkBing();
    if (proximoLink) {
      console.log('content.js - Próximo link encontrado:', proximoLink);
      paginaAtual++;
      window.location.href = proximoLink;
      await esperar(tempoEsperaGlobal);
      // A próxima página carregará e o observador detectará a mudança
    } else {
      console.log('content.js - Próximo link NÃO encontrado.');
      chrome.runtime.sendMessage({ action: 'finalizarExtracao', links: linksExtraidos, mensagem: 'Fim das páginas de resultados do Bing ou próximo link não encontrado.' });
      if (observer) observer.disconnect();
    }
  } else {
    console.log('content.js - Número máximo de páginas alcançado.');
    chrome.runtime.sendMessage({ action: 'finalizarExtracao', links: linksExtraidos, mensagem: 'Número máximo de páginas de resultados do Bing alcançado.' });
    if (observer) observer.disconnect();
  }
}

function encontrarProximoLinkBing() {
  const proximoLinkElement = document.querySelector('.sb_pagN a');
  if (proximoLinkElement && proximoLinkElement.href) {
    return proximoLinkElement.href;
  }
  console.log('content.js - Elemento de próximo link não encontrado com o seletor .sb_pagN a');
  return null;
}

function esperar(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// A primeira busca é iniciada ao receber a mensagem 'iniciar'