import express from 'express';
import dotenv from 'dotenv';
import connectDB from './lib/db.js';
// import cookieParser from 'cookie-parser';

import authRoutes from './routes/auth.route.js';

const PORT = process.env.PORT || 5000;
dotenv.config();

const app = express();
app.use(express.json());
app.use(express.json({ limit: '10mb' })); // allows you to parse the body of the request


app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  console.log('Server is running on http://localhost:' + PORT);
  connectDB();
});
