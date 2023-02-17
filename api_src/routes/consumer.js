const express = require('express');
const cors = require('../bin/getCors');

const router = express.Router();
router.use(cors);
const {body, query, param, validationResult, matchedData} = require('express-validator');


const {Party, Consumer, ConsumptionTracking, Consumable} = require('../model/bddTables')
const {ConsumerSchemas, ConsumableSchemas} = require('../model/schemas')


router.post('/', 
body('name').isString().notEmpty().trim().escape(),
body('party_uuid').isUUID(), 
body('qrcode').isString().notEmpty().trim().escape(),

async function(req, res, next) {  
    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        return next() 
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });
    const check_party_exist = await Party.findOne({where : {uuid : body.party_uuid}})

    if(check_party_exist === null){
        res.status(404).json({err : "This party does not exist"});
        return next()  
    }

    const {generateConsumerUUid} = require("../model/generateUUID");

    const potential_uuid = generateConsumerUUid(body.name, check_party_exist.uuid);

    const check_consumer_exist = await Consumer.findOne({where : {uuid : potential_uuid}});

    if(check_consumer_exist !== null){
        res.status(409).json({err : "This consumer already exists"});
        return next()  
    }

    const ret = await Consumer.create({name : body.name, uuid : potential_uuid, party_id : check_party_exist.id, qrcode : body.qrcode});
    
    res.status(201).json({uuid : ret.uuid});

});

router.get('/',
query('party_uuid').isUUID().notEmpty(),
async function(req, res, next) {  

    if(!validationResult(req).isEmpty()){
        return next({message : "Bad format", status : 400});
    }

    const query = matchedData(req, {includeOptionals: true });

    const consumers = await Consumer.findAll({
        attributes : ConsumerSchemas.condensed,
        include : {
            model: Party,
            attributes: [],
            where: {
                uuid: query.party_uuid,
            }
        }
    
})

    res.status(200).json(consumers);
}
);

router.get('/:qrcode', 

param('qrcode').isString(),

async function(req, res, next) {  

    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        next()
    }

    const consumer = await Consumer.findOne({
        attributes : ConsumerSchemas.condensed,
            where: {
                qrcode: req.params.qrcode,
            }
        });


    if(consumer == null){
        res.status(404).json({err : "This consumer doesn't exist"});
        return next()
    }

    const consumer_info_query = `SELECT Consumers.uuid as 'uuid', Consumers.name as 'name', Consumers.qrcode as 'qrcode', Consumables.uuid as 'consumable.uuid', COALESCE(ConsomptionTracking.consumption_count, 0) as 'consumable.count', Consumables.max_cons as 'consumable.max_cons', Consumables.name as 'consumable.name'
    FROM Consumers
    CROSS JOIN Consumables
    LEFT JOIN ConsomptionTracking ON Consumers.id = ConsomptionTracking.consumer_id AND Consumables.id = ConsomptionTracking.consumable_id
    WHERE Consumers.qrcode = $qrcode;`

    const db = require("../bin/getDb");

    const {QueryTypes} = require('sequelize');

    const ret_db = await db.query(consumer_info_query, {type : QueryTypes.SELECT, nest : true, bind : {qrcode : req.params.qrcode}});

    let response_data = {}

    response_data = {uuid : consumer.uuid, name : consumer.name, consumables : []};
    
    let i = 0;
    while(ret_db[i] != null ){
        response_data.consumables[i] = ret_db[i].consumable;
        i++;
    }
    
    res.status(200).json(response_data);

}
);

/*
router.get(
    '/',
    query('qrcode'),

async function(req, res, next) {  

    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        next()
    }

    const query = matchedData(req, {locations : ['query'], includeOptionals: true });
    const consumer = await Consumer.findOne({
        attributes : ConsumerSchemas.condensed,
            where: {
                qrcode: query.qrcode,
            }
        });


    if(consumer == null){
        res.status(404).json({err : "This consumer doesn't exist"});
        return next()
    }

    const consumer_info_query = `SELECT Consumers.uuid as 'uuid', Consumers.name as 'name', Consumables.uuid as 'consumable.uuid', COALESCE(ConsomptionTracking.consumption_count, 0) as 'consumable.count', Consumables.max_cons as 'consumable.max_cons', Consumables.name as 'consumable.name'
    FROM Consumers
    CROSS JOIN Consumables
    LEFT JOIN ConsomptionTracking ON Consumers.id = ConsomptionTracking.consumer_id AND Consumables.id = ConsomptionTracking.consumable_id
    WHERE Consumers.uuid = $consumer_uuid;`

    const db = require("../bin/getDb");

    const {QueryTypes} = require('sequelize');

    const ret_db = await db.query(consumer_info_query, {type : QueryTypes.SELECT, nest : true, bind : {consumer_uuid : req.params.consumer_uuid}});

    let response_data = {}

    response_data = {uuid : consumer.uuid, name : consumer.name, consumables : []};
    
    let i = 0;
    while(ret_db[i] != null ){
        response_data.consumables[i] = ret_db[i].consumable;
        i++;
    }
    
    res.status(200).json(response_data);

}
);
*/

router.delete('/',
body('uuid').isUUID(),
async function(req, res) {  
    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        next();
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });

    Consumer.destroy({where : {uuid : body.uuid}}).then((rowDeleted) => { 
        if(rowDeleted === 1){
           res.status(200).json({msg : 'ok'});
         }
      }, function(err){
          res.status(404).json({err : 'This consumer was not found'})
      });
});

module.exports = router
