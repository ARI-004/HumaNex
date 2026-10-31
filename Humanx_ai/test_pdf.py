
from app.pdf_processor import extract_text_from_pdf

pdf_path = "uploads/sample_cbc.pdf"

report_text = extract_text_from_pdf(pdf_path)

print("========== EXTRACTED REPORT ==========")
print(report_text)
