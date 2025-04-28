import requests
from bs4 import BeautifulSoup
import re
import time
import os
import csv
from urllib.parse import urlparse, unquote, quote_plus
from colorama import init, Fore, Style

init(autoreset=True)

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0 Safari/537.36"
}

CSV_EMAILS = "csv/targets.csv"
CSV_BLACKLIST = "csv/blacklist.csv"
CSV_BACKUP = "csv/backup.csv"

IGNORED_DOMAINS = [
    "sentry.wixpress.com", 
    "sentry-next.wixpress.com",
    "tiktok.com"
]

TRASH_KEYWORDS = [
    'banner', 
    'action', 
    '2x', 
    'desktop', 
    'mobile', 
    'image', 
    'png',
    'jpg',
    'exemplo',
    'exemple',
    'sentry'
]

EMAIL_REGEX = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'

def load_existing_emails():
    emails = set()
    if os.path.exists(CSV_EMAILS):
        with open(CSV_EMAILS, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if row:
                    emails.add(row[0].strip())
    return emails

def load_blacklist():
    doms = set()
    if os.path.exists(CSV_BLACKLIST):
        with open(CSV_BLACKLIST, mode='r', encoding='utf-8') as f:
            reader = csv.reader(f)
            for row in reader:
                if row:
                    doms.add(row[0].strip())
    return doms

def save_email(email):
    with open(CSV_EMAILS, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([email])

    with open(CSV_BACKUP, mode='a', newline='', encoding='utf-8') as f_backup:
        writer = csv.writer(f_backup)
        writer.writerow([email])

def save_to_blacklist(domain):
    with open(CSV_BLACKLIST, mode='a', newline='', encoding='utf-8') as f:
        writer = csv.writer(f)
        writer.writerow([domain])

def search_bing_links(term, page):
    start = page * 10
    encoded_term = quote_plus(term)
    url = f"https://www.bing.com/search?q={encoded_term}&first={start}&safeSearch=Off"
    
    try:
        resp = requests.get(url, headers=HEADERS)
        if resp.status_code != 200:
            print(f"{Fore.RED}[Error] Failed to search on Bing. Code {resp.status_code}")
            return []

        soup = BeautifulSoup(resp.text, 'html.parser')
        links = []

        for a_tag in soup.find_all('a', href=True):
            href = a_tag['href']
            if href.startswith('http') and '.br' in href:
                links.append(href)

        return list(set(links))
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}[Error] Request failed while searching Bing: {e}")
        return []

def extract_emails(url):
    try:
        resp = requests.get(url, headers=HEADERS, timeout=30)
        if resp.status_code != 200:
            print(f"{Fore.RED}[Error] Failed to retrieve {url}. Status code: {resp.status_code}")
            return []

        if 'text/html' not in resp.headers.get('Content-Type', ''):
            print(f"{Fore.RED}[Warning] Skipping non-HTML content: {url}")
            return []

        text = resp.text
        emails = set(re.findall(EMAIL_REGEX, text))
        decoded_emails = {unquote(email) for email in emails}
        filtered_emails = {email for email in decoded_emails if not any(domain in email for domain in IGNORED_DOMAINS)}
        valid_emails = [email for email in filtered_emails if len(email.split('@')[0]) > 1 and '.' in email.split('@')[1]]
        final_emails = [email for email in valid_emails if not any(keyword in email for keyword in TRASH_KEYWORDS)]
        
        return list(final_emails)
    
    except requests.exceptions.Timeout:
        print(f"{Fore.RED}[Error] Timeout while accessing {url}. Skipping...")
        return []
    except requests.exceptions.RequestException as e:
        print(f"{Fore.RED}[Error] Request failed for {url}: {e}")
        return []
    except Exception as e:
        print(f"{Fore.RED}[Error] Unexpected error accessing {url}: {e}")
        return []

def collect_emails(term, max_pages=3, interval=2):
    existing_emails = load_existing_emails()
    blacklist = load_blacklist()

    for page in range(max_pages):
        print(f"\n{Style.BRIGHT}Page {page + 1} from Bing:")
        links = search_bing_links(term, page)
        if not links:
            print(f"{Fore.RED}No links found. Stopping.")
            break

        for idx, link in enumerate(links):
            domain = urlparse(link).netloc.lower()
            if domain in blacklist:
                print(f"{Fore.LIGHTBLACK_EX}{Style.BRIGHT}[Ignored] {domain} is in the blacklist.")
                continue

            print(f"{Fore.YELLOW}{Style.BRIGHT}[Link] ({idx + 1}/{len(links)}): {link}")
            emails = extract_emails(link)

            if not emails:
                print(f"{Fore.RED}{Style.BRIGHT}[Blocked] No emails found on {domain}. Adding to the blacklist.")
                save_to_blacklist(domain)
                continue

            for email in emails:
                if email not in existing_emails:
                    print(f"{Fore.GREEN}{Style.BRIGHT}[Email] {email}")
                    save_email(email)
                    existing_emails.add(email)

            time.sleep(interval)

if __name__ == "__main__":
    term_to_search = input("Enter search term: ")
    max_pages = int(input("How many pages would you like to search? (e.g., 3): "))
    collect_emails(term_to_search, max_pages=max_pages, interval=1)

    print(f"\n{Style.BRIGHT}{Fore.CYAN}Collection finished successfully.")
