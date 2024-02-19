import styles from '@/styles/WelcomeMessage.module.css';

const WelcomeMessageComponent = ({ churchWelcome }) => {

    return (
        <div>
            <p className={styles.greeting}>{churchWelcome.greeting}</p>
            {/* */}
            {churchWelcome.messages.map((str, index) => (
                <p className={styles.standard}>{str}</p>
            ))}
            <p className={styles.welcome}>{churchWelcome.additionalMessage}</p>
        </div>
    )
}

export default WelcomeMessageComponent;