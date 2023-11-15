import React, {useEffect, useState} from "react";
import styles from '@/styles/WelcomeMessage.module.css';

const WelcomeMessageComponent = (props) => {
    const [churchProperties, setChurchProperties] = useState({
        greeting: "Welcome",
        message: "",
        additional: ""

    });

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

    useEffect(() => {
        fetch(`${serverName}/churchinfo`)
          .then(response => response.json())
          .then(data => {
            setChurchProperties({
                greeting: data.greeting,
                message: data.message,
                additional: data.additionalWelcome
            })
          });
      }, []);

    return ( 
        <div>
            <p className={styles.greeting}>{churchProperties.greeting}</p>
            <p className={styles.standard}>{churchProperties.message}</p>
            <p className={styles.standard}>We hope you enjoy this translation service.  If there is any other way we can help you, or if you need someone to talk to, please talk to one of the ushers.</p>
            <p className={styles.welcome}>{churchProperties.additional}</p>
        </div>
    )
}

export default WelcomeMessageComponent;