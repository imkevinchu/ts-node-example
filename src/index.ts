import express from 'express';
import http from 'http';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import cors from 'cors';
import mongoose from 'mongoose';
import router from './router';
import 'dotenv/config'

const app = express();
const PORT = 8080;
const MONGODB_URI = process.env.MONGODB_URI;

app.use(cors({
    credentials: true,
}))

app.use(compression());
app.use(cookieParser());
app.use(bodyParser.json());

const server = http.createServer(app);

server.listen(PORT, () => {
    console.log(`server started on port ${PORT}`);
})

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);
mongoose.connection.once('open', () => {
    console.log("connection opened");
})
mongoose.connection.on('error', (error: Error) => {
    console.log(error);
})

app.use('/', router());
