import io from 'socket.io-client'
const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;
const socket = io(serverName, {autoConnect: false});

export default socket; 