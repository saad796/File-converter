from pdf2docx import parse
import sys
import os

script_dir = os.path.dirname(os.path.abspath(__file__))


def convertToDoc(pdfFilePath, docFilePath):
    try:
        docx_file = os.path.join(script_dir,f'../outputFile/docFile/{docFilePath}')
        pdf_file = os.path.join(script_dir,f'../inputFile/pdfFile/{pdfFilePath}')
        # Convert PDF to DOCX
        parse(pdf_file, docx_file)
        return "Conversion successful"
    except Exception as e:
        return f"Conversion failed: {str(e)}"

if __name__ == "__main__":
    if len(sys.argv) == 3:
        pdfFilePath = sys.argv[1]
        docFilePath = sys.argv[2]
        result = convertToDoc(pdfFilePath, docFilePath)
        print(result)
    else:
        print("Usage: python convert.py <pdfFilePath> <docFilePath>")
