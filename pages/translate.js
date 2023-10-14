import { useEffect, useState } from 'react'
import styles from '../styles/Translate.module.css'
import { io } from 'socket.io-client'
import { useRouter } from 'next/router'
let socket

const Translate = () => {
    const [translate, setTranslate] = useState()
    const [transcript, setTranscript] = useState()
    const [audio, setAudio] = useState(false)
    const router = useRouter()
    // const {push} = useRouter()
    const {serviceId, language} = router.query

    useEffect(() => {
        if(router.isReady){
   socketInitializer()
        }
  }, [router.isReady])

  const languageMap = {
    "fr": "fr-FR",
    "ar": "ar-001",
    "de": "de-DE",
    "es": "es-US",
    "tr": "tr-TR",
    "uk": "uk-UA"
  }

  const socketInitializer = () => {
    socket = io('https://live-pegasus-first.ngrok-free.app')
    socket.on('connect', () => {
      console.log('connected to the socket')
    })

    socket.on('disconnect', () => {
      console.log('disconnected from the socket')
    })
    
    if(language !== "en" ) {
    const room = `${serviceId}:${language}`; 
    console.log(room)
    socket.emit('join', room)
    }
    const room2 = `${serviceId}:transcript`
    console.log(room2)
    
    socket.emit('join', room2)

    socket.on('transcript', (msg) => {
        console.log(msg , 1)
        setTranscript(msg)
    })

    socket.on('translation', (msg) => {
        console.log(msg)
        setTranslate(msg)
    })
  }

  console.log(transcript, 3)
  console.log(translate, 4)

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
  }, [translate, transcript])

  

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

//   useEffect(() => {
    
//   }, [])

// const test = () => {
//     if(typeof window !== "undefined"){
//         const utterance = new SpeechSynthesisUtterance("testing")
//         window.speechSynthesis.speak(utterance)
//         console.log('test')
//         }
// }


//just english
//text to speech

    return (
        <div className={styles.translatePage}>
            {/* <h1>Debabel</h1> */}
            <div className={styles.logo}>
        <img src='/logo.png' />
        </div>
            <div className={styles.outer}>
            <div id='translationBox' className={styles.translationBox}>
                {/* <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p>
                <p className={styles.translatedText}>ssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssssss</p> */}
            </div>
            </div>
            <div className={styles.audioButton}>
                <label className={styles.switch}>
                    <input id='input' type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
                <p>Audio</p>
            </div>
            <div className={styles.changeLanguageButton}>
                <a href='/?serviceId=580178'>Change Language</a>
            </div>
            {/* <button onClick={speakLastTranslate}>Speak</button> */}
        </div>
    );
}

export default Translate;