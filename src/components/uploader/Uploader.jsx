import React from 'react'
import { useState } from 'react';
import { FileUploader } from "react-drag-drop-files";

import Button from '@mui/material/Button/Button'
import './Uploader.css'
import TextField  from '@mui/material/TextField/TextField';


const Uploader = () => {

    const [file, setFile] = useState();
    const [email, setEmail] = useState("")
    const [message, setMessage] = useState()
    const [emailMessage, setEmailMessage] = useState()

    const AWS = require('aws-sdk');

    function cancelProcess() {
        setMessage("")
        setFile(null)
    }

    function setEmailWithChecks(userEmail) {
        let regex = new RegExp('[a-z0-9]+@[a-z]+\.[a-z]{2,3}');

        if(regex.test(userEmail)){
            setEmail(userEmail)
        }
    }

    const handleChange = (file) => {
        setMessage("")
        setEmailMessage("")
        setFile(file);
    };

    function sendEmail(userEmail, filename) {
        const data = { fileName: filename,  emailAddress: userEmail};

        let url = process.env.REACT_APP_HYYPHENAPIURL

        fetch(url, {
            method: 'POST', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        })
        setEmail("")
    }

    function openFileExplorer() {
        const input = document.createElement('input');
        input.type = 'file';
        input.onchange = e => {
          const file = e.target.files[0];
          setMessage("")
          setEmailMessage("")
          setFile(file)
        };
        input.click();
        
      }

      function uploadFileToS3() {

        if(email.length > 0){
        const s3 = new AWS.S3();

        const fileName = file.name;
        const fileType = file.type;

        const params = {
            Bucket: 'tools.teldio.com/files/tbox',
            Key: fileName,
            Body: file,
            ContentType: fileType,
            ACL: 'public-read'
        };

        s3.config.update({
            accessKeyId: process.env.REACT_APP_AWSACCESSKEY,
            secretAccessKey: process.env.REACT_APP_AWSSECRETKEY
        });


        s3.upload(params, function(err, data) {
            if (err) {
                console.log(err);
                setMessage("Upload Failed, Please try Again")
            } else {
                console.log(data);
                setMessage("Uploaded Successfully")
                sendEmail(email, fileName)
                setFile(null)
            }
        });
    }else{
        setEmailMessage("Please Enter A Valid Email")
    }
}


  return (
    <>
        <div className='itemContainer'>
            {! file ? <FileUploader handleChange={handleChange} name="file"  /> : null}
            {!file ? <Button variant="contained" fullWidth onClick={openFileExplorer}>Add File</Button> : <Button variant="contained" fullWidth onClick={openFileExplorer} disabled>Add File</Button>}
            {file ? <h1>{file.name}</h1> : null}
            {file ? <TextField id="outlined-basic" label="Email" variant="outlined" onChange={e => setEmailWithChecks(e.target.value)} />: null}
            {file ? <h4 className='emailMessage'>{emailMessage}</h4> : null}
            {file ? <Button variant="contained" className="button" fullWidth onClick={uploadFileToS3}>Upload To Teldio</Button> : null} 
            {message ?<h1>{message}</h1> : null}
        </div>

        {file ? <Button variant="text" className="cancelButton" fullWidth onClick={cancelProcess}>Cancel</Button> : null}

    </>
  )
}

export default Uploader
