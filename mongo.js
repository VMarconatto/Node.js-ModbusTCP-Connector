require('dotenv').config()
const { MongoClient } = require('mongodb')
const uri = process.env.connectionstring
const client = new MongoClient(uri)
const DatasReception = require('./src/controllers/servermodbus.js')

const hosts = `192.168.1.13`
const ping = require('ping')

client.connect().then(console.log(`Mongo Client Connected`)).catch((e) => console.log(e))
const aggDB = client.db("Master").collection("Receptions")

class Reception {
    constructor() {
    }
    crudMDB() {

        aggDB.insertMany([{
            "metadata": {
                "Recep_Id": 1, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 1"
            },
            "timestamp": new Date(), "LT20_PV": DatasReception.holding.readFloatBE(0), "FT20_PV": DatasReception.holding.readFloatBE(4),
            "PT20_PV": DatasReception.holding.readFloatBE(8), "TT20_PV": DatasReception.holding.readFloatBE(12), "TT20_PV": DatasReception.holding.readFloatBE(16),
            "TT20_PV": DatasReception.holding.readFloatBE(20), "ModbusTCPFail": false
        },
        {
            "metadata": {
                "Recep_Id": 2, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 2"
            },
            "timestamp": new Date(), "LT01_PV": DatasReception.holding.readFloatBE(24), "FT01_PV": DatasReception.holding.readFloatBE(28),
            "PT01_PV": DatasReception.holding.readFloatBE(32), "TT01_PV": DatasReception.holding.readFloatBE(36), "TT02_PV": DatasReception.holding.readFloatBE(40),
            "TT03_PV": DatasReception.holding.readFloatBE(44), "ModbusTCPFail": false
        },
        {
            "metadata": {
                "Recep_Id": 3, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 3"
            },
            "timestamp": new Date(), "LT01_PV": DatasReception.holding.readFloatBE(48), "FT01_PV": DatasReception.holding.readFloatBE(52),
            "PT01_PV": DatasReception.holding.readFloatBE(56), "TT01_PV": DatasReception.holding.readFloatBE(60), "TT02_PV": DatasReception.holding.readFloatBE(64),
            "TT03_PV": DatasReception.holding.readFloatBE(68), "ModbusTCPFail": false
        },
        {
            "metadata": {
                "Recep_Id": 4, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 4"
            },
            "timestamp": new Date(), "LT01_PV": DatasReception.holding.readFloatBE(72), "FT01_PV": DatasReception.holding.readFloatBE(76),
            "PT01_PV": DatasReception.holding.readFloatBE(80), "TT01_PV": DatasReception.holding.readFloatBE(84), "TT02_PV": DatasReception.holding.readFloatBE(88),
            "TT03_PV": DatasReception.holding.readFloatBE(92), "ModbusTCPFail": false

        },]).then((mbdata) => console.log(mbdata)).catch((e) => console.log(e))
    }

    mbdatafail() {

        aggDB.insertMany([{
            "metadata": {
                "Recep_Id": 1, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 1"
            },
            "timestamp": new Date(), "LT20_PV": null, "FT20_PV": null,
            "PT20_PV": null, "TT20_PV": null, "TT20_PV": null,
            "TT20_PV": null, "ModbusTCPFail": true
        },
        {
            "metadata": {
                "Recep_Id": 2, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 2"
            },
            "timestamp": new Date(), "LT01_PV": null, "FT01_PV": null,
            "PT01_PV": null, "TT01_PV": null, "TT02_PV": null,
            "TT03_PV": null, "ModbusTCPFail": true
        },
        {
            "metadata": {
                "Recep_Id": 3, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 3"
            },
            "timestamp": new Date(), "LT01_PV": null, "FT01_PV": null,
            "PT01_PV": null, "TT01_PV": null, "TT02_PV": null,
            "TT03_PV": null, "ModbusTCPFail": true
        },
        {
            "metadata": {
                "Recep_Id": 4, "type": "Equipament", "ProdUnit": "M³/Dia", "Job": "Recepção 4"
            },
            "timestamp": new Date(), "LT01_PV": null, "FT01_PV": null,
            "PT01_PV": null, "TT01_PV": null, "TT02_PV": null,
            "TT03_PV": null, "ModbusTCPFail": true
        },
        ]).then((mbdata)=>console.log(mbdata)).catch((e)=>{console.log(e)})
    }

}

const ReceptionMBTCP = new Reception()

async function start() {

    setInterval(() => {
        ping.sys.probe(hosts, (isAlive) => {
            var msg = isAlive ? console.log(`Host MB Partner: ${hosts} is alive`) + ReceptionMBTCP.crudMDB():
            console.log(`Host MB Partner: ${hosts} is not alive`) + ReceptionMBTCP.mbdatafail()
        })
    }, 2000)

}

start()
