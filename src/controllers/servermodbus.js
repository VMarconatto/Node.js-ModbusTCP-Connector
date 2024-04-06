require('dotenv').config()

const modbus = require('jsmodbus')
const net = require('net')
const netServer = new net.Server()
const holding = Buffer.alloc(10000)
const server = new modbus.server.TCP(netServer, {
    holding: holding
})

const { error } = require('console')
const { disconnect } = require('process')


class ModbusTCPRun {
    constructor(isAlive = false) {
        this.connection = null
        this.isConnected = false
        this.reconnectDelay = 4000

    }

    connect(value = []) {
        this.connection = server
        this.connection.on(error, (err) => {
            console.error(`Modbus Connection Error: ${err}`)
            this.handleDisconnect()
        })

        console.log('entrou no connect')

        this.isConnected = true
        return value = this.sendRequest()
    }

    handleDisconnect() {
        console.log('entrou no erro')
        this.isConnected = false
        setTimeout(() => {
            this.connect()
        }, this.reconnectDelay);
    }

    sendRequest() {

        const mbvalues = server.on('postWriteMultipleRegisters', () => {
            const register = server.holding.buffer.slice(0, 12)
            const buff = Buffer.from(register)
            const json = buff.toJSON()
            return [...json.data]
        })
        return mbvalues
    }
}

const mbData = new ModbusTCPRun()
mbData.connect()

const DatasReception = mbData.sendRequest()


netServer.listen(502)

module.exports = DatasReception


