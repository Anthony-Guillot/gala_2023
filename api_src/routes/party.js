const router = require('express').Router();
const {generatePartyUUid} = require('../model/generateUUID');

const {PartySchemas} = require("../model/schemas")

const {Party} = require("../model/bddTables");

const {param ,body, validationResult, matchedData} = require('express-validator');

router.post('/', 
body('name').isString().notEmpty().trim().escape(),
body('description').optional(), 

async function(req, res, next) {  
    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        return next()
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });

    const potential_uuid = generatePartyUUid(body.name, Date.now())

    console.log(potential_uuid)

    const check_exist = await Party.findOne({where : {uuid : potential_uuid}})

    if(check_exist !== null){
        res.status(409).json({err : "This party already exists", check_exist : check_exist})
        return next();
    }

    const ret = await Party.create({name : body.name, description : body.description || "" , uuid : potential_uuid})

    res.status(201).json({uuid : ret.uuid});
    return next()
  });


router.get('/:party_uuid',

param('party_uuid').isUUID().notEmpty(),

async function(req, res, next) { 
   
    if(!validationResult(req).isEmpty()){
        return next({message : "Bad format", status : 400});
    }

    const params = matchedData(req, {includeOptionals: true });

    const party = await Party.findOne({where : {uuid : params.party_uuid}, attributes : PartySchemas.explicit});

    if(party == null){
        return next({message : "No party with this uuid", status : 404});
    }

    res.status(200).json(party);
}
);

module.exports = router