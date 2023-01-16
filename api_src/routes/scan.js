var express = require('express');
const router = express.Router();

const {param, validationResult, matchedData} = require('express-validator');
const {Party, Consumer} = require('../model/bddTables');

/* update le nombre de consommations */
router.patch('/consume', function(req, res, next) {
  if(req.body.id_consommation == null){
    res.status(400).send({err_msg : "You must provide a id_action attribute in the request body"})
    return
  }

  res.status(202).json({id_soiree : req.params.id_soiree, id_utilisateur : req.params.id_consommateur, id_consommation : req.body.id_consommation});

});

module.exports = router;
