const express = require("express")
const multer = require("multer")
const bodyParser = require("body-parser")
const cors = require("cors")
const libre = require('libreoffice-convert');
const fs = require("fs")
const path = require("path")
const { exec } = require('child_process');
const uuid = require('uuid'); // Import UUID library
const { stdout } = require("process");

const app = express()
app.use(cors())


const storage =multer.diskStorage({
  destination : (req,file,cb)=>{
        if(file.fieldname === 'pdfFile')
        {
          cb(null , "inputFile/pdfFile/")
        }
        else if(file.fieldname === 'docFile')
        {
          cb(null , "inputFile/docFile/")
        }
  },
  filename : (req,file,cb)=>{
          cb(null , "File"+uuid.v4()+path.extname(file.originalname))
  }
});
const uploadFile = multer({ storage: storage });

app.get("/downloadPdfToDocx/:id",(req,res)=>{
    const fileName = req.params.id;
    const filePath = `./outputFile/docFile/${fileName}`;
    const downloadStatus = false;

    if (fs.existsSync(filePath)) {
      res.download(filePath, (err) => {
        if (err) {
          console.error('Error sending file:', err);
          res.status(500).json({status : downloadStatus,error:'Error sending file.'});
        } else {
          // File has been sent for download, now remove it
          fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting file:', unlinkErr);
            } else {
              console.log('File deleted successfully.');
            }
          });
        }
      });
    } else {
      res.status(404).json({status : downloadStatus,error:'File not Found.Please convert again.'});
    }
})

app.get("/downloadDocToPdf/:id",(req,res)=>{
  const fileName = req.params.id;
  const filePath = `./outputFile/pdfFile/${fileName}`;
  const downloadStatus = false;

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error('Error sending file:', err);
        res.status(500).json({status : downloadStatus,error:'Error sending file.'});
      } else {
        // File has been sent for download, now remove it
        fs.unlink(filePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting file:', unlinkErr);
          } else {
            console.log('File deleted successfully.');
          }
        });
      }
    });
  } else {
    res.status(404).json({status : downloadStatus,error:'File not Found.Please convert again.'});
  }
})

app.post("/convertToDocx" , uploadFile.single('pdfFile') , async (req,res)=>{
    let conversionStatus = false;

    if (!req.file) {
        return res.status(400).json({ status : conversionStatus,error: 'Please upload a PDF file.' });
    }
    const fileName = req.file.filename;
    console.log(fileName);

    const pdfFileName = `${fileName}`;
    const docxFileName = `${fileName.replace(/\.[^/.]+$/, "")}.docx`;
    const originalDocxFileName = `${req.file.originalname.replace(/\.[^/.]+$/, "")}.docx`;
    const docxFilePath = `outputFile/docFile/${docxFileName}`;
    const pdfFilePath = `inputFile/pdfFile/${pdfFileName}`;

    // Create an empty file
    fs.writeFile(docxFilePath, '', (err) => {
      if (err) {
        console.error('Error creating the file:', err);
      } else {
        console.log(`Docx file '${docxFilePath}' has been created successfully.`);
      }
    });

      let pyResponse;

      exec(`python ./pythonScript/pdfToDoc.py ${pdfFileName} ${docxFileName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          return res.status(500).json({Status : conversionStatus,error: 'Script fail please try again.'});
        }
      
        // Log the result
        console.log(`Python script output: ${stdout}`);
        conversionStatus = true;
        pyResponse = stdout;

        fs.unlink(pdfFilePath, (unlinkErr) => {
            if (unlinkErr) {
              console.error('Error deleting pdf file:', unlinkErr);
            } else {
              console.log('pdf File deleted successfully.');
            }
        });

        res.status(200).json({Status : conversionStatus,file : docxFileName , originalName : originalDocxFileName})
      });
})

app.post("/docToPdf",uploadFile.single("docFile"),(req,res)=>{
  let conversionStatus = false; //for sending error status to client

  if (!req.file) {
      return res.status(400).json({ status : conversionStatus,error: 'Please upload a Doc file.' });
  }
  const fileName = req.file.filename;
  console.log(fileName);
  const docFileExt = path.extname(fileName);
  console.log(docFileExt);
  const docFileName = `${fileName}`;
  const pdfFileName = `${fileName.replace(/\.[^/.]+$/, "")}.pdf`;
  const originalPdfFileName = `${req.file.originalname.replace(/\.[^/.]+$/, "")}.pdf`;
  const pdfFilePath = `./outputFile/pdfFile/${pdfFileName}`;
  const docFilePath = `./inputFile/docFile/${docFileName}`;

  fs.writeFile(pdfFilePath, '', (err) => {
    if (err) {
      console.error('Error creating the file:', err);
    } else {
      console.log(`Pdf file '${pdfFilePath}' has been created successfully.`);
    }
  });

  if(docFileExt === ".doc")
  {
    exec(`python ./pythonScript/docToPdf.py ${docFileName} ${pdfFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return res.status(500).json({Status : conversionStatus,error: 'Script fail please try again.'});
      }
    
      // Log the result
      console.log(`Python script output: ${stdout}`);
      conversionStatus = true;
  
      fs.unlink(docFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting DOC file:', unlinkErr);
          } else {
            console.log('pdf File deleted successfully.');
          }
      });
  
      res.status(200).json({Status : conversionStatus,file : pdfFileName , originalName : originalPdfFileName})
    });
  }
  else if(docFileExt === ".docx")
  {
    exec(`python ./pythonScript/docxToPdf.py ${docFileName} ${pdfFileName}`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing Python script: ${error}`);
        return res.status(500).json({Status : conversionStatus,error: 'Script fail please try again.'});
      }
    
      // Log the result
      console.log(`Python script output: ${stdout}`);
      conversionStatus = true;
  
      fs.unlink(docFilePath, (unlinkErr) => {
          if (unlinkErr) {
            console.error('Error deleting DOC file:', unlinkErr);
          } else {
            console.log('pdf File deleted successfully.');
          }
      });
  
      res.status(200).json({Status : conversionStatus,file : pdfFileName , originalName : originalPdfFileName})
    });
  }

})

app.listen(8000,()=> console.log("server is running on port:8000"))
