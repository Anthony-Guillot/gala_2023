const { Sequelize, DataTypes } = require('sequelize');

const sequelize = require('../bin/getDb')

const Party = sequelize.define('Party', {
    id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
    },

    uuid: {
        type: DataTypes.UUID,
        allowNull: false
    },

    name: {
        type: DataTypes.STRING,
        allowNull: false
    },

    description: {
        type: DataTypes.STRING,
    },


})

const Consumer = sequelize.define('Consumer',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },

        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        party_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Party,
                key: 'id'
            }
        },

        qrcode: {
            type: DataTypes.STRING,
            allowNull: false
        }

    })



const Consumable = sequelize.define('Consumable',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        uuid: {
            type: DataTypes.UUID,
            allowNull: false
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false
        },

        description: {
            type: DataTypes.STRING,
            allowNull: true
        },

        max_cons: {
            type: DataTypes.SMALLINT,
            allowNull: false,
        },

        party_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Party,
                key: 'id'
            }
        }
    })

const ConsumptionTracking = sequelize.define('ConsomptionTracking',
    {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true
        },

        consumable_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Consumable,
                key: 'id'
            }
        },

        consumer_id: {
            type: DataTypes.INTEGER,
            references: {
                model: Consumer,
                key: 'id'
            }
        },

        consumption_count: {
            type: DataTypes.SMALLINT,
            defaultValue: 0
        },

    }, { freezeTableName: true });


const db_mode = process.env.ENV == 'developpement' ? { force: true } : { alter: true };
const sync = () => sequelize.sync(db_mode).then(() => {

    Party.hasMany(Consumer, { foreignKey: 'party_id' });
    Party.hasMany(Consumable, { foreignKey: 'party_id' });
    Consumer.belongsTo(Party, { foreignKey: 'party_id' });
    Consumable.belongsTo(Party, { foreignKey: 'party_id' });

    Consumable.belongsToMany(Consumer, { through: ConsumptionTracking, foreignKey: "consumer_id" });
    Consumer.belongsToMany(Consumable, { through: ConsumptionTracking, foreignKey: "consumable_id" });

    Consumer.hasMany(ConsumptionTracking, { foreignKey: 'consumer_id' });
    Consumable.hasMany(ConsumptionTracking, { foreignKey: 'consumable_id' });

    ConsumptionTracking.belongsTo(Consumer, { foreignKey: 'consumer_id' })
    ConsumptionTracking.belongsTo(Consumable, { foreignKey: 'consumable_id' })


    if (process.env.ENV == 'developpement') {
        const { loadFixtures } = require("../fixtures");
        loadFixtures();
    }
})

module.exports = { Party, Consumable, Consumer, ConsumptionTracking, sync}