import { useEffect, useRef, useState } from "react";

const LivestreamComponent = ({socket, parentCallback}) => {

    const [livestreamStatus, setLivestreamStatus] = useState('OFF');
    const timer = useRef(null);

    useEffect(() => {
        console.log(`Initializing the livestream controller.`);
        // start listening on the websocket for livestreaming messages
        socket.on('livestreaming', () => {
            // Clear the previous timer
            clearTimeout(timer.current);

            setLivestreamStatus('ON');

            // Start a new timer
            timer.current = setTimeout(() => {
                console.log(`Livestream not active.`);
                setLivestreamStatus('OFF');
            }, 5000);            
        });
    }, [])

    useEffect(() => {
        parentCallback(livestreamStatus);
    }, [livestreamStatus])

    return (
        <></>
    )
}

export default LivestreamComponent;