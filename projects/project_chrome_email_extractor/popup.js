document.addEventListener('DOMContentLoaded', () => {
  const termoBusca = document.getElementById('termoBusca');
  const numPaginas = document.getElementById('numPaginas');
  const tempoEspera = document.getElementById('tempoEspera');
  const iniciarBusca = document.getElementById('iniciarBusca');
  const copiarLinks = document.getElementById('copiarLinks');
  const listaDeLinks = document.getElementById('listaDeLinks');
  const status = document.getElementById('status');

  // Load saved settings
  chrome.storage.local.get(['searchTerm', 'pageCount', 'delay'], (result) => {
    if (result.searchTerm) termoBusca.value = result.searchTerm;
    if (result.pageCount) numPaginas.value = result.pageCount;
    if (result.delay) tempoEspera.value = result.delay;
  });

  iniciarBusca.addEventListener('click', async () => {
    const searchTerm = termoBusca.value.trim();
    const pageCount = parseInt(numPaginas.value);
    const delay = parseInt(tempoEspera.value);

    if (!searchTerm) {
      status.textContent = 'Please enter a search term';
      return;
    }

    // Save settings
    chrome.storage.local.set({
      searchTerm: searchTerm,
      pageCount: pageCount,
      delay: delay
    });

    status.textContent = 'Starting search...';
    iniciarBusca.disabled = true;
    listaDeLinks.value = '';

    try {
      // Get current active tab
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      
      // Execute script in the tab
      await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        func: startBingSearch,
        args: [searchTerm, pageCount, delay]
      });

      // Listen for messages from the content script
      chrome.runtime.onMessage.addListener(function messageListener(message) {
        if (message.type === 'status') {
          status.textContent = message.text;
        } else if (message.type === 'link') {
          listaDeLinks.value += message.url + '\n';
        } else if (message.type === 'complete') {
          status.textContent = `Completed! Found ${message.count} links.`;
          iniciarBusca.disabled = false;
          chrome.runtime.onMessage.removeListener(messageListener);
        }
      });
    } catch (error) {
      status.textContent = `Error: ${error.message}`;
      iniciarBusca.disabled = false;
    }
  });

  copiarLinks.addEventListener('click', () => {
    listaDeLinks.select();
    document.execCommand('copy');
    status.textContent = 'Links copied to clipboard!';
    setTimeout(() => status.textContent = '', 2000);
  });
});

// Function to be executed in the page context
function startBingSearch(searchTerm, pageCount, delay) {
  async function extractLinksFromPage() {
    const links = Array.from(document.querySelectorAll('h2 > a[href^="http"]'))
      .map(a => a.href)
      .filter(href => !href.includes('bing.com'));
    
    // Send links to popup
    links.forEach(url => {
      chrome.runtime.sendMessage({ type: 'link', url: url });
    });
    
    return links.length;
  }

  async function navigateToNextPage(pageNum) {
    if (pageNum >= pageCount) return;

    const nextPageLink = document.querySelector('a.sb_pagN');
    if (!nextPageLink) return;

    chrome.runtime.sendMessage({ 
      type: 'status', 
      text: `Processing page ${pageNum + 1}/${pageCount}...` 
    });

    nextPageLink.click();
    
    // Wait for page to load
    await new Promise(resolve => {
      setTimeout(resolve, delay);
    });

    const count = await extractLinksFromPage();
    await navigateToNextPage(pageNum + 1);
  }

  // Start the process
  (async () => {
    // Go to Bing with search term
    window.location.href = `https://www.bing.com/search?q=${encodeURIComponent(searchTerm)}`;
    
    // Wait for page to load
    await new Promise(resolve => {
      const checkLoaded = setInterval(() => {
        if (document.querySelector('h2 > a[href^="http"]')) {
          clearInterval(checkLoaded);
          resolve();
        }
      }, 500);
    });

    const initialCount = await extractLinksFromPage();
    await navigateToNextPage(1);

    chrome.runtime.sendMessage({ 
      type: 'complete', 
      count: initialCount 
    });
  })();
}