import React, { useEffect, useState } from "react";
import styles from '@/styles/TranslationBox.module.css'

const TranslationBoxComponent = ({ translate, transcript, language }) => {
    const [churchProperties, setChurchProperties] = useState({
        hostLanguage: "en"
    });

    // Get the Server name from environment variable
    const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

    // Get the host language of the church service
    useEffect(() => {
        const fetchData = async () => {

            const response = await fetch(`${serverName}/church/info`)
                .catch((error) => {
                    console.error(`Warning: unable to get language: ${error}`);
                    return;
                });
            const jsonResponse = await response.json();
            const data = jsonResponse.responseObject;
            setChurchProperties({
                hostLanguage: data.language
            })
        };
        fetchData();
    }, []);

    // Runs anytime translate changes
    useEffect(() => {
        const addTranslate = () => {
            console.log(`Translate: ${translate}, transcript: ${transcript}, hostLang: ${churchProperties.hostLanguage}, langugage: ${language}`);
            const div = document.getElementById('translationBox')
            const outerBox = document.getElementById('translationOuterBox')

            const textPair = document.createElement('div');
            const translateP = document.createElement('p')
            const transcriptP = document.createElement('p')

            textPair.className = styles.translationTranscriptPair
            translateP.className = styles.translatedText
            transcriptP.className = styles.transcriptText
            //            if (language == churchProperties.hostLanguage) {
            //                translateP.textContent = transcript
            //                textPair.appendChild(translateP)
            //            } else {
            translateP.textContent = translate
            transcriptP.textContent = transcript
            textPair.appendChild(translateP)
            textPair.appendChild(transcriptP)
            //            }
            if (language == "ar") {
                outerBox.dir = "rtl"
            } else {
                outerBox.dir = "ltr"
            }


            //            div.appendChild(p)
            div.appendChild(textPair)
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