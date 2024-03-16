import React, { useState, useEffect } from 'react';
import styles from '@/styles/Logo.module.css'


const LogoComponent = ({ serverName, tenantId }) => {
    const [imageUrl, setImageUrl] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                if (tenantId) {

                    const response = await fetch(`${serverName}/church/info?tenantId=${tenantId}`)
                    if (!response.ok) {
                        throw new Error("Network response was not OK");
                    }
                    const jsonResponse = await response.json();
                    const data = jsonResponse.responseObject;
                    if (data.base64Logo) {
                        setImageUrl(`${data.base64Logo}`);
                    }
                }
            } catch (error) {
                console.warn(`Error getting church info: ${error}`);
            }
        }
        fetchData();
    }, [tenantId]);


    return <div className={styles.logo}> <img src={imageUrl} alt="Church Logo"></img></div>;
}

export default LogoComponent;