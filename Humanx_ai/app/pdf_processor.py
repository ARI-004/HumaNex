
import pymupdf

def extract_text_from_pdf(pdf_path):

    document = pymupdf.open(pdf_path)

    extracted_text = ""

    for page in document:
        extracted_text += page.get_text() + "\n"

    document.close()

    if not extracted_text.strip():
        raise ValueError(
            "No readable text found in PDF. OCR may be required."
        )

    return extracted_text
