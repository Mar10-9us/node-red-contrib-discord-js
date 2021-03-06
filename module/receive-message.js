module.exports = function (RED) {
    function receiveMessage(config) {
        RED.nodes.createNode(this, config);
        var connection = RED.nodes.getNode(config.connection)
        this.showStatus = config.showStatus
        if (!(connection)) return;
        
        this.messageStore = connection.messageStore
        this.client = connection.client
        var node = this;


        // 
        var onUpdateStatus = () => {
            node.status({ fill: "green", shape: "dot", text: `${node.messageStore.messages.size} messages temporary saved in memory` });
        }
        // listener-callback. 
        var onMessage = (message) => {
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
                        "channelType": message.channel.type,
                        "channelId": message.channel.id
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
                        "channelType": message.channel.type,
                        "channelId": message.channel.id
                    }
                }
            }

            node.send(msg, false);

            node.messageStore.delayedDelete(message.id, 10000)
        }

        // event listener
        node.client.on('message', onMessage)
        
        // Ensures that eventlisteneres gets removed.
        node.on('close', () => {
            node.client.removeListener('message', onMessage)
            node.client.removeListener('updateStatus', onUpdateStatus)
            node.status({})
        })

        if (node.showStatus) {
            node.messageStore.eventHandler.on('updateStatus', onUpdateStatus)
        } else {
            node.client.removeListener('updateStatus', onUpdateStatus)
            node.status({})
        }

        
    }
    RED.nodes.registerType("receiveMessage", receiveMessage);
}
