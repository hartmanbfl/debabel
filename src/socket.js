import io from 'socket.io-client'
const serverName = process.env.NEXT_PUBLIC_SERVER_NAME;
const socket = io(serverName, {autoConnect: false});
console.log(`Connecting socket.io ${socket.id} to ${serverName}`);

export default socket; 