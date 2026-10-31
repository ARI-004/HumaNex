
import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

def summarize_report(report_text):

    prompt = f"""
    You are a medical report summarization assistant
    helping doctors understand laboratory reports.

    Analyze the following medical report.

    Generate a structured summary containing:

    1. Report Overview
    2. Important Test Results
    3. Values Outside Supplied Reference Ranges
    4. Findings Within Supplied Reference Ranges
    5. Important Observations
    6. Information Requiring Doctor Verification

    Instructions:
    - Preserve all numerical values and units.
    - Never invent missing information.
    - Do not diagnose diseases.
    - Do not recommend medicines or treatments.
    - Do not assume reference ranges if they are missing.
    - Clearly identify unclear or incomplete information.
    - Mention that the summary requires doctor review.

    ADDITIONAL SAFETY INSTRUCTIONS:

1. Do not repeat patient names, medical record
   numbers, addresses or other direct identifiers.

2. Preserve all laboratory values exactly as extracted.

3. Do not omit any abnormal values.

4. Do not claim that laboratory results have been
   independently verified.

5. Distinguish laboratory remarks from AI-generated
   observations.

6. If the report contains incomplete or unclear
   information, explicitly mention it.

7. Never make a diagnosis based only on laboratory
   values.

    MEDICAL REPORT:

    {report_text}
    """

    response = client.models.generate_content(
        model="gemini-3.5-flash-lite",
        contents=prompt
    )

    return response.text
