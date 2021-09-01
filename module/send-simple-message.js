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

            msg.payload = msg?.payload || config?.message || null
            node.action = msg?.action || config?.action || 'send'
            let channelId = msg?.channelId || config.channelId || msg?.discord?.channelId || null
            let messageId = msg?.messageId || msg?.discord?.messageId || null
            let message = messageId ? node.messageStore.messages.get(messageId) : null


            if (typeof msg.payload === 'string') {
                if (!(msg.payload)) {
                    return done('Cannot send empty string')
                }
            } else if (typeof msg.payload === 'number') {
                msg.payload = String(msg.payload);
            } else {
                return done('msg.payload needs to be a string.')
            }


            if (node.action === 'send') {
                if (message) {
                    message.channel.send(msg.payload)
                        .then(node.messageStore.delayedDelete(msg.discord.messageId, 15000))
                        .catch(error => node.warn(error))
                } else {
                    if (!(channelId)) return done('No channelId specified')
                    try {
                        let channel = await node.client.channels.fetch(channelId)
                        try {
                            channel.send(msg.payload)
                        } catch (e) {
                            return done('Could not send message')
                        }
                    } catch (e) {
                        return done('Could not fetch message')
                    }
                }


            } else {
                // reply
                if (message) {
                    try {
                        (node.messageStore.messages.get(messageId)).reply(msg.payload)
                            .then(node.messageStore.delayedDelete(messageId, 15000))
                    } catch (e) {
                        return done('Could not send message')
                    }
                } else {
                    if (!(messageId)) return done('No messageId specified.')
                    if (!(channelId)) return done('No channelId specified')
                    try {
                        var channel = await node.client.channels.fetch(channelId)
                        var channelMsg = await channel.messages.fetch(messageId)
                    } catch (e) {
                        return done('Failed to fetch channel or message.')
                    }
                    
                    try {
                        channelMsg.reply(msg.payload)
                    } catch (e) {
                        return done('Could not send message')
                    }
                }
            }


            if (done) done();

        })
    }

    RED.nodes.registerType("sendSimpleMessage", sendSimpleMessage);
}