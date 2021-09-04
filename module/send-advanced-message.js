module.exports = function (RED) {
    var { redStatus, greenStatus } = require('./helperFunctions/nodeStatus')
    // var { messageEmbed}
    function sendAdvancedMessage(config) {
        RED.nodes.createNode(this, config);

        // import the message-store. This is where message-object temporary gets stored.
        // Messages gets deleted if the endmost node of the flow is a reply node, or after 15 seconds.
        var connection = RED.nodes.getNode(config.connection);
        if(!(connection)) return;
        var node = this
        node.messageStore = connection.messageStore

        node.client = connection.client

        node.on('input', async function (msg, send, done) {

            node.action = msg?.action || 'send'
            let channelId = msg?.channelId || msg?.discord?.channelId || null
            let messageId = msg?.messageId || msg?.discord?.messageId || null
            let message = messageId ? node.messageStore.messages.get(messageId) : null
            let isEmbed = msg?.embed === true ? true : false;
            let messageObj = isEmbed ? { embed: msg.payload } : msg.payload

            if (isEmbed && typeof msg.payload !== 'object') return done(`To send an embed message, the payload needs to be of type 'object'. Current payload is of type ${typeof msg.payload}`)
            if (!(isEmbed) && typeof msg.payload !== 'string' && typeof msg.payload !== 'number') return done(`To send a simple message, the payload needs to be of type 'string' or 'number'. Current payload is of type ${typeof msg.payload}`)

            if (node.action === 'send') {
                if (message) {
                    try {
                        message.channel.send(messageObj)
                            .then(node.messageStore.delayedDelete(msg.discord.messageId, 15000))
                    } catch (e) {
                        return done('Could not send message.')
                    }


                } else {
                    if (!(channelId)) return done('No channelId specified')
                    try {
                        let channel = await node.client.channels.fetch(channelId)
                        try {
                            channel.send(messageObj)

                        } catch (e) {
                            return done('Could not send message.')
                        }

                    } catch (e) {
                        return done(e) // 'Could not fetch channel'
                    }
                }


            } else {
                // reply
                if (message) {
                    try {
                        (node.messageStore.messages.get(messageId)).reply(messageObj)
                            .then(node.messageStore.delayedDelete(messageId, 15000))
                    } catch (e) {
                        return done('Could not send message')
                    }
                } else {
                    if (!(messageId)) return done('No messageId specified. Specify an ID of which message you want to reply to.')
                    if (!(channelId)) return done('No channelId specified. You need to specify a channelId to reply to a channel message.')
                    try {
                        var channel = await node.client.channels.fetch(channelId)
                        var channelMsg = await channel.messages.fetch(messageId)
                    } catch (e) {
                        return done('Failed to fetch channel or message.')
                    }

                    try {
                        channelMsg.reply(messageObj)
                    } catch (e) {
                        return done('Could not send message')
                    }
                }
            }

            if (done) done();

        })
    }

    RED.nodes.registerType("sendAdvancedMessage", sendAdvancedMessage);
}