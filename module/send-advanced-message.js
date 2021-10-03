module.exports = function (RED) {
    var { redStatus, greenStatus } = require('./helperFunctions/nodeStatus')
    var { removeNonDigits } = require('./helperFunctions/MessageHandling')
    // var { messageEmbed}
    function sendAdvancedMessage(config) {
        RED.nodes.createNode(this, config);

        // FUNCTIONS

        // import the message-store. This is where message-object temporary gets stored.
        // Messages gets deleted if the endmost node of the flow is a reply node, or after 15 seconds.
        var connection = RED.nodes.getNode(config.connection);
        // Exit early if no configuration node is specified.
        if (!(connection)) return;

        var node = this
        node.messageStore = connection.messageStore

        node.client = connection.client

        node.on('input', async function (msg, send, done) {
            // This node should replace every send-node
            try {
                var action = (msg?.action || 'send').toLowerCase();
                var payload = msg?.payload || config?.message || null
                var channelId = removeNonDigits(msg?.channelId) || removeNonDigits(msg?.discord?.channelId) || null
                var messageId = removeNonDigits(msg?.messageId) || removeNonDigits(msg?.discord?.messageId) || null

                var message = config?.messageId ? node.messageStore.messages.get(config?.messageId) : null
                var isEmbed = msg.hasOwnProperty('embed') ? msg.embed : config.embed;
                var messageObj = isEmbed ? { embed: payload } : payload;
            } catch (e) {
                return done(`The node failed with the following error ${e.message}`)
            }
            // MUST ALSO SUPPORT DM?


            if (isEmbed && typeof payload !== 'object') return done(`To send an embed message, the payload needs to be of type 'object'. Current payload is of type ${typeof payload}`)
            if (!(isEmbed) && typeof payload !== 'string' && typeof payload !== 'number') return done(`To send a 'normal' message, the payload needs to be of type 'string' or 'number'. Current payload is of type ${typeof payload}`)


            if (action === 'send') {
                if (message) {
                    try {
                        await message.channel.send(messageObj)
                        // originally, it deleted the message using msg.discord.messageId. 
                        node.messageStore.delayedDelete(messageId, 15000)
                    } catch (e) {
                        return done(`Failed to send message: ${e.message}`)
                    }


                } else {
                    if (!(channelId)) return done('No channelId specified')
                    try {
                        let channel = await node.client.channels.fetch(channelId)
                        try {
                            channel.send(messageObj)

                        } catch (e) {
                            return done(`Failed to send message: ${e.message}`)
                        }

                    } catch (e) {
                        return done(`Failed to fetch channel: ${e.message}`);
                    }
                }


            } else if (action === 'reply') {
                if (message) {
                    try {
                        await message.reply(messageObj)
                        node.message(delayedDelete(messageId, 15000))
                    } catch (e) {
                        return done(`Failed to send message: ${e.message}`);
                    }
                } else {
                    if (!(messageId)) return done('No messageId specified. Specify an ID of which message you want to reply to.');
                    if (!(channelId)) return done('No channelId specified. You need to specify a channelId to reply to a channel message.');
                    try {
                        var channel = await node.client.channels.fetch(channelId);
                        var channelMsg = await channel.messages.fetch(messageId);
                    } catch (e) {
                        return done(`Failed to send or fetch message: ${e.message}`);
                    }

                    try {
                        await channelMsg.reply(messageObj)
                    } catch (e) {
                        return done(`Failed to send message: ${e.message}`);
                    }
                }
            } else if (action === 'edit') {
                if (!(channelId)) return done('You need to specify a channelId when attempting to edit a message');
                if (!(messageId)) return done('You need to specify a messageId when attemtping to edit a message');

                try {
                    // console.log(node.client)
                    var channels = await node.client.channels.fetch((channelId))
                    message = await channels.messages.fetch(messageId);
                    await message.edit(messageObj)
                } catch (e) {
                    return done(`Failed to edit message: ${e.message}`);
                }
            }


            if (done) done();

        })
    }

    RED.nodes.registerType("sendAdvancedMessage", sendAdvancedMessage);
}