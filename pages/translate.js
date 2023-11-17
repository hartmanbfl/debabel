import { useEffect, useState } from 'react'
import styles from '../styles/Translate.module.css'
import { useRouter } from 'next/router'
import * as dotenv from 'dotenv';
import socket from '../src/socket'
import { initializeLivestreamController, livestreamEvent } from '@/src/LivestreamController';

import AudioComponent from '@/src/AudioComponent';
import PageHeaderComponent from '@/src/PageHeaderComponent';
import TranslationBoxComponent from '@/src/TranslationBoxComponent';

dotenv.config();

const Translate = () => {
    const [translate, setTranslate] = useState()
    const [transcript, setTranscript] = useState()
    const [livestream, setLivestream] = useState("OFF");
    const router = useRouter()
    const { serviceId, locale } = router.query

    let language;

    useEffect(() => {
        if (router.isReady) {
            console.log(`Initializing socket for translation page`);
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

        // Register for heartbeats
        initializeLivestreamController();
        socket.emit('register', serviceId);

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

    return (
        <div className={styles.translatePage}>
            <PageHeaderComponent sessionStatus={livestream} />
            <TranslationBoxComponent translate={translate} transcript={transcript} language={language} />
            <AudioComponent locale={locale} translate={translate} />
            {/* */}
            <div className={styles.changeLanguageButton} id="changeLanguageButton">
                <a href={`/?serviceId=${serviceId}`}>Change Language</a>
            </div>
        </div>
    );
}

export default Translate;