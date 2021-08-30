module.exports = function (RED) {
    function receiveMessage(config) {
        RED.nodes.createNode(this, config);
        var parent = RED.nodes.getNode(config.connection)
        this.showStatus = config.showStatus

        this.messageStore = parent.messageStore
        this.client = parent.client

        var node = this;
        // Should this be registered in the configuration node instead?
        node.client.on('message', message => {
            if (message.author.bot) return;

            node.messageStore.messages.set(message.id, message)

            let msg

            if (message.channel.type === 'text') {

                msg = {
                    "payload": message.content,

                    "discord": {
                        "message": message.content,
                        "messageId": message.id,
                        "guildName": message?.channel?.guild?.name,
                        "guildId": message.guild.id,
                        "memberId": message.member.id,
                        "username": message.member.user.username,
                        "channelType": message.channel.type
                    }
                }


            } else {
                msg = {
                    "payload": message.content,

                    "discord": {
                        "message": message.content,
                        "messageId": message.id,
                        "memberId": message.author.id,
                        "username": message.author.username,
                        "channelType": message.channel.type
                    }
                }
            }

            node.send(msg, false);

            node.messageStore.delayedDelete(message.id, 10000)
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
