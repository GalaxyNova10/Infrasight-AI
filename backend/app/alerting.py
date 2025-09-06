import os
from twilio.rest import Client
from dotenv import load_dotenv
from . import schemas # Use the main schemas file

# Load environment variables from .env file
load_dotenv()

TWILIO_ACCOUNT_SID = os.getenv("TWILIO_ACCOUNT_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")
RECIPIENT_NUMBER = os.getenv("RECIPIENT_PHONE_NUMBER")

# Ensure all variables are loaded
if not all([TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_NUMBER, RECIPIENT_NUMBER]):
    # This is not a fatal error during development if you don't have Twilio set up
    print("WARNING: Twilio credentials not fully configured. Alerts will not be sent.")
    client = None
else:
    client = Client(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN)


# --- THIS IS THE FIX ---
# We now use the correct 'InfrastructureIssue' schema that exists in your schemas.py file
def send_alert(detection: schemas.InfrastructureIssue):
    """Sends SMS alerts for a high-urgency detection."""
    if not client:
        print("[INFO] Twilio client not available. Skipping alert.")
        return

    issue_type = detection.title.replace('_', ' ').title()
    message_body = (
        f"[InfraSight AI Alert] High Urgency Issue Detected!\n"
        f"Type: {issue_type}\n"
        f"Location: {detection.address}\n"
        f"Status: {detection.status.value}" # Use .value for enums
    )

    try:
        sms = client.messages.create(
            body=message_body,
            from_=TWILIO_NUMBER,
            to=RECIPIENT_NUMBER
        )
        print(f"SMS alert sent successfully. SID: {sms.sid}")
    except Exception as e:
        print(f"Error sending Twilio alert: {e}")