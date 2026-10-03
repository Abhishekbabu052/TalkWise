import { io } from 'socket.io-client';
import { BASE } from './api';
const socket = io(BASE, { autoConnect: true });
export default socket;
