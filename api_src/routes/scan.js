var express = require('express');

const cors = require('../bin/getCors');
const router = express.Router();

router.use(cors);

const { body, validationResult, matchedData } = require('express-validator');
const { Consumer, Consumable, ConsumptionTracking } = require('../model/bddTables');

/* update le nombre de consommations */
router.patch('/consume',
  body("consumable_uuid").isUUID(),
  body("consumer_uuid").isUUID(),
  async function (req, res, next) {

    if (!validationResult(req).isEmpty()) {
      return next({message : "Bad format", status : 400});
    }

    const body = matchedData(req, { locations: ['body'], includeOptionals: true });

    const check_consumer_exist = await Consumer.findOne({ where: { uuid: body.consumer_uuid } });
    if (check_consumer_exist == null) {
      return next({message : "This consumer doesn't exists", status : 404});
    }

    const check_consumable_exist = await Consumable.findOne({ where: { uuid: body.consumable_uuid } });

    if (check_consumable_exist == null) {
      return next({message : "This consumable doesn't exists", status : 404});
    }

    const [consumption_tracking, created] = await ConsumptionTracking.findOrCreate({
      where: { consumer_id: check_consumer_exist.id, consumable_id: check_consumable_exist.id},
      defaults: {
        consumable_id: check_consumable_exist.id,
        consumable_id: check_consumer_exist.id,
        consumtion_count: 0
      }
    });

    const consumable = await Consumable.findOne({
      where : {id : check_consumable_exist.id}, 
    });


    if(consumption_tracking.consumption_count == consumable.max_cons){
      return next({message : "Max cons", status : 409});
    }

    consumption_tracking.increment('consumption_count', { by: 1 });

    res.status(202).json({ id_soiree: req.params.id_soiree, id_utilisateur: req.params.id_consommateur, id_consommation: req.body.id_consommation });

  });

module.exports = router;