import WebSocket from 'ws';
import dotEnv from 'dotenv';
import axios from 'axios';

dotEnv.config();


async function openConnection(ws: WebSocket) {
    const response = await axios.get('https://api.ipify.org?format=json');
    console.log(response.data);
    ws.send(JSON.stringify({
        group: 'status',
        payload: {
            publicIp: response.data.ip || null
        }
    }));
}

function run() {
    const {SERVER_URL = 'http://localhost:3000', CLIENT_TOKEN = 'client_token'} = process.env;
    const [, protocol, host] = SERVER_URL.match(/^(https?):\/\/(.*)$/);
    const wsProtocol = protocol === 'https' ? 'wss' : 'ws';

    const connect = () => {
        const ws = new WebSocket(`${wsProtocol}://${host}/${CLIENT_TOKEN}`);

        ws.on('open', () => openConnection(ws));

        ws.on('error', (e: Error) => {
            console.log('connection error');
            console.log(e);
        });

        ws.on('close', () => {
            console.log('connection lost');
            reconnect();
        })
    };

    const reconnect = () => setTimeout(() => {
        console.log('reconnecting');
        connect();
    }, 3000);

    console.log('connecting')
    connect();
}

run();
