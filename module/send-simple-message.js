module.exports = function (RED) {
    var { redStatus, greenStatus } = require('./helperFunctions/nodeStatus')
    function sendSimpleMessage(config) {
        RED.nodes.createNode(this, config);

        // import the message-store. This is where message-object temporary gets stored.
        // Messages gets deleted if the endmost node of the flow is a reply node, or after 15 seconds.
        var connection = RED.nodes.getNode(config.connection);
        // Exit early if no configuration node is specified.
        if (!(connection)) return;

        var node = this
        node.messageStore = connection.messageStore

        node.client = connection.client

        node.on('input', async function (msg, send, done) {
            // This node should replace every-send node
            console.log('received message')
            let action = (msg?.action || config?.action || 'send').toLowerCase();
            let payload = msg?.payload || config?.message | null
            let channelId = msg?.channelId || config.channelId || msg?.discord?.channelId || null
            let messageId = msg?.messageId || msg?.discord?.messageId || null
            let message = messageId ? node.messageStore.messages.get(messageId) : null
            let isEmbed = msg?.embed === true ? true : false;
            let messageObj = isEmbed ? { embed: msg.payload } : msg.payload;


            if (isEmbed && typeof payload !== 'object') return done(`To send an embed message, the payload needs to be of type 'object'. Current payload is of type ${typeof payload}`)
            if (!(isEmbed) && typeof payload !== 'string' && typeof payload !== 'number') return done(`To send a message, the payload needs to be of type 'string' or 'number'. Current payload is of type ${typeof payload}`)



            if (action === 'send') {
                console.log('in send')
                if (message) {
                    try {
                        message.channel.send(messageObj)
                        node.messageStore.delayedDelete(msg.discord.messageId, 15000)
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
                        return done(`Failed to fetch channel: ${e.message}`); // 'Could not fetch channel'
                    }
                }


            } else if (action === 'reply') {
                // reply
                console.log('in reply')
                if (message) {
                    try {
                        (node.messageStore.messages.get(messageId)).reply(messageObj)
                            .then(node.messageStore.delayedDelete(messageId, 15000))
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
                        channelMsg.reply(messageObj)
                    } catch (e) {
                        return done(`Failed to send message: ${e.message}`);
                    }
                }
            } else if (action === 'edit') {
                if (!(channelId)) return done('You need to specify a channelId when attempting to edit a message');
                if (!(messageId)) return done('You need to specify a messageId when attemtping to edit a message');

                try {
                    var channels = await node.client.channels.fetch(channelId);
                    message = await channels.messages.fetch(messageId)
                    message.edit(messageObj)
                } catch (e) {
                    return done(`Failed to edit message: ${e.message}`);
                }
            }




            if (done) done();

        })
    }

    RED.nodes.registerType("sendSimpleMessage", sendSimpleMessage);
}