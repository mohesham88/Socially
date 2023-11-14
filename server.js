import 'express-async-errors';
import mongoose from 'mongoose';
import express from 'express';
import bodyParser from 'body-parser';// parses data
import cors from 'cors';// make the app accessible for sites
import dotenv from 'dotenv';
import path from 'path';
import helmet from 'helmet'; // defines http headers for security
import { fileURLToPath } from 'url';
import morgan from 'morgan'; // responsible for logging req,res..
import authRouter from './routes/auth.js';
import postsRouter from './routes/posts.js';
import errorHandler from './middleware/error-handler.js'
import usersRouter from './routes/users.js'
import notFoundMiddleware from './middleware/not-found.js'
import auth  from './middleware/authentication.js'

/* CONFIGURATIONS  */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config();
const app = express();
app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({policy : 'cross-origin'}));
app.use(morgan('common'));     
app.use(bodyParser.json({limit: '30mb',extended: true}));
app.use(bodyParser.urlencoded({limit: '30mb', extended : true}))
app.use(cors());
app.use('/assets',express.static(path.join(__dirname,'public/assets')))
app.use('/api/v1/auth',authRouter);
app.use('/api/v1/users', auth ,usersRouter);
app.use('/api/v1/posts', auth ,postsRouter);








app.use(notFoundMiddleware)
app.use(errorHandler);
const PORT = process.env.PORT || 3001;
app.listen(PORT, async () => {
  await mongoose.connect(process.env.MONGO_URI);
  console.log(`server is running on http://localhost:${PORT}`)
})