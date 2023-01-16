const {v5} = require('uuid');

const NAMESPACE = "d4fb4f3f-d399-4880-87bb-90c57290fdb2"

const generatePartyUUid = (party_name, creation_date) => {
    return v5(party_name+"@"+creation_date, NAMESPACE)
}

const generateConsumerUUid = (consumer_name, party_uuid) => {
    return v5(consumer_name+"@"+party_uuid, NAMESPACE)
}

const generateConsumableUUid = (consumable_name, party_uuid) => {
    return v5(consumable_name+"@"+party_uuid, NAMESPACE)
}

module.exports = {generatePartyUUid, generateConsumableUUid, generateConsumerUUid}