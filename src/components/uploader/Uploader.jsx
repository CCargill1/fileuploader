import React from "react";
import { useState } from "react";
import { FileUploader } from "react-drag-drop-files";
import { ManagedUpload } from "aws-sdk/clients/s3";

import Button from "@mui/material/Button/Button";
import "./Uploader.css";
import TextField from "@mui/material/TextField/TextField";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";
import { Alert, Box, Snackbar, Stack, Typography } from "@mui/material";
import styled from "@emotion/styled";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import { red } from "@mui/material/colors";

const RoundedTextField = styled(TextField)({
  marginTop: "20px",
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderRadius: "30px",
    },
  },
});

const BigButton = styled(Button)(({ theme }) => ({
  width: "90%",
  height: "40px",
  margin: "20px",
  borderRadius: "50px",
  backgroundColor: "#A0AD39",
  "&:hover": {
    backgroundColor: "#c1cd66",
  },
  fontSize: "17px",
  color: "white",
}));

const CancelButton = styled(Button)(({ theme }) => ({
  color: "#686868",
  fontWeight: "bold",
  fontFamily: "fonts/Oxygen-Light, Segoe UI, Roboto",
  textTransform: "none",
  fontSize: "15px",
  marginTop: "20px",
}));

function LinearProgressWithLabel(props) {
  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" color="text.secondary">{`${Math.round(
          props.value
        )}%`}</Typography>
      </Box>
    </Box>
  );
}

const BorderLinearProgress = styled(LinearProgressWithLabel)(() => ({
  height: 10,
  borderRadius: 5,
  [`&.${linearProgressClasses.colorPrimary}`]: {
    backgroundColor: "#e7ebca",
  },
  [`& .${linearProgressClasses.bar}`]: {
    borderRadius: 5,
    backgroundColor: "#A0AD39",
  },
}));

const Uploader = () => {
  const [file, setFile] = useState();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState();
  const [fileDesc, setFileDesc] = useState("");
  const [emailMessage, setEmailMessage] = useState();
  const [uploadProgress, setUploadProgress] = useState();

  const AWS = require("aws-sdk");
  const [open, setOpen] = React.useState(false);

  const handleClick = () => {
    setOpen(true);
  };

  const handleClose = (event, reason) => {
    setMessage("")
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };
  function cancelProcess() {
    setMessage("");
    setFile(null);
  }

  function setEmailWithChecks(userEmail) {
    let regex = new RegExp("[a-z0-9]+@[a-z]+.[a-z]{2,3}");

    if (regex.test(userEmail)) {
      setEmail(userEmail);
    }
  }

  const handleChange = (file) => {
    setMessage("");
    setUploadProgress(null);
    setEmailMessage("");
    setFile(file);
  };

  function sendEmailViaEmailJS(userEmail, filename, fileLocation) {
    var data = {
      service_id: process.env.REACT_APP_EMAILSERVICEID,
      template_id: "teldiotemplate1",
      user_id: process.env.REACT_APP_EMAILUSERID,
      template_params: {
        customer: userEmail,
        filename: filename,
        fileLocation: fileLocation,
        fileDesc: fileDesc,
      },
    };

    let url = process.env.REACT_APP_EMAILJSAPIURL;

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
  }

  function openFileExplorer() {
    const input = document.createElement("input");
    input.type = "file";
    setUploadProgress(null);

    input.onchange = (e) => {
      const file = e.target.files[0];
      setMessage("");
      setEmailMessage("");
      setFile(file);
    };
    input.click();
  }

  function uploadFileToS3() {
    if (email.length > 0) {
      const s3 = new AWS.S3({
        accessKeyId: process.env.REACT_APP_AWSACCESSKEY,
        secretAccessKey: process.env.REACT_APP_AWSSECRETKEY,
      });

      const fileName = file.name;
      const fileType = file.type;

      const params = {
        Bucket: "tools.teldio.com/files/tbox",
        Key: fileName,
        Body: file,
        ContentType: fileType,
        ACL: "public-read",
      };

      const upload = new ManagedUpload({
        params,
        service: s3,
      });

      upload.on("httpUploadProgress", function (progress) {
        const percentage = Math.round((progress.loaded / progress.total) * 100);
        setUploadProgress(percentage);
      });

      upload.send(function (err, data) {
        if (err) {
          console.log(err);
          setMessage("Upload Failed, Please try Again");
          setUploadProgress(0);
        } else {
          console.log(data);
          setMessage("Uploaded Successfully");
          sendEmailViaEmailJS(email, fileName, data.Location);
          setFile(null);
          setUploadProgress(100);
        }
      });
    } else {
      setEmailMessage("Please Enter A Valid Email");
    }
  }

  // function uploadFileToS3() {
  //   if (email.length > 0) {
  //     const s3 = new AWS.S3();

  //     const fileName = file.name;
  //     const fileType = file.type;

  //     const params = {
  //       Bucket: "tools.teldio.com/files/tbox",
  //       Key: fileName,
  //       Body: file,
  //       ContentType: fileType,
  //       ACL: "public-read",
  //     };

  //     s3.config.update({
  //       accessKeyId: process.env.REACT_APP_AWSACCESSKEY,
  //       secretAccessKey: process.env.REACT_APP_AWSSECRETKEY,
  //     });

  //     s3.upload(params, function (err, data) {
  //       if (err) {
  //         console.log(err);
  //         setMessage("Upload Failed, Please try Again");
  //       } else {
  //         console.log(data);
  //         setMessage("Uploaded Successfully");
  //         //sendEmail(email, fileName, data.Location)
  //         sendEmailViaEmailJS(email, fileName, data.Location);
  //         setFile(null);
  //       }
  //     });
  //   } else {
  //     setEmailMessage("Please Enter A Valid Email");
  //   }
  // }

  return (
    <>
      <div className="itemContainer">
        {!file ? (
          <div style={{ marginTop: "80px", marginBottom: "60px" }}>
            <FileUploader handleChange={handleChange} name="file" />
          </div>
        ) : null}
        {!file && (
          <BigButton variant="contained" fullWidth onClick={openFileExplorer}>
            Add File
          </BigButton>
        )}
        {file && (
          <div>
            <Typography
              variant="subtitle1"
              sx={{
                textAlign: "center",
                maxWidth: "100%",
                wordWrap: "break-word",
                marginTop: "40px",
              }}
            >
              File to Upload:
            </Typography>
            <Typography
              variant="subtitle2"
              sx={{
                textAlign: "center",
                maxWidth: "100%",
                wordWrap: "break-word",
                marginTop: "5px",
              }}
            >
              {file.name}
            </Typography>
          </div>
        )}
        {file && (
          <div>
            <RoundedTextField
              id="outlined-basic"
              label="Your Email Address*"
              error={emailMessage}
              fullWidth
              variant="outlined"
              onChange={(e) => setEmailWithChecks(e.target.value)}
            />
            {emailMessage && (
              <Stack
                direction="row"
                gap={1}
                alignItems="center"
                justifyContent="left"
                sx={{
                  marginTop: "5px",
                  color: "#D32E2E",
                  fontFamily: "fonts/Oxygen-Light",
                }}
              >
                <ErrorOutlineIcon />
                <Typography
                  variant="subtitle2"
                  sx={{ fontFamily: "fonts/Oxygen-Light" }}
                >
                  {emailMessage}
                </Typography>
              </Stack>
            )}
            <RoundedTextField
              id="outlined-basic"
              label="Description of File"
              variant="outlined"
              fullWidth
              onChange={(e) => setFileDesc(e.target.value)}
            />
          </div>
        )}
        {file && uploadProgress && (
          <div style={{ marginTop: "20px" }}>
            <BorderLinearProgress
              variant="determinate"
              value={uploadProgress}
            />
          </div>
        )}
        {file ? (
          <BigButton
            variant="contained"
            className="button"
            fullWidth
            onClick={uploadFileToS3}
            disabled={uploadProgress}
          >
            Upload To Teldio
          </BigButton>
        ) : null}
        <Snackbar open={message} autoHideDuration={6000} onClose={handleClose} sx={{marginTop: "50px"}} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            {message}
          </Alert>
        </Snackbar>
      </div>

      {file ? (
        <CancelButton
          variant="text"
          className="cancelButton"
          fullWidth
          onClick={cancelProcess}
        >
          Cancel
        </CancelButton>
      ) : null}
    </>
  );
};

export default Uploader;
