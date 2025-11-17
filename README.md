# 🏭 Node.js ModbusTCP + MongoDB

Este projeto foi um dos meus primeiros estudos em **IoT Industrial**

Ele demonstra:

- Conexão **Modbus TCP** usando **Node.js** e o pacote `jsmodbus`
- Simulação de um **servidor Modbus** que recebe dados de um PLC/simulador
- Escrita periódica desses dados em uma coleção **MongoDB**
- Detecção de falha de comunicação e marcação com `ModbusTCPFail`

Foi testado com o simulador **SIMATIC PLC Sim Advanced 4.0** (Siemens), enviando dados para o servidor Modbus implementado em Node.js. Esta versão é apenas para coleta de dados, não existe exemplos para envio de comandos a dispostivos industriais

---

## 🧠 Visão Geral da Arquitetura

```text
   +-------------------------+       ModbusTCP       +------------------------+
   |  SIMATIC PLCSIM Adv.   |  ------------------>  |  Node.js Modbus Server |
   |  (ou outro PLC/Sim)    |                       |  (jsmodbus + net)      |
   +-------------------------+                       +-----------+------------+
                                                               |
                                                               | Buffer (holding registers)
                                                               |
                                                    +----------v-----------+
                                                    |   mongo.js           |
                                                    |  (MilkReception)     |
                                                    |                      |
                                                    |  - Ping no host      |
                                                    |  - Lê holding        |
                                                    |  - Grava no MongoDB  |
                                                    +----------+-----------+
                                                               |
                                                               v
                                                      +------------------+
                                                      | MongoDB          |
                                                      | Master DB    |
                                                      | Receptions   |
                                                      +------------------+
📁 Estrutura do Projeto
text
Copiar código
.
├── mongo.js
├── servermodbus.js        (ou src/controllers/servermodbus.js, conforme o repo)
└── .env                   (connectionstring para o MongoDB)
⚙️ Configuração
1️⃣ Variáveis de ambiente (.env)
Crie um arquivo .env na raiz do projeto:

env
Copiar código
connectionstring=mongodb://usuario:senha@host:27017
A string deve apontar para o seu cluster/instância MongoDB.

2️⃣ Dependências
Instale as dependências necessárias:

sh
Copiar código
npm install mongodb jsmodbus ping dotenv
(Se tiver separado em pastas, ajuste conforme o seu package.json.)

🚀 Como Executar
1. Subir o servidor Modbus
Este servidor simula o lado ModbusTCP que receberá escritas do PLC/simulador:

sh
Copiar código
node servermodbus.js
Ele irá escutar na porta padrão Modbus:

text
Copiar código
Porta 502/TCP
Configure o PLCSIM Advanced 4.0 (ou outro simulador/PLC) para enviar escritas Modbus TCP para o IP/porta onde este servidor Node.js está rodando.

2. Subir o Ingestor MongoDB
Em outro terminal, execute:

sh
Copiar código
node mongo.js
O script irá:

a cada 2 segundos:

dar um ping no host Modbus (192.168.1.13, ou o IP que você configurar no código)

se o host estiver alive:

ler valores do buffer DatasReception.holding

gravar documentos com ModbusTCPFail: false

se o host estiver offline:

gravar documentos com todos os PVs null

ModbusTCPFail: true

🧪 Estrutura dos Documentos MongoDB
Exemplo simplificado de um documento na coleção Receptions:

json
Copiar código
{
  "metadata": {
    "Recep_Id": 1,
    "type": "Equipament",
    "ProdUnit": "M³/Dia",
    "Job": "Recepção 1"
  },
  "timestamp": "2024-01-01T12:00:00.000Z",
  "LT20_PV": 10.5,
  "FT20_PV": 5.2,
  "PT20_PV": 2.1,
  "TT20_PV": 40.0,
  "ModbusTCPFail": false
}
Quando houver falha de comunicação Modbus:

todos os campos de PV serão null

ModbusTCPFail será true

🎯 Objetivo Educacional
Este projeto marcou o início dos meus estudos em:

IoT Industrial

Protocolos de campo (Modbus TCP)

Integração Node.js ↔ PLC

Armazenamento de séries temporais simples via MongoDB

Apesar de simples, ele mostra bem o fluxo:

PLC/Simulador → ModbusTCP → Node.js

Node.js → MongoDB
