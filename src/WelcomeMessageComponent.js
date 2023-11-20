import React, { useEffect, useState } from "react";
import styles from '@/styles/WelcomeMessage.module.css';

const WelcomeMessageComponent = ({ serverName }) => {
    const [greeting, setGreeting] = useState("Welcome");
    const [additionalMessage, setAdditionalMessage] = useState("");
    const [messageArray, setMessageArray] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            // Call API and get the reponse
            const response = await fetch(`${serverName}/churchinfo`);
            // Parse the response as JSON
            const data = await response.json();
            const messages = JSON.parse(data.message);
            setGreeting(data.greeting);
            setMessageArray(messages);
            setAdditionalMessage(data.additionalWelcome);
        }
        fetchData();
    }, []);

    return (
        <div>
            <p className={styles.greeting}>{greeting}</p>
            {/* */}
            {messageArray.map((str, index) => (
                <p className={styles.standard}>{str}</p>
            ))}
            <p className={styles.welcome}>{additionalMessage}</p>
        </div>
    )
}

export default WelcomeMessageComponent;