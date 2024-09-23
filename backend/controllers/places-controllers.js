//const uuid = require('uuid');
const { v4: uuidv4 } = require("uuid");

const HttpError = require('../models/http-error');

const {validationResult} = require('express-validator');

const mongoose = require('mongoose');

const getCoordsForAddress = require('../util/location');

const Place = require('../models/place');
const User = require('../models/user');

let DUMMY_PLACES = [
    {
        id: 'p1',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapes in the world',
        locaction: {
            lat: 40.7484474,
            lng:-73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'u1'
    },
    {
        id: 'p2',
        title: 'Empire State Building',
        description: 'One of the most famous sky scrapes in the world',
        locaction: {
            lat: 40.7484474,
            lng:-73.9871516
        },
        address: '20 W 34th St, New York, NY 10001',
        creator: 'upender'
    }
];

const getPlaceById = async (req,res,next) => {
    //console.log('Upender: - GET Request in Places');
    const placeId =  req.params.pid; // {pid: 'p1'}
    // const place = DUMMY_PLACES.find(p => {
    //     return p.id === placeId;
    // });
    let place;
    try{
         place = await Place.findById(placeId);
    } catch(err){
        const error  = new HttpError(
            'Something went wrong, could not find a place.',500
        );
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find a place for the provided id',404);
        return next(error);
    };

    res.json({place: place.toObject({getters: true })});
};

const getPlacesByUserId = async (req,res,next) => {
    console.log('UpenderL - says hello from search all the places belonging to a given userid');
    const userId = req.params.uid;
    console.log('userID recieved is - ' + userId);
    // const places = DUMMY_PLACES.filter(p => {
    //     return p.creator === userId;
    // });

    let places;

    try{
        places = await Place.find({creator:userId});
    }catch(err){
        const error = new HttpError('Fetching places failed, please try again later',500);
        return next(error);
    }



    
    if(!places || places.length ===0){
        return next(new HttpError('Could not find a places for the provided user id'),404);
    };

    
    res.json({places: places.map(place => place.toObject({getters: true}))}); 
};

//Upenders Code
const createPlace = async(req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError('Invalid inputs passed, please check your data.',422));
    };

    const {title, description,address,creator} = req.body;

    let coordinates;
    try{
         coordinates = await getCoordsForAddress(address);
    }catch(error){
        console.log('error while getting coordinates');
        return next(error);
    }
        console.log('recieved coordinates as - ' + coordinates);
    const createdPlace = new Place({
        title,
        description,
        address,
        location: coordinates,
        image: 'https://www.allaboutbirds.org/guide/assets/photo/306062281-1280px.jpg',
        creator

    });

    let user;

    try{
        console.log('creator id recieved is - ' + creator);
        user = await User.findById(creator);
        //user = await User.findOne({id: creator});
        //user = await User.findById(creator).exec();
        //user = await User.find({_id:new ObjectId(creator)});
        //user = await User.findOne({_id: creator});
        //user = await User.findById(new ObjectId(creator));
        //user = await User.findOne({id: creator});
        //User.findOne({email: email});

    }catch(err){
        console.log('upen here - unable to fetch the provided user');
        const error = new HttpError(
            'Creating place failed, please try again', 500
        );
        return next(error);

    }

    if(!user){
        const error = new HttpError('Could not find user for provided id',400);
        return next (error);
    }

    console.log(user);

    //DUMMY_PLACES.push(createdPlace);
    try{
       //await createdPlace.save();
       const sess = await mongoose.startSession();
       sess.startTransaction();
       await createdPlace.save({session:sess});
       user.places.push(createdPlace);
       await user.save({session:sess});
       await sess.commitTransaction();
    }catch(err){
        const error = new HttpError(
            'Creating place failed, please try again.',
            500
        );
        return next (error);
    }

    
    res.status(201).json({place: createdPlace});
};

const updatePlace = async (req,res,next) =>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        return next( new HttpError('Invalid inputs passed, please check your data.',422))
    };

    const {title, description} = req.body;
    const placeId = req.params.pid;

    // const updatedPlace = {...DUMMY_PLACES.find(p => p.id === placeId) };
    // const placeIndex = DUMMY_PLACES.findIndex(p => p.id === placeId);
    
    let place;
    try{
        place = await Place.findById(placeId);
    }catch(err){
        const error = new HttpError(
            'Something went wrong, could not update place.',500
        );
        return next(error);
    }

    place.title = title;
    place.description = description;
    //DUMMY_PLACES[placeIndex] = updatedPlace;

    try{
        place.save();
    } catch(err){
        const error = new HttpError(
        'Something went wrong, could not update the place.',500
        );
        return next(error);
    }
    res.status(200).json({place: place.toObject({getters: true})});

};

const deletePlace = async (req,res,next) => {
    
    const placeId = req.params.pid;
    // if(!DUMMY_PLACES.find(p => p.id === placeId)){
    //     throw new HttpError('Could not find a place for that id.',404);
    // };

    let place;
    //DUMMY_PLACES = DUMMY_PLACES.filter(p => p.id !== placeId);

    try{
        place = await Place.findById(placeId).populate('creator');
        console.log('Found the place to be deleted'+ place.title);
    } catch(err){
        const error = new HttpError(
            'Something went wrong, could not delete place.', 500
        );
        return next(error);
    }

    if(!place){
        const error = new HttpError('Could not find place for this id.',404);
        return next(error);
    }

    try{
        //await place.deleteOne();
        //console.log('removed the place just fine');
        const sess = await mongoose.startSession();
        sess.startTransaction();
        //await place.remove({session: sess}); //remove is deprecated
        await place.deleteOne({session: sess});
        await place.creator.places.pull(place);
        await place.creator.save({session:sess});
        await sess.commitTransaction();
    }catch(err){
        console.log(err);
        const error = new HttpError('Something went wrong, could not delete place.',500);
        return next(error);
    };

    res.status(200).json({message: 'Deleted place.'});

};


exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;