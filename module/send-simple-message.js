module.exports = function (RED) {
    var { redStatus, greenStatus } = require('./helperFunctions/nodeStatus')
    function sendSimpleMessage(config) {
        RED.nodes.createNode(this, config);

        // import the message-store. This is where message-object temporary gets stored.
        // Messages gets deleted if the endmost node of the flow is a reply node, or after 15 seconds.
        var connection = RED.nodes.getNode(config.connection);
        var node = this
        node.messageStore = connection.messageStore
        
        node.client = connection.client

        node.on('input', async function (msg, send, done) {

            if (typeof msg.payload === 'string') {
            } else if (typeof msg.payload === 'number') {
                msg.payload = String(msg.payload);
            } else {
                done('msg.payload needs to be a string.')
            }

            if (!(msg.payload)) {
                node.status(redStatus('msg.payload cant be empty.'))
                done('msg.payload cant be empty.')
            }

            // is replyTo set using payload?
            // node.replyTo = msg.discord
            node.replyTo = msg.replyTo || config.replyTo 
            let message = msg?.discord?.messageId ? node.messageStore.messages.get(msg.discord.messageId) : null

            if (node.replyTo === 'channel') {

                if (message) {
                    message.channel.send(msg.payload)
                        .then(node.messageStore.delayedDelete(msg.discord.messageId, 15000))
                        .catch(error => node.warn(error))
                } else {
                    if (msg?.discord?.channelId) {
                        try {
                            let channel = await node.client.channels.fetch(msg.discord.channelId)
                            channel ? channel.send(msg.payload) : done('Could not send message')
                        } catch (e) {
                            done('Could not fetch message')
                        }
                    }

                }


            } else {

                if (message) {
                    try {
                        (node.messageStore.messages.get(msg.discord.messageId)).reply(msg.payload)
                            .then(node.messageStore.delayedDelete(msg.discord.messageId, 15000))
                    } catch (e) {
                        done('Could not send message')
                    }
                } else {

                }
            }


            if (done) done();

        })
    }

    RED.nodes.registerType("sendSimpleMessage", sendSimpleMessage);
}