import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import connectDB from './lib/db.js';
import bodyParser from 'body-parser';
import path from 'path';

import authRoutes from './routes/auth.route.js';
import postRoutes from './routes/post.route.js';
import commentRoutes from './routes/comment.route.js';
import reportRoutes from './routes/report.route.js';

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();

// Serve static assets if in production
const __dirname = path.resolve();

// CORS configuration
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' ? process.env.CLIENT_URL : 'http://localhost:5173', // for dev and prod
  credentials: true,
};

app.use(cors(corsOptions));

// Note : bodyParser should be before expressJson
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

app.use(express.json());

// app.use(express.json({ limit: "50mb" }));
// app.use(express.urlencoded({ limit: "50mb" }));

app.use(cookieParser());

app.use('/api/auth', authRoutes);
app.use('/api/post', postRoutes);
app.use('/api/comment', commentRoutes);
app.use('/api/report', reportRoutes);

if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '/client/dist')));

  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'dist', 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
  connectDB();
});
