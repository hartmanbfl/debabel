import React, { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;


export const serviceStatusFetcher = (serviceId) => {
    const [apiData, setApiData] = useState(null);
    const [stopMessage, setStopMessage] = useState("Done");

    useEffect(() => {
        console.log(`API data: ${apiData}`);
    }, [apiData]);

    const fetchData = () => {
        fetch(`${serverName}/serverStatus?serviceId=${serviceId}`)
            .then((response) => response.json())
            .then((json) => setApiData(json))
    }

    let fetchTimer;
    const startFetchTimer = () => {
        fetchTimer = setInterval(() => {
            fetchData();
        }, 10000);
    }

    const stopFetchTimer = () => {
        clearInterval(fetchTimer);
    }
    const restartFetchTimer = () => {
        stopFetchTimer();
        startFetchTimer();
    }
    restartFetchTimer();
}