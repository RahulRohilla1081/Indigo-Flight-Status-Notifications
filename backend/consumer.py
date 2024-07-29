
import pika
from twilio.rest import Client
import asyncio
import smtplib
import json
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
import threading
import time
import requests
from index import trigger_flight_update

# Twilio client setup
account_sid = ''
auth_token = ''
client = Client(account_sid, auth_token)

def on_flight_updated(ch, method, properties, body):
    print("on_flight_updated")
    body_str = body.decode('utf-8')
    message_dict = json.loads(body_str)
    data = {
        "flight_id": message_dict["flight_id"]
    }
    url = "http://127.0.0.1:8000/trigger-flight-update"
    response = requests.post(url, json=data)
    print("Status Code:", response.status_code)

def on_sms_received(ch, method, properties, body):
    body_str = body.decode('utf-8')
    message_dict = json.loads(body_str)
    print("Hello world", message_dict)
    message = client.messages.create(
        body=message_dict["body"],
        from_='+18632157814',
        to=f'+91{message_dict["contact"]}'
    )
    print(f"SMS sent to {message_dict['contact']}")

def on_email_received(ch, method, properties, body):
    body_str = body.decode('utf-8')
    message_dict = json.loads(body_str)
    print("Hello world", message_dict)
    
    retries = 3
    print(f"Message sending to {message_dict['to_email']} ")
    from_email = ""
    from_password = ""
    smtp_server = "smtp.gmail.com"
    smtp_port = 587

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = message_dict["to_email"]
    msg['Subject'] = message_dict["subject"]
    msg.attach(MIMEText(message_dict["body"], 'plain'))
 
    for attempt in range(retries):
        try:
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(from_email, from_password)
                server.send_message(msg)
            print(f"Email sent to {message_dict['to_email']} successfully.")
            return True
        except Exception as e:
            print(f"Attempt {attempt + 1} failed: {e}")
            time.sleep(2)
    print(f"Failed to send email to {message_dict['to_email']} after {retries} attempts.")
    
def consume_queue(queue_name, callback):
    while True:
        try:
            connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
            channel = connection.channel()
            channel.queue_declare(queue=queue_name)
            channel.basic_consume(queue=queue_name, auto_ack=True, on_message_callback=callback)
            print(f"Started consuming from {queue_name}")
            channel.start_consuming()
        except (pika.exceptions.AMQPConnectionError, pika.exceptions.ChannelClosed) as e:
            print(f"Connection or channel error: {e}")
            time.sleep(5)  # Wait before retrying

threads = []
for queue, callback in [
    ("delay_email_box", on_email_received), 
    ("delay_sms_box", on_sms_received), 
    ("divert_email_box", on_email_received), 
    ("divert_sms_box", on_sms_received),
    ("terminal_email_box", on_email_received),
    ("terminal_sms_box", on_sms_received),
    ("gate_email_box", on_email_received),
    ("gate_sms_box", on_sms_received),
    ("flight_updates_web", on_flight_updated),
]:
    thread = threading.Thread(target=consume_queue, args=(queue, callback))
    thread.daemon = True
    thread.start()
    threads.append(thread)

try:
    while True:
        time.sleep(1)
except KeyboardInterrupt:
    print("Shutdown signal received")

print("Exiting main thread")
