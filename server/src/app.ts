import express from 'express';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import compression from 'compression';
import cors from 'cors';
import errorHandler from './middlewares/errorHandler';
import user from './components/User';
import post from './components/Post';
import followers from './components/Followers';
import dotenv from 'dotenv';

dotenv.config();
const app: express.Application = express();
app.set('port', process.env.API_PORT || 3001);
app.use(compression());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));
app.use(cookieParser());
app.use(cors());

app.use('/api/v1/users', user, followers);
app.use('/api/v1/post', post);

app.use(errorHandler);

export { app };
