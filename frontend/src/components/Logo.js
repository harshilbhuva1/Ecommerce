import React from 'react';
import logo from '../assest/logo.png';


const Logo = ({ w = 80, h = 120, className = '' }) => (
  <img
    src={logo}
    alt="Logo"
    width={w}
    height={h}
    className={`object-contain ${className}`}
  />
);

export default Logo;
