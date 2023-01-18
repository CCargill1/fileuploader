import React from 'react'
import "./Modal.css"

import TextField from '@mui/material/TextField/TextField'
import Button from '@mui/material/Button/Button'
import logo from "../../assets/Teldio-Logo-Color.png"

import Uploader from '../uploader/Uploader'
const Modal = () => {
  return (
    <>
    <div className='container'>
        <div className='modal'>
            <div className='bannerContainer'>
                <img src={logo} alt="Teldio Logo" className='logo' />
            </div>
            
            <Uploader />            
            
        </div>
        
    </div>
    </>
  )
}

export default Modal