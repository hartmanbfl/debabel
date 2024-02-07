import React, {useEffect, useState} from "react";
import styles from '@/styles/TranslationBox.module.css'

const TranslationBoxComponent = ({ translate, transcript, language, displayTranscript }) => {
    const [churchProperties, setChurchProperties] = useState({
        hostLanguage: "en"
    });

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

    // Get the host language of the church service
    useEffect(() => {
        fetch(`${serverName}/churchinfo`)
            .then(response => response.json())
            .then(data => {
                setChurchProperties({
                    hostLanguage: data.language
                })
            });
    }, []);

    // Runs anytime translate changes
    useEffect(() => {
        const addTranslate = () => {
            console.log(`Translate: ${translate}, transcript: ${transcript}, hostLang: ${churchProperties.hostLanguage}, language: ${language}`);
            const div = document.getElementById('translationBox')
            const outerBox = document.getElementById('translationOuterBox')

            if (displayTranscript == true) {
                const textPair = document.createElement('div');
                const translateP = document.createElement('p')
                const transcriptP = document.createElement('p')
                
                textPair.className = styles.translationTranscriptPair
                translateP.className = styles.translatedText
                transcriptP.className = styles.transcriptText

                translateP.textContent = translate
                transcriptP.textContent = transcript
                textPair.appendChild(translateP)
                textPair.appendChild(transcriptP)
                div.appendChild(textPair)
            }
            else
            {
                const textSingle = document.createElement('div');
                const translateP = document.createElement('p')

                textSingle.classname = styles.translationTranscriptPair
                translateP.className = styles.translatedText

                translateP.textContent = translate

                textSingle.appendChild(translateP)
                div.appendChild(textSingle)
            }

            if (language == "ar" || language == "fa") {
                outerBox.dir = "rtl"
            } else {
                outerBox.dir = "ltr"
            }
            
            div.scrollTo(0, div.scrollHeight)
        }

        addTranslate()
    }, [translate])

    return (
        <div className={styles.outer} id='translationOuterBox'>
            <div id='translationBox' className={styles.translationBox}>
            </div>
        </div>
    )
}

export default TranslationBoxComponent;
