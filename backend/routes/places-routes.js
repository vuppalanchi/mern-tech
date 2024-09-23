const express = require('express');
//const { getPlaceById } = require('../controllers/places-controllers');
//const validator = require('express-validator');
const {check} = require('express-validator');

const placeControllers = require('../controllers/places-controllers');


const router = express.Router();



router.get('/:pid',placeControllers.getPlaceById);

router.get('/user/:uid',placeControllers.getPlacesByUserId);

router.post('/',
    [
    check('title')
    .not()
    .isEmpty(),
    check('description')
    .isLength({min: 5}),
    check('address')
        .not()
        .isEmpty()
    ],
    placeControllers.createPlace);

router.patch('/:pid',
    [
        check('title')
        .not()
        .isEmpty(),
        check('description')
        .isLength({min:5})
    ],placeControllers.updatePlace);

router.delete('/:pid',placeControllers.deletePlace);


module.exports = router;