import React, { useEffect } from 'react';

// Define a style object for the circle
const circleStyle = {
    backgroundColor: 'red',
    borderRadius: '50%',
    display: 'inline-block',
    position: 'absolute',
    top: '10px',
    right: '10px',
    height: '20px',
    width: '20px',
};

// Define a functional component that takes a prop called isOn
const IndicatorComponent = (props) => {

    const [lightIsOn, setLightIsOn] = React.useState(false);
    const { socket, indicatorOn, onLightChanged } = props;

    // Run first time
    useEffect(() => {
        startLivestreamTimer();
        // Monitor the socket for hearbeat messages
        socket.on('livestreaming', () => {
            restartLivestreamTimer();
            turnOnLight();
        })
    }, [])

    useEffect(() => {
        if (indicatorOn) {
            turnOnLight();
        } else {
            turnOffLight();
        }
    }, [indicatorOn])

    // Create a timer that waits for x seconds.  If it expires, turn the light off
    let livestreamTimer;
    const startLivestreamTimer = () => {
        livestreamTimer = setTimeout(() => {
            turnOffLight();
            console.log(`Livestream is stopped.`)
        }, 5000);
    }
    const stopLivestreamTimer = () => {
        clearInterval(livestreamTimer);
    }
    const restartLivestreamTimer = () => {
        stopLivestreamTimer();
        startLivestreamTimer();
    }

    // Execute anytime the lightIsOn variable changes
    useEffect(() => {
        if (onLightChanged != null) {
            onLightChanged(lightIsOn)
        }
    }, [lightIsOn])

    const turnOnLight = () => {
        setLightIsOn(true);
    }
    const turnOffLight = () => {
        setLightIsOn(false);
    }

    // Return a JSX element that renders a circle if isOn is true, or nothing otherwise
    return <div>{lightIsOn ? <span style={circleStyle}></span> : null}</div>;
}

export default IndicatorComponent;
