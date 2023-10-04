import React,{useState} from 'react'
import DownloadBtn from './DownloadBtn';

function InputDocToPdf() {
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
            alert('Please select a DOC file to upload.');
            return;
          }
      
          const formData = new FormData();
          formData.append('docFile', inpFile);
      
          try {
            const response = await fetch('http://localhost:8000/docToPdf', {
              method: 'POST',
              body: formData,
            });
      
            if (response.ok) {
              const blob = await response.json();
              console.log(blob);
              setDownloadBtnLink(blob.file)
              setFileOriginalName(blob.originalName)
            } else {
              alert('Error converting DOC to PDF.');
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
          }
        };
  return (
    <div>
        <h1>DOC to PDF converter</h1>
        <input type='file' accept='word' onChange={handleFileChange} />
        <button onClick={handleFileUpload}>Convert to PDF</button>
        {
          downloadBtnLink && <DownloadBtn link={`/downloadDocToPdf/${downloadBtnLink}`} name={fileOriginalName} afterClick={disableDownloadBtn}/>
        }
    </div>
  )
}

export default InputDocToPdf