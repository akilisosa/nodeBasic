const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const connectDB = require('./config/db');
const colors = require('colors')
const errorHandler = require('./middleware/error');

// loads env variables
dotenv.config({ path: './config/config.env'});


//connect to databas
connectDB();

//route files
const bootcamps = require('./routes/bootcamps');



const app = express();

//Body parse
app.use(express.json())

// Dev loggin middleware
if(process.env.NODE_ENV === 'development'){
    app.use(morgan('dev'));
}

// Mount routers
app.use('/api/v1/bootcamps', bootcamps);

app.use(errorHandler)


const PORT = process.env.PORT || 5000;

const server = app.listen(
    PORT,
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold)
);

//hanldes unhandled promise rejections;

process.on('unhandledRejection', (err, promise)=>{
    console.log(`Error: ${err.message}`.red);
    server.close(()=>process.exit(1))
})