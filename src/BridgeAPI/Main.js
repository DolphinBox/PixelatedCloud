// Cloudix RN-Node Bridge API
// React Native Side
import bridge from 'nodejs-mobile-react-native';
import log from './Helpers';
import EventEmitter from 'eventemitter3';
import uuid from 'uuid/v4';

export let reply = new EventEmitter();

export function startNodeProcess() {
    bridge.start('main.js');
    bridge.channel.addListener('message', bridgeCore, this);

    // Debug
    /*setTimeout(() => {
        requestGetState();
    },2000)*/
}

function bridgeCore(msg) {
    // This function is called when a message is received
    // and dispatches the intended action.
    // Messages come in a JSON format: {intent: '', body: {}}
   log.info('Got a Message from Node: ' + JSON.stringify(msg));
   switch(msg.intent) {
       case 'reply':
           // Catches the "reply" intent, which is called by Node if an intent
           // needs to get data back.
           reply.emit(msg.body.replyUUID, msg.body.payload);
           break;
       default:
           log.warn('Unknown Intent, Ignoring.');
   }
}

// Request Handlers
async function requestGetState() {
    log.info('Requesting the State from Node');
    // Create a unique reply uuid for the intent.
    let replyUUID = uuid();
    bridge.channel.send({
        intent: 'getState',
        body: {
            replyUUID: replyUUID
        }
    });
    const state = await new Promise(resolve => {
        reply.once(replyUUID, (payload) => {
            resolve(payload);
        });
    });
    log.info('Got the state! ' + JSON.stringify(state));
}
