// Cloudix RN-Node Bridge API
// NodeJS Side
let bridge = require('rn-bridge');
let log = require('./Helpers');
let ServerState = require('./State');

function startBridge() {
    log.info('Starting the Bridge...');
    bridge.channel.addListener('message', bridgeCore);

    log.info('Initializing ServerState...');
    // Initialize the ServerState.
    ServerState.setState({
        SSHConnected: false
    });
}

function bridgeCore(msg) {
    // This function is called when a message is received
    // and dispatches the intended action.
    // Messages come in a JSON format: {intent: '', body: {}}

    log.info('Got a Message from RN: ' + JSON.stringify(msg));
    switch(msg.intent) {
        case 'setState':
            intentSetState(msg);
            break;
        case 'getState':
            bridge.channel.send({
                intent: 'reply',
                body: {
                    replyUUID: msg.body.replyUUID,
                    payload: intentGetState(msg)
                }
            });
            break;
        case 'connectSSH':
            intentConnectSSH(msg);
            break;
        case 'startSOCKS':
            intentStartSOCKS(msg);
            break;
        default:
            log.warn('Unknown Intent, Ignoring.');
    }
}

// Intent Handlers
function intentSetState(msg) {
    log.info('Handling setState intent.');
    try {
        ServerState.setState(msg.body);
    } catch (e) {
        log.error('Crashed while setting state: ' + e);
    }
}
function intentGetState(msg) {
    return ServerState.getState();
}

function intentConnectSSH(msg) {
    let Client = require('ssh2').Client;
    ServerState.setState({
        SSH: new Client()
    });
    ServerState.getState().SSH.on('ready', function() {
        log.info('SSH Client :: ready');
        bridge.channel.send({
            intent: 'reply',
            body: {
                replyUUID: msg.body.replyUUID,
                payload: true
            }
        });
        ServerState.setState({
           SSHConnected: true
        });
    }).on('error', function(e) {
        // Could not connect
        log.warn('SSH Client :: error');
        bridge.channel.send({
            intent: 'reply',
            body: {
                replyUUID: msg.body.replyUUID,
                payload: false
            }
        });
        ServerState.setState({
            SSHConnected: false
        });
    }).connect({
        host: msg.body.hostname,
        port: msg.body.port,
        username: msg.body.username,
        password: msg.body.password
    });
}

function intentStartSOCKS(msg) {
    // The SSH conn is available at ServerState.getState().SSH
    log.info('Starting the SOCKS Server...');
    let socks = require('socksv5');
    let srv = socks.createServer(function(info, accept, deny) {
        ServerState.getState().SSH.forwardOut(info.srcAddr, info.srcPort, info.dstAddr, info.dstPort,
            function(err, stream) {
                if (err) {
                    log.warn('There was an error with SOCKS: ' + err);
                    return deny();
                }

                let clientSocket = accept(true);
                stream.pipe(clientSocket).pipe(stream).on('close', function() {
                    log.info('SOCKS Stream has closed.');
                });
            });
    }).listen(5222, 'localhost', function() {
        log.info('SOCKSv5 proxy server started on port 5222');
        bridge.channel.send({
            intent: 'reply',
            body: {
                replyUUID: msg.body.replyUUID,
                payload: true
            }
        });
    }).useAuth(socks.auth.None());

    ServerState.setState({
        SOCKS: srv
    });

}
module.exports = startBridge;
