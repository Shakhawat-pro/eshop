import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import router from './routes/auth.router';
import errorMiddleware from '../../../packages/error-handler/error-handler';



const app = express();

app.use(cors({
    origin: ["http://localhost:3000"],
    allowedHeaders: ['Authorization', "Content-Type"],
    credentials: true,
}))
app.use(express.json())
app.use(cookieParser())

app.get('/', (req, res) => {
    res.send({ 'message': 'Welcome to the Auth Service 123' });
});



//routes 
app.use("/api", router)


app.use(errorMiddleware)

const port = process.env.PORT || 6001;

const server = app.listen(port, () => {
    console.log(`Auth service is running at http://localhost:${port}`)
})

server.on("error", (err) => {
    console.log("Server Error", err);

})