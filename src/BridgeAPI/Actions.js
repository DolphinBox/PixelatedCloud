// Send Intents to Node.
import bridge from 'nodejs-mobile-react-native';
import uuid from 'uuid/v4';

import log from './Helpers'
import {reply} from './Main';

export async function connectSSH(host, port, user, pass) {
    let replyUUID = uuid();
    bridge.channel.send({
        intent: 'connectSSH',
        body: {
            username: user,
            password: pass,
            hostname: host,
            port: port,
            replyUUID: replyUUID
        }
    });
    const status = await new Promise(resolve => {
        reply.once(replyUUID, (payload) => {
            resolve(payload);
        });
    });
    if(status) {
        log.info('Connected to SSH!');
    } else {
        log.warn('Could not Connect to SSH.');
    }
    return status;
}

export async function startSOCKS() {
    let replyUUID = uuid();
    bridge.channel.send({
        intent: 'startSOCKS',
        body: {
            replyUUID: replyUUID
        }
    });
    const status = await new Promise(resolve => {
        reply.once(replyUUID, (payload) => {
            resolve(payload);
        });
    });
    if(status) {
        log.info('Started SOCKS!');
    } else {
        log.warn('Could not Start SOCKS.');
    }
    return status;
}
