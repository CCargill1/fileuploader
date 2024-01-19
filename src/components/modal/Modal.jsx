import React from "react";
import "./Modal.css";

import logo from "../../assets/Teldio-Logo-Color.png";

import Uploader from "../uploader/Uploader";
import { Typography } from "@mui/material";
const Modal = () => {
  return (
    <>
      <div
        style={{
          width: "100%",
          height: "70px",
          backgroundColor: "#424242",
          display: "flex",
          justifyContent: "right",
          alignItems: "center",
          fontFamily: "fonts/Oxygen-Light",
        }}
      >
        <Typography
          sx={{
            width: "100%",
            color: "white",
            fontFamily: "inherit",
            textAlign: "center",
          }}
          variant="h4"
        >
          Teldio File Uploader
        </Typography>
        <img
          src="assets/logo.png"
          alt="teldio logo"
          style={{
            height: "35px",
            marginRight: "15px",
            position: "absolute",
          }}
        />
      </div>
      <div className="container">
        <div
          style={{
            backgroundColor: "white",
            marginTop: "50px",
            width: "clamp(400px, 60%, 500px)",
            borderRadius: "30px",
            boxShadow: "15px 15px 19px rgba(0, 0, 0, 0.1)",
            padding: "20px 20px 40px 20px",
          }}
        >
          <div className="bannerContainer">
            <img src={logo} alt="Teldio Logo" className="logo" />
          </div>
          <Uploader />
        </div>
      </div>
    </>
  );
};

export default Modal;
