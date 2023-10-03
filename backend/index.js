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
          cb(null , "inputFile/pdfFile/")
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

app.post("/convertToDocx" , uploadFile.single('pdfFile') , async (req,res)=>{
    let conversionStatus = false;

    if (!req.file) {
        return res.status(400).json({ status : conversionStatus,error: 'Please upload a PDF file.' });
    }
    const fileName = req.file.filename;
    console.log(fileName);

    const pdfFilePath = `${fileName}`;
    const docxFileName = `${fileName.replace(/\.[^/.]+$/, "")}.docx`;
    const originalDocxFileName = `${req.file.originalname.replace(/\.[^/.]+$/, "")}.docx`;
    const docxFilePath = `outputFile/docFile/${docxFileName}`;

    // Create an empty file
    fs.writeFile(docxFilePath, '', (err) => {
      if (err) {
        console.error('Error creating the file:', err);
      } else {
        console.log(`Docx file '${docxFilePath}' has been created successfully.`);
      }
    });

      let pyResponse;

      exec(`python ./pythonScript/pdfToDoc.py ${pdfFilePath} ${docxFileName}`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error executing Python script: ${error}`);
          return res.status(500).json({Status : conversionStatus,error: 'Script fail please try again.'});
        }
      
        // Log the result
        console.log(`Python script output: ${stdout}`);
        conversionStatus = true;
        pyResponse = stdout
        res.status(200).json({Status : conversionStatus,file : docxFileName , originalName : originalDocxFileName})
      });
})

app.listen(8000,()=> console.log("server is running on port:8000"))
