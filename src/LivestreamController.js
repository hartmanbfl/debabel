import { BehaviorSubject } from 'rxjs'
import socket from './socket'

export const livestreamEvent = new BehaviorSubject({status: "OFF"});

export const initializeLivestreamController = () => {
    console.log(`Initializing the livestream controller.`);
    // start listening on the websocket for livestreaming messages
    socket.on('livestreaming', () => {
        restartLivestreamTimer();
        livestreamEvent.next( {status: 'ON'});
      });
}

// Create a timer that waits for x seconds.  If it expires, turn the light off
let livestreamTimer;
const startLivestreamTimer = () => {
    livestreamTimer = setTimeout(() => {
        livestreamEvent.next( {status: 'OFF'} );
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
