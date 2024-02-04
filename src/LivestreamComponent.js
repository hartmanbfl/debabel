import { useEffect, useState } from "react";

const LivestreamComponent = (parentCallback) => {

    const [livestreamStatus, setLivestreamStatus] = useState();

    useEffect(() => {
        console.log(`Initializing the livestream controller.`);
        // start listening on the websocket for livestreaming messages
        socket.on('livestreaming', () => {
            restartLivestreamTimer();
        });
    }, [])

    return (
        <></>
    )
}

export default LivestreamComponent;