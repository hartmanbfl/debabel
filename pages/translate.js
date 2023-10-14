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

  const socketInitializer = () => {
    socket = io('https://live-pegasus-first.ngrok-free.app')
    socket.on('connect', () => {
      console.log('connected to the socket')
    })

    socket.on('disconnect', () => {
      console.log('disconnected from the socket')
    })

    const room = `${serviceId}:${language}`; 
    const room2 = `${serviceId}:transcript`
    console.log(room)
    socket.emit('join', room)
    socket.emit('join', room2)

    socket.on('transcript', (msg) => {
        console.log(msg)
        setTranscript(msg)
    })

    socket.on('translation', (msg) => {
        console.log(msg)
        setTranslate(msg)
    })
  }

  useEffect(() => {
    const addTranslate = () => {
        const div = document.getElementById('translationBox')
        const p = document.createElement('p')
        p.className = styles.translatedText
        p.textContent = translate
        div.appendChild(p)
        div.scrollTo(0, div.scrollHeight)
        // const synth = window.speechSynthesis
        // const utterance = new SpeechSynthesisUtterance(translate)
        // synth.speak(utterance)
    }

    addTranslate()
  }, [translate])

//   document.getElementById('input').addEventListener('change', () => {
//     if (audio == false) {
//     setAudio(true)
//     } else {
//         setAudio(false)
//     }
//   })

    return (
        <div className={styles.translatePage}>
            <h1>Debabel</h1>
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
            <div>
                <label className={styles.switch}>
                    <input type="checkbox" />
                    <span className={styles.slider}></span>
                </label>
            </div>
            <div className={styles.changeLanguageButton}>
                <a>Change Language</a>
            </div>
        </div>
    );
}

export default Translate;