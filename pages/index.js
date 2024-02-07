import Head from 'next/head'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
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
import StopTranslationButtonComponent from '@/src/StopTranslationButtonComponent'
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
  const [rejoin, setRejoin] = useState(false);

  const [translationInProgress, setTranslationInProgress] = useState(false);
  const [translate, setTranslate] = useState()
  const [transcript, setTranscript] = useState()
  const [displayTranscript, setdisplayTranscript] = useState();
  
  const [translationLanguage, setTranslationLanguage] = useState();
  const [translationLocale, setTranslationLocale] = useState();

  const translationRef = useRef(false);


  const [churchWelcome, setChurchWelcome] = useState({
    greeting: "",
    messages: [],
    additionalMessage: "",
    waiting: ""
  });

  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

  // Keep track of when things change
  useEffect(() => {
    console.log(`Updated Settings:\n\tLanguage: ${translationLanguage}\n\tLocale: ${translationLocale}\n\tService: ${serviceCode}\n\tTranslationInProgress: ${translationRef.current}`);
  }, [serviceCode, translationLanguage, translationLocale, rejoin]);

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
    console.log(`In useEffect, serviceCode: ${serviceCode}, serviceReady: ${serviceReady}`);
    if (serviceCode != null && serviceCode.length > 0 && serviceReady) {
      console.log(`Received Service ID: ${serviceCode}`);
      socket.emit('register', serviceCode);
      localStorage.setItem('serviceCode', serviceCode);
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
    setServiceReady(active);
  }
  useEffect(() => {
    console.log(`The service status is now: ${serviceReady}`);
    if (translationRef.current && serviceReady) {
      const rejoinLang = localStorage.getItem('language');
      const rejoinService = localStorage.getItem('serviceCode');
      joinRoom(rejoinService, rejoinLang);
    }
  }, [serviceReady]);

  const socketInitializer = () => {
    console.log(`In socketInitializer`);
    socket.connect();
    socket.on('connect', () => {
      console.log(`${socket.id} connected to the socket`);

      if (socket.recovered) {
        console.log(`Successfully recovered socket: ${socket.id}`);
      } else {
        // This means that all rooms, connections have been lost, so we need to re-establish
        console.log(`Unable to recover socket: ${socket.id}`);
        console.log(`Current Settings:\n\tLanguage: ${translationLanguage}\n\tLocale: ${translationLocale}\n\tService: ${serviceCode}\n\tTranslationInProgress: ${translationInProgress}`);

        // Rejoin if currently translating
        if (translationRef.current) {
          const rejoinLang = localStorage.getItem('language');
          const rejoinService = localStorage.getItem('serviceCode');
          setServiceCode(rejoinService);
          // Attempt to trigger a re-render of the Service status check
          setRejoin(true);
          console.log(`Attempting to rejoin ${rejoinService}:${rejoinLang}`)
        }
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

  const joinRoom = (id, language) => {
    const room = `${id}:${language}`;
    console.log(`Joining room: ${room}`)
    socket.emit('join', room)

    const transcriptRoom = `${id}:transcript`
    console.log(`Joining ${transcriptRoom}`)

    socket.emit('join', transcriptRoom)
    setTranslationInProgress(true);
    translationRef.current = true;
  }

  const handleLivestreamCallback = (status) => {
    setLivestream(status);
  }

  const handleStartButton = (chosenLang) => {
    const locale = JSON.parse(JSON.stringify(chosenLang)).value;
    const language = getLanguage(locale);
    setTranslationLanguage(language);
    setTranslationLocale(locale);
    localStorage.setItem('language', language);
    console.log(`Setting the language to ${language} and locale to ${locale}`);
    joinRoom(serviceCode, language);
  }
  
  const handleStopTranslationButton = () => {
    const room = `${serviceCode}:${translationLanguage}`;
    console.log(`Leaving room ${room}`);
    socket.emit('leave', room);

    // Also leave the transcript
    const transcriptRoom = `${serviceCode}:transcript`;
    socket.emit('leave', transcriptRoom);
    setTranslationInProgress(false);
    translationRef.current = false;

    // And clear out the translation/transcript
    setTranscript(null);
    setTranslate(null);
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
        {!translationRef.current &&
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
        {translationRef.current &&
          <div className={styles.translatePage}>
            <TranslationBoxComponent translate={translate} transcript={transcript} language={translationLanguage} displayTranscript={displayTranscript}/>
            <AudioComponent locale={translationLocale} translate={translate} />
            <DisplayTranscriptButtonComponent displayTranscript={displayTranscript} />
            <StopTranslationButtonComponent onClick={handleStopTranslationButton} />
            {/* */}
          </div>
        }
      </div>
    </>
  )
}

export default Home;
