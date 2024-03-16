import { useEffect, useRef, useState } from "react";

const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;

const ServiceStatusComponent = ({ serviceId, tenantId, parentCallback }) => {
    const instance = useRef({ interval: 0 });
    const [apiData, setApiData] = useState(null);


    useEffect(() => {
//debug        console.log(`API data: ${JSON.stringify(apiData)}`);
        if (apiData) {
            // Let the parent (index) know the status
            parentCallback(apiData);

//            if (apiData.active == true) {
//                console.log(`Service is active, stopping fetch.`);
//                clearInterval(instance.current.interval);
//            }
        }
    }, [apiData]);

    useEffect(() => {
        if (serviceId != null && serviceId.length > 0) {
            console.log(`Starting polling for service code ${serviceId} to be initialized`);
            instance.current.interval = setInterval(() => {
                fetchData(serviceId);
            }, 5000);
            return () => clearInterval(instance.current.interval);
        }
    }, [serviceId]);

    const handleFetchError = (error) => {
        // send api data
        const apiData = {active:false};
        parentCallback(JSON.stringify(apiData));

    }
    const fetchData = async (serviceId) => {
        try {

        const response = await (fetch(`${serverName}/church/${serviceId}/status?tenantId=${tenantId}`))
        if (!response.ok) {
            throw new Error("Network response was not OK");
        }
        const jsonResponse = await response.json();
        const data = jsonResponse.responseObject;
        setApiData(data);
        } catch (error) {
            console.warn(`Error getting status: ${error}`);
            handleFetchError(error);
        }
    }

    return (
        <></>
    )
}

export default ServiceStatusComponent;