import React, { useState, useEffect } from 'react';
import styles from '@/styles/Logo.module.css'


const LogoComponent = ({ logo }) => {

    return <div className={styles.logo}> <img src={logo} alt="Church Logo"></img></div>;
}

export default LogoComponent;