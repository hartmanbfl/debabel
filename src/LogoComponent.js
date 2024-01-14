import React, { useState, useEffect } from 'react';
import styles from '@/styles/Logo.module.css'


const LogoComponent = ( {serverName} ) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        fetch(`${serverName}/churchinfo`)
          .then(response => response.json())
          .then(data => {
              setImageUrl(`${data.base64Logo}`);  
          });
      }, []);


    return <div className={styles.logo}> <img src={imageUrl} alt="Church Logo"></img></div>;
}

export default LogoComponent;