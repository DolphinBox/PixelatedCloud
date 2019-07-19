# BridgeAPI Internal Documentation
The main React Native JS and NodeJS process communicate over a Bridge, a simple event system. Either side can 
emit a simple json message, and the other side can listen for it.

The PixelatedCloud BridgeAPI extends the simple messaging system with intents, replies and more.

Two types of events-ish:
* Intent
* Request (is a special intent)

## Sending an Intent with reply data
```javascript
bridge.channel.send({
        intent: 'getState',
        body: {
            replyUUID: replyUUID
        }
    });
```
Pass send your intent, and in the body send a replyUUID (`let replyUUID = uuid();`).
Then, await for a event from the `reply` EventEmitter with the UUID as the event:
```javascript
let state = await new Promise(resolve => {
        reply.once(replyUUID, (payload) => {
            resolve(payload);
        });
    });
```
