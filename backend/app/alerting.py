import os
from twilio.rest import Client
from dotenv import load_dotenv
from . import schemas  # make sure your import is relative if this is inside the app package

# Load environment variables from .env file
load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
RECIPIENT_NUMBER = os.getenv("RECIPIENT_PHONE_NUMBER")

# Ensure all variables are loaded
if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, RECIPIENT_NUMBER]):
    raise ValueError("Twilio credentials not found in environment variables.")

client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)

def send_alert(detection: schemas.DetectionRead):
    """Sends SMS and Email alerts for a high-urgency detection."""
    
    issue_type = detection.type.replace('_', ' ').title()
    message_body = (
        f"[InfraSight AI Alert] High Urgency Issue Detected!\n"
        f"Type: {issue_type}\n"
        f"Urgency: {detection.urgency}/5\n"
        f"Location: https://www.google.com/maps?q={detection.location.lat},{detection.location.lon}\n"
        f"Status: {detection.status}"
    )

    try:
        # Send SMS
        sms = client.messages.create(
            body=message_body,
            from_=TWILIO_NUMBER,
            to=RECIPIENT_NUMBER
        )
        print(f"SMS alert sent successfully to {RECIPIENT_NUMBER}. SID: {sms.sid}")

        # TODO: Implement SendGrid email sending here if needed

    except Exception as e:
        print(f"Error sending alert: {e}")