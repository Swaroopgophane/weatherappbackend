const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');
const cors = require('cors');


dotenv.config({path:'./.env'});

const PORT = process.env.PORT || 8000;

// Databse connectio
require('./db/conn');

app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://realweatherapp.netlify.app'
    ],
    credentials: true,
    methods: ['GET','POST','OPTIONS'],
    allowedHeaders:[
        'Access-Control-Allow-Origin',
        'Content-Type',
        'Authorization'
    ]
}));


app.use(express.json());
app.use(cookieParser());


// Linking the router
app.use(require('./router/allroutes'));

app.listen(PORT,()=>{
    console.log(`Server is listen on port ${PORT}`);
})