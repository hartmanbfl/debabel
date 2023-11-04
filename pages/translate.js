import { useEffect, useState } from 'react'
import styles from '../styles/Translate.module.css'
import { io } from 'socket.io-client'
import { useRouter } from 'next/router'
import * as dotenv from 'dotenv';
let socket

dotenv.config();

const Translate = () => {
    const [audio, setAudio] = useState(false)
    const [translate, setTranslate] = useState()
    const [transcript, setTranscript] = useState()
    const router = useRouter()
    const { serviceId, language } = router.query

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

    const socketInitializer = () => {
        const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;
        socket = io(serverName)
        console.log(`Connecting to server: ${serverName}`)
        socket.on('connect', () => {
            console.log('connected to the socket')
        })

        document.getElementById('changeLanguageButton').addEventListener('click', () => {
            const room = `${serviceId}:${language}`;
            console.log(`Leaving room ${room}`);
            socket.emit('leave', room);
        })

        socket.on('disconnect', () => {
            console.log('disconnected from the socket')
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
    }

    useEffect(() => {
        const addTranslate = () => {
            const div = document.getElementById('translationBox')
            const p = document.createElement('p')
            p.className = styles.translatedText
            // console.log(language)
            if (language == "en") {
                console.log('yes')
                p.textContent = transcript
            } else {
                p.textContent = translate
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
            <div className={styles.logo}>
                <img src='/logo.png' />
            </div>
            <div className={styles.outer}>
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
                <a href={'/?serviceId=' + serviceId}>Change Language</a>
            </div>
        </div>
    );
}

export default Translate;