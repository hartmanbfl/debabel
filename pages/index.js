import Head from 'next/head'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import socket from '../src/socket'
import { livestreamEvent, initializeLivestreamController } from '../src/LivestreamController'

import LogoComponent from '@/src/LogoComponent'
import LanguageButtonDropdownComponent from '@/src/LanguageButtonDropdownComponent'
import PageHeaderComponent from '@/src/PageHeaderComponent'
import WelcomeMessageComponent from '@/src/WelcomeMessageComponent'

const inter = Inter({ subsets: ['latin'] })

const Home = () => {
  const router = useRouter()

  // Get any query parameters
  const { serviceId } = router.query

  const [livestream, setLivestream] = useState("OFF");
  const [languageMap, setLanguageMap] = useState([]);
  const [defaultServiceId, setDefaultServiceId] = useState("");

  const [churchWelcome, setChurchWelcome] = useState({
    greeting: "",
    messages: [],
    additionalMessage: ""
  });

  const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

  useEffect(() => {
    // Get the specific church properties from the server
    const fetchData = async () => {
      const response = await fetch(`${serverName}/churchinfo`);
      const data = await response.json();
      if (data.translationLanguages != null) {
          setLanguageMap(JSON.parse(data.translationLanguages));
      }
      setDefaultServiceId(JSON.parse(data.defaultServiceId));
      const churchMessages = JSON.parse(data.message);
      setChurchWelcome( { greeting: data.greeting, messages: churchMessages, additionalMessage: data.additionalWelcome } )
    }

    fetchData();
  }, [])

  useEffect(() => {
    // Need to check if the router is ready before trying to get the serviceId
    // from the query parameter.
    if (router.isReady) {
      socketInitializer(), []
    }
  }, [router.isReady])


  const socketInitializer = () => {
    socket.on('connect', () => {
      console.log('connected to the socket')

      // register for the transcript heartbeats
      if (serviceId == null || serviceId == "") {
        serviceId = defaultServiceId;
      }
      console.log(`Registering for service: ${serviceId}`);
      socket.emit('register', serviceId);
    })

    socket.on('disconnect', () => {
      console.log('disconnected from the socket')
    })

    initializeLivestreamController();
    const livestreamSubscription = livestreamEvent.subscribe((event) => {
      //DEBUG      console.log(`Livestream is now: ${event.status}`);
      setLivestream(event.status);
    })
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
        <PageHeaderComponent textLabel="DeBabel" sessionStatus={livestream} />
        <div className={styles.home}>
          <div className={styles.inputBox}>
            <LogoComponent serverName={serverName}/>
            {/* */}
            <WelcomeMessageComponent churchWelcome={churchWelcome}/>
          </div>
          <LanguageButtonDropdownComponent serviceId={serviceId} languages={languageMap} />
        </div>
      </div>
    </>
  )
}

export default Home;
