import React, { useEffect, useState } from "react";
import styles from '@/styles/Audio.module.css'

const AudioComponent = ({ locale, translate }) => {
    const [audio, setAudio] = useState(false)

    const handleAudioChange = () => {
        setAudio(!audio)
    }

    useEffect(() => {
        const speak = () => {
            if (audio == true) {
                const utterance = new SpeechSynthesisUtterance(translate)
                utterance.lang = locale
                speechSynthesis.speak(utterance)
            }
        }
        speak();
    }, [translate]);

    useEffect(() => {
        console.log(`Audio is now: ${audio}`);
    }, [audio]);

    return (
        <>
            <div className={styles.audioButton}>
                <label className={styles.switch}>
                    <input id='input' type="checkbox" onChange={handleAudioChange} />
                    <span className={styles.slider}></span>
                </label>
                <p>Audio</p>
            </div>
        </>
    )
}

export default AudioComponent;