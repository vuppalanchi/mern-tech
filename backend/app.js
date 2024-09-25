const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');


const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.json());

//upender code
app.use((req,res,next) =>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader(
        'Access-control-Allow-Headers',
        'Origin, X-Requested-With,Content-Type,Accept,Authorization'
    );
    res.setHeader(
        'Access-Control-Allow-Methods',
        'GET, POST,PATCH,DELETE'
        );
    next();
});

app.use('/api/places',placesRoutes); // => /api/places/...
app.use('/api/users',usersRoutes);


app.use((req,res,next) => {
    const error = new HttpError('Could not find this route',404);
    throw error;
});

app.use((error,req,res,next) => {
    if(res.headerSent){
        return next(error);
    }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occured'});
});


mongoose
.connect('mongodb+srv://xxxxxxx:xxxxxxxx@atlascluster.qzphyoq.mongodb.net/places?retryWrites=true&w=majority&appName=AtlasCluster')
.then(()=>{
    app.listen(5000);
})
.catch(err =>{
    console.log(err);
});
