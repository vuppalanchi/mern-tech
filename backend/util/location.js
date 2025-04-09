const axios = require('axios');

const HttpError = require('../models/http-error');

//const API_KEY = 'AIzaSyDgLmMpKCzveJf1_yuA0fUzzhy0WRChvZA';
//Upen
const API_KEY = process.env.GOOGLE_API_KEY//'AIzaSyAFpVHpaOH4GqmMz8-Pk9PQaco5jJLS8rM';

async function getCoordsForAddress(address) {
   return {
     lat: 40.7484474,
     lng: -73.9871516
   };
}

//Upen debug
async function getCoordsForAddress_uncomment_Later(address) {
  // return {
  //   lat: 40.7484474,
  //   lng: -73.9871516
  // };


  console.log('Now calling axios utility to get coordinates');
  const response = await axios.get(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${API_KEY}`
  );

  const data = response.data;

  console.log('recieved data as - ' + data.toString());
  if (!data || data.status === 'ZERO_RESULTS') {
    const error = new HttpError(
      'Could not find location for the specified address.',
      422
    );
    throw error;
  }

  console.log('Now fetching coordintes from the result of axiom utility');
  //Upender to do. Use VSCODE and Debugger and walkthru the vaiables and see whats going on with geometry
  //Upender below is the log for debugging
/*
will attempt to get the coordingates for the address
now calling get getCoordsForAddress for the address251 E Main St, Mountain House, CA 95391
Now calling axios utility to get coordinates
recieved data as - [object Object]
Now fetching coordintes from the result of axiom utility
Encountered error and it is - TypeError: Cannot read properties of undefined (reading 'geometry')
null

 */


  const coordinates = data.results[0].geometry.location;
  console.log('Coordinates obtained are - ' + coordinates.toString());
  return coordinates;
}

module.exports = getCoordsForAddress;
