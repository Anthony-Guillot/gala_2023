const db = require("./bin/getDb");
const { Party, Consumable, Consumer } = require("./model/bddTables");
const { generateConsumerUUid, generatePartyUUid, generateConsumableUUid } = require("./model/generateUUID")

async function loadFixtures() {
    console.log("loading fixtures...");

    const party_data = {
        name: "gala2023",
        description: "le gala de fin d'annee",
        uuid: generatePartyUUid("gala2023", new Date('12/01/2023'))
    };

    const party = await Party.create(party_data);

    const consumer_data = {
        name : "Jhon",
        uuid : generateConsumerUUid('Jhon', party_data.uuid),
        party_id : party.id
    }

    const consumer = await Consumer.create(consumer_data);

    const consumable_data = {
        name : "Alcool", 
        uuid : generateConsumableUUid("Alcool", party.uuid),
        description : "de l'éthanol pur",
        max_cons : 4, 
        party_id : party.id
    } 

    const consumable = Consumable.create(consumable_data);
}


module.exports = { loadFixtures }