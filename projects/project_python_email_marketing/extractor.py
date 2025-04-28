import requests
from bs4 import BeautifulSoup
from urllib.parse import quote_plus, urlparse
import time

# Definir o cabeçalho para simular um navegador
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36"
}

def get_domain(url):
    """Função para extrair o domínio de uma URL."""
    parsed_url = urlparse(url)
    return parsed_url.netloc.lower()

def is_valid_link(url):
    """Função para filtrar URLs que são relevantes e não são redirecionamentos ou anúncios"""
    # Apenas URLs completas e não redirecionamentos
    return url.startswith('http') and 'bing.com' not in url

def search_bing_links(term, max_pages=50):
    links = []
    seen_domains = set()  # Armazenar os domínios já vistos
    for page in range(max_pages):
        start = page * 10
        encoded_term = quote_plus(term)
        url = f"https://www.bing.com/search?q={encoded_term}&first={start}&safeSearch=Off"
        
        try:
            # Requisição ao Bing
            resp = requests.get(url, headers=HEADERS)
            
            if resp.status_code != 200:
                print(f"[Erro] Falha ao buscar no Bing. Código {resp.status_code}")
                break
            
            soup = BeautifulSoup(resp.text, 'html.parser')
            
            # Encontrar todos os links de resultados de busca
            page_links = []
            for link in soup.find_all('a', href=True):
                href = link['href']
                if is_valid_link(href):
                    page_links.append(href)

            if not page_links:
                print(f"[Aviso] Nenhum link encontrado na página {page + 1}")
                break

            # Adicionar links, mas evitar links com o mesmo domínio
            for link in page_links:
                domain = get_domain(link)
                if domain not in seen_domains:
                    links.append(link)
                    seen_domains.add(domain)
            
            print(f"Página {page + 1} processada - Total de links extraídos: {len(links)}")
            
            # Aguardar para evitar sobrecarga no servidor
            time.sleep(2)
        
        except requests.exceptions.RequestException as e:
            print(f"[Erro] Falha ao acessar o Bing: {e}")
            break
        
    return links

def main():
    # Perguntar ao usuário o termo de busca
    search_term = input("Digite o termo de pesquisa: ")
    max_pages = int(input("Quantas páginas você quer extrair? (Máximo 50): "))

    # Coletar as URLs do Bing
    urls = search_bing_links(search_term, max_pages=max_pages)

    # Exibir as URLs encontradas
    print("\nURLs extraídas:")
    for idx, url in enumerate(urls, 1):
        print(f"{idx}. {url}")

if __name__ == "__main__":
    main()
