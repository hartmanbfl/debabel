import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import socket from '../src/socket'
import { getLanguage } from '@/src/Utilities'

import AudioComponent from '@/src/AudioComponent'
import LogoComponent from '@/src/LogoComponent'
import LanguageButtonDropdownComponent from '@/src/LanguageButtonDropdownComponent'
import PageHeaderComponent from '@/src/PageHeaderComponent'
import WelcomeMessageComponent from '@/src/WelcomeMessageComponent'
import ServiceStatusComponent from '@/src/ServiceStatusComponent'
import TranslationBoxComponent from '@/src/TranslationBoxComponent'
import WaitingMessageComponent from '@/src/WaitingMessageComponent'
import ChangeLanguageButtonComponent from '@/src/ChangeLanguageButtonComponent'
import LivestreamComponent from '@/src/LivestreamComponent'

const Home = () => {
  const router = useRouter()

  // Get any query parameters
  const { serviceId } = router.query;

  const [livestream, setLivestream] = useState("OFF");
  const [languageMap, setLanguageMap] = useState([]);
  const [defaultServiceId, setDefaultServiceId] = useState("");
  const [serviceCode, setServiceCode] = useState("")
  const [serviceReady, setServiceReady] = useState(false);

  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translate, setTranslate] = useState()
  const [transcript, setTranscript] = useState()

  const [translationLanguage, setTranslationLanguage] = useState();
  const [translationLocale, setTranslationLocale] = useState();


  const [churchWelcome, setChurchWelcome] = useState({
    greeting: "",
    messages: [],
    additionalMessage: "",
    waiting: ""
  });

  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

  // Keep track of when things change
  useEffect(() => {
    console.log(`Updated Settings:\n\tLanguage: ${translationLanguage}\n\tLocale: ${translationLocale}\n\tService: ${serviceCode}`);
  },[serviceCode, translationLanguage, translationLocale]);

  useEffect(() => {
    // Get the specific church properties from the server
    const fetchData = async () => {
      const response = await fetch(`${serverName}/churchinfo`);
      const data = await response.json();
      if (data.translationLanguages != null) {
        setLanguageMap(JSON.parse(data.translationLanguages));
      }
      setDefaultServiceId(data.defaultServiceId);
      const churchMessages = JSON.parse(data.message);
      setChurchWelcome({
        greeting: data.greeting,
        messages: churchMessages,
        additionalMessage: data.additionalWelcome,
        waiting: data.waiting
      })
    }

    fetchData();
  }, [])

  // When we have a valid service code and that service ID is actively being controlled
  // on the server side, then register the app.
  useEffect(() => {
    if (serviceCode != null && serviceCode.length > 0 && serviceReady) {
      console.log(`Received Service ID: ${serviceCode}`);
      socket.emit('register', serviceCode);
    }
  }, [serviceCode, serviceReady])

  useEffect(() => {
    // Need to check if the router is ready before trying to get the serviceId
    // from the query parameter. Also the default needs to be received from
    // the server
    if (router.isReady && defaultServiceId.length > 0) {
      socketInitializer(), []
    }
  }, [router.isReady, defaultServiceId])


  // Make sure the server side has initialized this service before
  // trying to register
  const handleServiceStatusCallback = (serviceStatusData) => {
    const { active } = serviceStatusData;
    console.log(`Setting service ready to ${active}`);
    setServiceReady(active);
  }
  useEffect(() => {
    console.log(`The service status is now: ${serviceReady}`);
  }, [serviceReady]);

  const socketInitializer = () => {
    socket.connect();
    socket.on('connect', () => {
      console.log(`${socket.id} connected to the socket`);

      if (socket.recovered) {
        console.log(`Successfully recovered socket: ${socket.id}`);
      } else {
        // This means that all rooms, connections have been lost, so we need to re-establish
        console.log(`Unable to recover socket: ${socket.id}`);
        console.log(`Current Settings:\n\tLanguage: ${translationLanguage}\n\tLocale: ${translationLocale}\n\tService: ${serviceCode}`);
      }

      if (serviceId == null || serviceId.length == 0 || serviceId == "") {
        console.log(`Service ID not defined so using default ID from server of: ${defaultServiceId}`);
        setServiceCode(defaultServiceId);
      } else {
        setServiceCode(serviceId);
      }
    })
    socket.on('transcript', (msg) => {
      console.log(`Transcript: ${msg}`)
      setTranscript(msg)
    })

    socket.on('translation', (msg) => {
      console.log(`Translation: ${msg}`)
      setTranslate(msg)
    })

    socket.on('disconnect', (reason) => {
      console.log(`${socket.id} in index disconnected from the socket.  Reason-> ${reason}`);
    })
  }

  const joinRoom = (language) => {
    const room = `${serviceCode}:${language}`;
    console.log(`Joining room: ${room}`)
    socket.emit('join', room)

    const transcriptRoom = `${serviceCode}:transcript`
    console.log(`Joining ${transcriptRoom}`)

    socket.emit('join', transcriptRoom)
    setTranslationInProgress(true);

  }

  const handleLivestreamCallback = (status) => {
    setLivestream(status);
  }

  const handleStartButton = (chosenLang) => {
    const locale = JSON.parse(JSON.stringify(chosenLang)).value;
    const language = getLanguage(locale);
    setTranslationLanguage(language);
    setTranslationLocale(locale);
    console.log(`Setting the language to ${language} and locale to ${locale}`);
    joinRoom(language);
  }

  const handleChangeLanguageButton = () => {
    const room = `${serviceCode}:${translationLanguage}`;
    console.log(`Leaving room ${room}`);
    socket.emit('leave', room);

    // Also leave the transcript
    const transcriptRoom = `${serviceCode}:transcript`;
    socket.emit('leave', transcriptRoom);
    setTranslationInProgress(false);
  }

  return (
    <>
      <Head>
        <title>DeBabel Translation App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
      </Head>
      <div className={styles.container}>
        <ServiceStatusComponent serviceId={serviceCode} parentCallback={handleServiceStatusCallback} />
        <LivestreamComponent socket={socket} parentCallback={handleLivestreamCallback} />
        <PageHeaderComponent textLabel="DeBabel" sessionStatus={livestream} />
        {!translationInProgress &&
          <div className={styles.home}>
            <div className={styles.inputBox}>
              <LogoComponent serverName={serverName} />
              {/* */}
              <WelcomeMessageComponent churchWelcome={churchWelcome} />
              {serviceReady &&
                <LanguageButtonDropdownComponent languages={languageMap} onClick={handleStartButton} />
              }
              {!serviceReady &&
                <WaitingMessageComponent message={churchWelcome.waiting} />
              }
            </div>
          </div>
        }
        {translationInProgress &&
          <div className={styles.translatePage}>
            <TranslationBoxComponent translate={translate} transcript={transcript} language={translationLanguage} />
            <AudioComponent locale={translationLocale} translate={translate} />
            <ChangeLanguageButtonComponent onClick={handleChangeLanguageButton} />
            {/* */}
          </div>
        }
      </div>
    </>
  )
}

export default Home;
