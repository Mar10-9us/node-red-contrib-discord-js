module.exports = function (RED) {
    // var {removeEntry} = require('./helperFunctions/MessageHandling')
    //  var { getDiscordProperty } = require('./helperFunctions/MessageHandling')

    // let messageListener = 

    function receiveMessage(config) {

        RED.nodes.createNode(this, config);
        var parent = RED.nodes.getNode(config.connection)
        this.showStatus = config.showStatus

        this.messageStore = parent.messageStore
        this.client = parent.client

        // Allows the use of 'node' inside the client.on-listener.
        var node = this;

        node.client.on('message', message => {
            if (message.author.bot) return;

            // node.thisStore[message.id] = message.id
            node.messageStore.messages.set(message.id, message)

            let msg = {
                "payload": message.content,

                "discord": {
                    "message": message.content,
                    "messageId": message.id,
                    "servername": message.channel.guild.name,
                    "serverId": message.guild.id,
                    "userId": message.member.id,
                    "Username": message.member.user.username
                }
            }

            // Construct mesasge object
            node.send(msg, false);

            // makes sure 
            node.messageStore.delayedDelete(message.id, 15000)
        })

        if (node.showStatus) {
            node.messageStore.eventHandler.on('updateStatus', () => {
                node.status({ fill: "green", shape: "dot", text: `${node.messageStore.messages.size} messages temporary saved in memory` });
            })
        } else {
            node.status({})
        }
    }
    RED.nodes.registerType("receiveMessage", receiveMessage);
}
