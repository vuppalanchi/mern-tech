const axios = require('axios');
const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyAFpVHpaOH4GqmMz8-Pk9PQaco5jJLS8rM';


async function getCoordsForAddress(address){
//     return {
//         lat: 40.7484474,
//         lng: -73.9871516
//     };

const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
    address
)}&key=${API_KEY}`
);

// const url = `https://maps.googleapis.com/maps/api/place/findplacefromtext/json?input=${encodeURIComponent(
//     address
//   )}&inputtype=textquery&fields=geometry&key=${API_KEY}`;

  //const response = await axios.get(url);

    const data = response.data;
    
    if(!data || data.status === 'ZERO_RESULTS'){
        const error = new HttpError('Could not find location for the specified address.',
            422
        );
        throw error;

    }
            const coordinates = data.results[0].geometry.location;
            //const coordinates = data.candidates[0].geometry.location;
            console.log('while in locatoin.js the coordinates recieved are - ' + coordinates);
            return coordinates;
    

 }

 module.exports = getCoordsForAddress;