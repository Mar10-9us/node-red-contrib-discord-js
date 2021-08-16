module.exports = function (RED) {
    function replyMessage(config) {
        RED.nodes.createNode(this, config);

        // import the message-store. This is where message-object temporary gets stored.
        // Messages gets deleted if the endmost node of the flow is a reply node, or after 15 seconds.
        var parent = RED.nodes.getNode(config.connection);
        this.messageStore = parent.messageStore

        this.replyTo = config.replyTo

        var node = this

        node.on('input', function (msg, send, done) {

            if (typeof msg.payload === 'string') {
            } else if (typeof msg.payload === 'number') {
                msg.payload = String(msg.payload);
            } else {
                done('Msg.payload needs to be a string.')
            }

            let message = node.messageStore.messages.get(msg.discord.messageId)
            
            if (node.replyTo === 'channel') {


                if (message) {
                    message.channel.send(msg.payload)
                        .then(node.messageStore.delayedDelete(msg.discord.messageId, 15000))
                        .catch(error => node.warn(error))
                } else {


                }


            } else {
                (node.messageStore.messages.get(msg.discord.messageId)).reply(msg.payload)
                    .then(node.messageStore.delayedDelete(msg.discord.messageId, 15000))
                    .catch(error => node.warn(error));
            }

           
            if (done) done();

        })
    }

    RED.nodes.registerType("replyMessage", replyMessage);
}