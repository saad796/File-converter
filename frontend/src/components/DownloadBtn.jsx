import React from 'react'

function DownloadBtn(props) {

    async function handleDownloadClick()
    {
        try {
            const response = await fetch(`http://localhost:8000/downloadPdfToDocx/${props.link}`, {
              method: 'Get'
            });
      
            if (response.ok) {
              console.log("Downloading");
            } else {
                const status = await response.json()
              alert(`Error ${status.error}`);
            }
          } catch (error) {
            console.error(error);
            alert('An error occurred while processing your request.');
          }
    }

    const downloadFile = async () => {
        try {
          const response = await fetch(`http://localhost:8000/downloadPdfToDocx/${props.link}`); // Replace with the correct file name
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${props.name}`; // Specify the desired file name
          a.click();
          window.URL.revokeObjectURL(url);
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };

  return (
    <>
        {/* <button onClick={handleDownloadClick}>Download</button> */}
        <button onClick={downloadFile}>Download</button>
    </>
  )
}

export default DownloadBtn