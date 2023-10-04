import React,{useState} from 'react'
import DownloadBtn from './DownloadBtn';

function InputPdfToDoc() {

    const [inpFile , setInpFile] = useState(null)
    const [downloadBtnLink , setDownloadBtnLink] = useState(null)
    const [fileOriginalName , setFileOriginalName] = useState(null)

    function handleFileChange(e) {
        setInpFile(e.target.files[0])
    }

    function disableDownloadBtn() {
      setDownloadBtnLink(null)
      setFileOriginalName(null)
    }

    async function handleFileUpload() {
        if (!inpFile) {
            alert('Please select a PDF file to upload.');
            return;
          }
      
          const formData = new FormData();
          formData.append('pdfFile', inpFile);
      
          try {
            const response = await fetch('http://localhost:8000/convertToDocx', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
              const blob = await response.json();
              console.log(blob);
              setDownloadBtnLink(blob.file)
              setFileOriginalName(blob.originalName)
            } else {
              alert('Error converting PDF to Word.');
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
          }
        };
  return (
    <div>
        <h1>File converter</h1>
        <input type='file' accept='.pdf' onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Convert to Word</button>
        {
          downloadBtnLink && <DownloadBtn link={`/downloadPdfToDocx/${downloadBtnLink}`} name={fileOriginalName} afterClick={disableDownloadBtn}/>
        }
    </div>
  )
}

export default InputPdfToDoc