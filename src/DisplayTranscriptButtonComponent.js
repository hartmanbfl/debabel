import React, { useEffect, useState } from "react";
import styles from '@/styles/DisplayTranscript.module.css'

const DisplayTranscriptButtonComponent = ({ onClick }) => {
    
    return (
        <>
            <div className={styles.transcriptButton}>
                <label className={styles.switch}>
                    <input id='input' type="checkbox" onChange={onChange} />
                    <span className={styles.slider}></span>
                </label>
                <p>Transcript</p>
            </div>
        </>
    )
}

export default DisplayTranscriptButtonComponent;
