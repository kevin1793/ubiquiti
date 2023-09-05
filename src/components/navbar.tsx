import React, { Component, useRef,useState } from 'react';
import { render } from 'react-dom';
import "./../components/navbar.css";
import logo from "./../assets/images/logo.png";
import hoverLogo from "./../assets/images/Logo_Hover.png";


  

function Navbar(){

  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  const ImageSwitcher = () => {
    const [isHovered, setIsHovered] = useState(false);
    const image1:any = {logo};
    const image2:any = {hoverLogo}
    const handleHover = () => {
      setIsHovered(!isHovered);
    };

    return (
      <div className="image-container">
        <img
          src={!isHovered ? logo : hoverLogo}
          alt="Image"
          onMouseEnter={handleHover}
          onMouseLeave={handleHover}
        />
      </div>
    );
  };

  return (
    <div id="navbarWrapper">
      <div id="navbarCont">
        <ImageSwitcher/><div id="title">Devices</div><div id="devName">Kevin Claveria</div>
      </div>
    </div>
  )
}

export default Navbar;