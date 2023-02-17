const PartySchemas = {
    condensed : ['uuid', 'name', 'description'],
    explicit : ['uuid', 'name', 'description', 'createdAt']
}

const ConsumerSchemas = {
    condensed : ['uuid', 'name', 'qrcode']
}

const ConsumableSchemas = {
    condensed : ['uuid', 'name', 'max_cons'],
    explicit : ['uuid', 'name', 'max_cons', 'description']
}

module.exports = {PartySchemas, ConsumerSchemas, ConsumableSchemas}