const { Server } = require('socket.io');
let io;
exports.init = (httpServer) => {
  io = new Server(httpServer, { cors: { origin: process.env.CLIENT_URL, methods: ['GET', 'POST'] } });
  io.on('connection', (socket) => {
    socket.on('joinPost', (id) => socket.join(`post:${id}`));
    socket.on('leavePost', (id) => socket.leave(`post:${id}`));
    socket.on('joinAdmin', () => socket.join('admins'));
  });
  return io;
};
exports.getIO = () => io;
