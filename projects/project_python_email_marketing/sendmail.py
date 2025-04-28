import smtplib
import ssl
import csv
import time
import os
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.utils import formataddr
from colorama import init, Fore, Style
from dotenv import load_dotenv

load_dotenv()
init(autoreset=True)

TARGETS = 'csv/targets.csv'
EMAIL = os.getenv('GMAIL_USERNAME')
PASSWORD = os.getenv('GMAIL_PASSWORD')

if not PASSWORD:
    print(f"{Fore.RED}{Style.BRIGHT}[Error] Password not found in environment variable 'GMAIL_PASSWORD'.")
    exit()

def read_emails(csv_path):
    if not os.path.exists(csv_path):
        print(f"{Fore.RED}{Style.BRIGHT}[Error] File '{csv_path}' not found.")
        exit()
    with open(csv_path, newline='', encoding='utf-8') as f:
        reader = csv.reader(f)
        emails = [row[0].strip() for row in reader if row and row[0].strip()]
    if not emails:
        print(f"{Fore.RED}{Style.BRIGHT}[Error] No valid emails found in '{csv_path}'.")
        exit()
    return emails

def read_html_template(path):
    if not os.path.exists(path):
        print(f"{Fore.RED}{Style.BRIGHT}[Error] HTML template '{path}' not found.")
        exit()
    with open(path, 'r', encoding='utf-8') as f:
        content = f.read().strip()
    if not content:
        print(f"{Fore.RED}{Style.BRIGHT}[Error] HTML template is empty.")
        exit()
    return content

def send_email(recipient, subject, html_body):
    message = MIMEMultipart("alternative")
    message["Subject"] = subject
    message["From"] = formataddr((subject, EMAIL))
    message["To"] = recipient

    html_part = MIMEText(html_body, "html")
    message.attach(html_part)

    context = ssl.create_default_context()

    try:
        with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
            server.login(EMAIL, PASSWORD)
            server.sendmail(EMAIL, recipient, message.as_string())
        return True
    except Exception as e:
        print(f"{Fore.RED}{Style.BRIGHT}[Error] Failed to send to {recipient}: {e}")
        return False

def main():
    subject = input(f"{Fore.CYAN}{Style.BRIGHT}Enter the email subject: {Style.RESET_ALL}").strip()
    emails = read_emails(TARGETS)
    html_body = read_html_template("html/template.html")

    total = len(emails)
    sent = 0
    failed = 0

    print(f"{Fore.CYAN}{Style.BRIGHT}Starting to send {total} emails...\n")

    for i, email in enumerate(emails, start=1):
        print(f"\n{Fore.YELLOW}{Style.BRIGHT}Sending email to: {email}")
        success = send_email(email, subject, html_body)
        if success:
            sent += 1
            status_color = Fore.GREEN + Style.BRIGHT + "[OK]"
        else:
            failed += 1
            status_color = Fore.RED + Style.BRIGHT + "[FAIL]"
        percent = (i / total) * 100
        print(
            f"{status_color} {Style.RESET_ALL}[{i}/{total}] {percent:.1f}% - "
            f"{Fore.GREEN}Sent: {sent}{Style.RESET_ALL}, "
            f"{Fore.RED}Failed: {failed}"
        )

        time.sleep(1)

    print(f"\n{Fore.CYAN}{Style.BRIGHT}Process completed.")
    print(f"{Fore.GREEN}{Style.BRIGHT}Successful: {sent}")
    print(f"{Fore.RED}{Style.BRIGHT}Failed: {failed}")

if __name__ == "__main__":
    main()
