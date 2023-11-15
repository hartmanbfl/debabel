import React from "react";
import styles from '@/styles/WelcomeMessage.module.css';

const WelcomeMessageComponent = (props) => {
    return ( 
        <div>
            <p className={styles.greeting}>We're here for you!</p>
            <p className={styles.standard}>Because of God's love for us, we love others.  Our vision is to be a blessing to the local community, serving local needs.</p>
            <p className={styles.standard}>We hope you enjoy this translation service.  If there is any other way we can help you, or if you need someone to talk to, please talk to one of the ushers.</p>
            <p className={styles.welcome}>Everyone welcome</p>
        </div>
    )
}

export default WelcomeMessageComponent;