import { useEffect, useRef, useState } from "react";

const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

const ServiceStatusComponent = ({ serviceId, parentCallback }) => {
    const instance = useRef({ interval: 0 });
    const [apiData, setApiData] = useState(null);


    useEffect(() => {
        console.log(`API data: ${JSON.stringify(apiData)}`);
        if (apiData) {
            // Let the parent (index) know the status
            parentCallback(apiData);

            if (apiData.active == true) {
                console.log(`Service is active, stopping fetch.`);
                clearInterval(instance.current.interval);
            }
        }
    }, [apiData]);

    useEffect(() => {
        if (serviceId != null && serviceId.length > 0) {
            console.log(`Starting polling for service code ${serviceId} to be initialized`);
            instance.current.interval = setInterval(() => {
                fetchData(serviceId);
            }, 10000);
            return () => clearInterval(instance.current.interval);
        }
    }, [serviceId]);

    const fetchData = async (serviceId) => {
        console.log(`Fetching server status for: ${serviceId} `);
        const response = await fetch(`${serverName}/serviceStatus?serviceId=${serviceId}`);
        const data = await response.json();
        setApiData(data);
    }

    return (
        <></>
    )
}

export default ServiceStatusComponent;