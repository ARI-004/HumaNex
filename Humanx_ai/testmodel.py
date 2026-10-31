
import os
from dotenv import load_dotenv
from google import genai

# Load environment variables
load_dotenv()

# Get API key
api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise ValueError("Gemini API key not found!")

# Initialize Gemini client
client = genai.Client(api_key=api_key)

from app.pdf_processor import extract_text_from_pdf
from app.summerizer import summarize_report

report_text = extract_text_from_pdf(
    "uploads/sample_cbc.pdf"
)

summary = summarize_report(report_text)

print(summary)