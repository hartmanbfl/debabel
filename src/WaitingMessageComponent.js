import styles from '@/styles/WelcomeMessage.module.css';

const WaitingMessageComponent = ({ message }) => {

    return (
        <div>
            <p className={styles.waiting}>{message}</p>
        </div>
    )
}

export default WaitingMessageComponent;