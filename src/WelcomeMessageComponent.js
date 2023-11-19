import React, { useEffect, useState } from "react";
import styles from '@/styles/WelcomeMessage.module.css';

const WelcomeMessageComponent = (props) => {
    const [churchProperties, setChurchProperties] = useState({
        greeting: "Welcome",
        message: [],
        additional: ""

    });

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

    useEffect(async () => {
        // Call API and get the reponse
        const response = await fetch(`${serverName}/churchinfo`);
        // Parse the response as JSON
        const data = await response.json();
        const messages = JSON.parse(data.message);
        setChurchProperties({
            greeting: data.greeting,
            message: messages,
            additional: data.additionalWelcome
        })
    }, []);

    return (
        <div>
            <p className={styles.greeting}>{churchProperties.greeting}</p>
            {churchProperties.message.map((str, index) => (
                <p className={styles.standard}>{str}</p>
            ))}
            <p className={styles.welcome}>{churchProperties.additional}</p>
        </div>
    )
}

export default WelcomeMessageComponent;