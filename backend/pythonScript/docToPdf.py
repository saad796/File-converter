import sys
import comtypes.client
import os

script_dir = os.path.dirname(os.path.abspath(__file__))
def convert_doc_to_pdf(docFilePath, pdfFilePath):
    try:
        doc_file = os.path.join(script_dir,f'../inputFile/docFile/{docFilePath}')
        pdf_file = os.path.join(script_dir,f'../outputFile/pdfFile/{pdfFilePath}')
        word = comtypes.client.CreateObject('Word.Application')
        doc = word.Documents.Open(doc_file)
        doc.SaveAs(pdf_file, FileFormat=17)  # 17 represents PDF format
        doc.Close()
        word.Quit()
        print(f'Conversion completed successfully. Output PDF file: {pdf_file}')
    except Exception as e:
        print(f'Error during conversion: {str(e)}')

if __name__ == "__main__":
    if len(sys.argv) == 3:
        input_doc_file = sys.argv[1]
        output_pdf_file = sys.argv[2]
        convert_doc_to_pdf(input_doc_file, output_pdf_file)
    else:
        print("Usage: python script.py <input_doc_file> <output_pdf_file>")
