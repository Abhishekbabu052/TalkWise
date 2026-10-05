require('dotenv').config();
const express = require('express');
const http = require('http');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const ensureSuperAdmin = require('./config/ensureSuperAdmin');
const { init } = require('./socket/socket');

const app = express();
const server = http.createServer(app);
init(server);

app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/posts', require('./routes/postRoutes'));
app.use('/api/responses', require('./routes/responseRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/reports', require('./routes/reportRoutes'));
app.use('/api/keywords', require('./routes/keywordRoutes'));
app.use('/api/notifications', require('./routes/notificationRoutes'));

connectDB()
  .then(async () => {
    await ensureSuperAdmin();
    server.listen(process.env.PORT || 5000, () => console.log(`Server on port ${process.env.PORT || 5000}`));
  });
