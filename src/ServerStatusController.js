import React, { useState, useEffect } from 'react'
import { BehaviorSubject } from 'rxjs'

const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;


export const serviceStatusFetcher = (serviceId) => {
    const [apiData, setApiData] = useState(null);
    const [stopMessage, setStopMessage] = useState("Done");

    useEffect(() => {
        console.log(`API data: ${apiData}`);
    }, [apiData]);

    const fetchData = async () => {
        console.log(`Fetching server status for: ${serviceId} `);
        const response = await fetch(`${serverName}/serviceStatus?serviceId=${serviceId}`);
        console.log(`Response: ${response}`);
        const data = await response.json();
        console.log(`Data: ${data}`);
        setApiData(data);
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