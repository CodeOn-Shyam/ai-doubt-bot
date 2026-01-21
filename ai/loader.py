import fitz
import docx

def load_pdf(path):
    text = ""
    doc = fitz.open(path)
    for page in doc:
        text += page.get_text()
    return text

def load_docx(path):
    doc = docx.Document(path)
    return "\n".join(p.text for p in doc.paragraphs)
