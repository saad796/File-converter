import React from 'react'

function DownloadBtn(props) {
    const downloadFile = async () => {
        try {
          const response = await fetch(`http://localhost:8000${props.link}`); 
          const blob = await response.blob();
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${props.name}`; 
          a.click();
          window.URL.revokeObjectURL(url);
          props.afterClick()
        } catch (error) {
          console.error('Error downloading file:', error);
        }
      };

  return (
    <>
        <button onClick={downloadFile}>Download</button>
    </>
  )
}

export default DownloadBtn