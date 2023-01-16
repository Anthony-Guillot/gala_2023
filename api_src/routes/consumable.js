const express = require('express');

const router = express.Router();
const {body, validationResult, matchedData} = require('express-validator');

const {Party, Consumable} = require('../model/bddTables')
const {ConsumerSchemas} = require('../model/schemas')

router.post('/', 
body('name').isString().notEmpty().trim().escape(),
body('description').optional().isString().notEmpty().trim().escape(),
body('party_uuid').isUUID(), 
body('max_cons').isInt().custom((value) => value > 0),

async function(req, res) {  
    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        return
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });
    const check_party_exist = await Party.findOne({where : {uuid : body.party_uuid}})

    if(check_party_exist === null){
        res.status(404).json({err : "This party does not exist"});
        return 
    }

    const {generateConsumableUUid} = require("../model/generateUUID");

    const potential_uuid = generateConsumableUUid(body.name, check_party_exist.uuid);

    const check_consumable_exist = await Consumable.findOne({where : {uuid : potential_uuid}});

    if(check_consumable_exist !== null){
        res.status(409).json({err : "This consumable already exists"});
        return 
    }

    const ret = await Consumable.create({...body, uuid : potential_uuid, party_id : check_party_exist.id,});  

    res.status(201).json({uuid : ret.uuid});

});


module.exports = router