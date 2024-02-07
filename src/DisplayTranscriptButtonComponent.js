import React, { useEffect, useState } from "react";
import styles from '@/styles/DisplayTranscript.module.css'

const DisplayTranscriptButtonComponent = ({ diplayTranscript }) => {
    const [displayTranscript] = useState(false)

    const handleDisplayTranscriptChange = () => {
        setDisplayTranscript(!displayTranscript)
    }

    useEffect(() => {
        console.log(`Display Transcript is now: ${displayTranscript}`);
    }, [displayTranscript]);

    return (
        <>
            <div className={styles.transcriptButton}>
                <label className={styles.switch}>
                    <input id='input' type="checkbox" onChange={handleDisplayTranscriptChange} />
                    <span className={styles.slider}></span>
                </label>
                <p>Transcript</p>
            </div>
        </>
    )
}

export default DisplayTranscriptButtonComponent;
