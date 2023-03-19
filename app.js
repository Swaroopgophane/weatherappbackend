const dotenv = require('dotenv');
const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();

dotenv.config({path:'./.env'});

const PORT = process.env.PORT || 8000;

// Databse connectio
require('./db/conn');

app.use(express.json());
app.use(cookieParser());


// Linking the router
app.use(require('./router/allroutes'));

app.listen(PORT,()=>{
    console.log(`Server is listen on port ${PORT}`);
})