const express = require('express');

const router = express.Router();
const {body, param, validationResult, matchedData} = require('express-validator');


const {Party, Consumer, ConsumptionTracking, Consumable} = require('../model/bddTables')
const {ConsumerSchemas, ConsumableSchemas} = require('../model/schemas')


router.post('/', 
body('name').isString().notEmpty().trim().escape(),
body('party_uuid').isUUID(), 

async function(req, res) {  
    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });
    const check_party_exist = await Party.findOne({where : {uuid : body.party_uuid}})

    if(check_party_exist === null){
        res.status(404).json({err : "This party does not exist"});
        return 
    }

    const {generateConsumerUUid} = require("../model/generateUUID");

    const potential_uuid = generateConsumerUUid(body.name, check_party_exist.uuid);

    const check_consumer_exist = await Consumer.findOne({where : {uuid : potential_uuid}});

    if(check_consumer_exist !== null){
        res.status(409).json({err : "This consumer already exists"});
        return 
    }

    const ret = await Consumer.create({name : body.name, uuid : potential_uuid, party_id : check_party_exist.id});
    
    res.status(201).json({uuid : ret.uuid});

});

router.get('/',
body('party_uuid').isUUID(),
async function(req, res) {  

    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
    }

    const body = matchedData(req, {locations : ['body'], includeOptionals: true });

    const consumers = await Consumer.findAll({
        attributes : ConsumerSchemas.condensed,
        include : {
            model: Party,
            attributes: [],
            where: {
                uuid: body.party_uuid,
            }
        }
    
})

    console.log(consumers)

    res.status(200).json(consumers);
}
);

router.get('/:consumer_uuid', 

param('consumer_uuid').isUUID(),

async function(req, res, next) {  

    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
        return
    }

    // const cons = Consumer.findOne(
    //     {
    //         attributes : ConsumerSchemas.condensed,
    //         where : {
    //         uuid : req.params.consumer_uuid
    //     },
    // include : {
    //     model : ConsumptionTracking,
    //     attributes : ['consumption_count'],
    //     include : 
    //         {
    //             model : Consumable, 
    //             attributes : ConsumableSchemas.condensed
    //         }
        
    // }}
    // ).then(cons => {
    //     if(cons === null){
    //         res.status(404).json({'msg' : 'no result'});
    //         next();
    //     }
    //     else {
    //         res.status(200).json(cons)
    //         return;
    //     }
    //     });


// SELECT Consumers.name, Consumers.id, COALESCE(ConsomptionTracking.consumption_count, 0) as consumption_count, Consumables.name, Consumables.id
// FROM Consumers
// CROSS JOIN Consumables
// LEFT JOIN ConsomptionTracking ON Consumers.id = ConsomptionTracking.consumer_id AND Consumables.id = ConsomptionTracking.consumable_id

}
);

router.delete('/',
body('uuid').isUUID(),
async function(req, res) {  

    
    if(!validationResult(req).isEmpty()){
        res.status(400).json({err : "Bad format"});
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