import { useEffect, useState } from 'react'
import styles from '../styles/Translate.module.css'
import { useRouter } from 'next/router'
import * as dotenv from 'dotenv';
import socket from '../src/socket'
import { livestreamEvent } from '@/src/LivestreamController';
import PageHeaderComponent from '@/src/PageHeaderComponent';

dotenv.config();

const Translate = () => {
    const [audio, setAudio] = useState(false)
    const [translate, setTranslate] = useState()
    const [transcript, setTranscript] = useState()
    const [livestream, setLivestream] = useState("OFF");
    const router = useRouter()
    const { serviceId, locale } = router.query

    let language;

    useEffect(() => {
        if (router.isReady) {
            socketInitializer()
        }
    }, [router.isReady])

    const languageMap = {
        "ar": "ar-001",
        "de": "de-DE",
        "es": "es-US",
        "fa": "fa-IR",
        "fr": "fr-FR",
        "hi": "hi-IN",
        "ru": "ru-RU",
        "tr": "tr-TR",
        "uk": "uk-UA",
        "zh": "zh-CN",
    }

    const getCountryCode = (code) => {
        const REG = /^([a-z]{2})-([A-Z]{2})$/;
        const match = code.match(REG);
        if (!match || match.length < 1) return '';
        return match[2];
    }
    const getLanguage = (locale) => {
        const lang = new Intl.Locale(locale).language;
        return lang;
    }

    const socketInitializer = () => {

        language = getLanguage(locale);

        document.getElementById('changeLanguageButton').addEventListener('click', () => {
            const room = `${serviceId}:${language}`;
            console.log(`Leaving room ${room}`);
            socket.emit('leave', room);

            // Also leave the transcript
            const transcriptRoom = `${serviceId}:transcript`;
            socket.emit('leave', transcriptRoom);
        })

        if (language !== "en") {
            const room = `${serviceId}:${language}`;
            console.log(`Joining room: ${room}`)
            socket.emit('join', room)
        }
        const transcriptRoom = `${serviceId}:transcript`
        console.log(`Joining ${transcriptRoom}`)

        socket.emit('join', transcriptRoom)

        socket.on('transcript', (msg) => {
            console.log(`Transcript: ${msg}`)
            setTranscript(msg)
        })

        socket.on('translation', (msg) => {
            console.log(`Translation: ${msg}`)
            setTranslate(msg)
        })

        // Register for Livestream Events
        const subscription = livestreamEvent.subscribe((event) => {
            setLivestream(event.status);
        })
    }

    // Runs anytime translate changes
    useEffect(() => {
        const addTranslate = () => {
            const div = document.getElementById('translationBox')
            const outerBox = document.getElementById('translationOuterBox')
            const p = document.createElement('p')
            p.className = styles.translatedText
            // console.log(language)
            if (language == "en") {
                console.log('yes')
                p.textContent = transcript
            } else {
                p.textContent = translate
            }
            if (language == "ar") {
                outerBox.dir = "rtl"
            } else {
                outerBox.dir = "ltr"
            }
            div.appendChild(p)
            div.scrollTo(0, div.scrollHeight)
            // console.log(audio)
            if (audio == true) {
                console.log('test')
                const utterance = new SpeechSynthesisUtterance(translate)
                utterance.lang = languageMap[language]
                console.log(languageMap[language])
                speechSynthesis.speak(utterance)
            }

        }

        addTranslate()
    }, [translate])



    // Runs on every render
    useEffect(() => {
        document.getElementById('input').addEventListener('change', () => {
            if (audio == false) {
                setAudio(true)
                const speakLastTranslate = () => {
                    const utterance = new SpeechSynthesisUtterance(translate)
                    utterance.lang = languageMap[language]
                    console.log(languageMap[language])
                    speechSynthesis.speak(utterance)
                }
                speakLastTranslate()
            } else {
                setAudio(false)
            }
        })
    })

    return (
        <div className={styles.translatePage}>
            {/* <h1>Debabel</h1> */}
            <PageHeaderComponent sessionStatus={livestream} />
            <div className={styles.outer} id='translationOuterBox'>
                <div id='translationBox' className={styles.translationBox}>
                </div>
            </div>
            <div className={styles.audioButton}>
                <label className={styles.switch}>
                    <input id='input' type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
                <p>Audio</p>
            </div>
            <div className={styles.changeLanguageButton} id="changeLanguageButton">
                <a href={`/?serviceId=${serviceId}`}>Change Language</a>
            </div>
        </div>
    );
}

export default Translate;