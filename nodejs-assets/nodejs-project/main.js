// PixelatedClouds Node Process
//var Client = require('ssh2').Client;
let startBridge = require('./BridgeAPINode/Main');
let log = require('./BridgeAPINode/Helpers');
log.info('Node Process Started!');
startBridge(); // Start the Bridge listeners.
