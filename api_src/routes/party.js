const express = require('express');
const {generatePartyUUid} = require('../model/generateUUID');

const router = express.Router();
const {body, validationResult, matchedData} = require('express-validator');

router.post('/', 
body('name').isString().notEmpty().trim().escape(),
body('description').optional(), 

async function(req, res) {  
    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        return 
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });

    const {Party} = require("../model/bddTables");

    const potential_uuid = generatePartyUUid(body.name, Date.now())

    console.log(potential_uuid)

    const check_exist = await Party.findOne({where : {uuid : potential_uuid}})

    if(check_exist !== null){
        res.status(409).json({err : "This party already exists", check_exist : check_exist})
        return next()  
    }

    const ret = await Party.create({name : body.name, description : body.description || "" , uuid : potential_uuid})

    res.status(201).json({uuid : ret.uuid});
  });

module.exports = router