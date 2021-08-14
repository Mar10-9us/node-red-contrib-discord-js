module.exports = function (RED) {
    var { isString, fetchRoles, getDiscordProperty } = require('./helperFunctions/MessageHandling')
    var { redStatus, greenStatus } = require('./helperFunctions/nodeStatus')
    function getRole(config) {
        RED.nodes.createNode(this, config);

        this.connection = RED.nodes.getNode(config.connection);
        var messageStore = this.connection.messageStore
        this.client = this.connection.client
        this.messageStore = this.connection.messageStore

        this.userId = config.userId
        this.serverId = config.serverId

        var node = this;

        node.on('input', async function (msg, send, done) {
            // payload > config > discord-object
            if (!(node.client.uptime)) return done('Client is not connected to discord.');

            let { userId, serverId, propSource, messageId } = getDiscordProperty(msg, node)

            if (propSource == 'payload') {

                try {
                    let roles = await fetchRoles(node, propSource, userId, serverId, redStatus);

                    msg.payload = roles;

                    if (!(msg?.discord)) {
                        msg.discord = {
                            "userId": userId,
                            "serverId": serverId,
                            "roles": roles
                        }
                    } else {
                        msg.discord.roles = roles
                    }


                } catch (error) {
                    node.log(error)
                    node.status(redStatus('Failed to fetch status using payload-data'))
                    return done(`Failed to fetch roles with the following error: ${error.message}`);
                }

                send(msg)
                node.status(greenStatus('Roles fetched using payload'))

                return done()

            } else if (propSource == 'config') {
                try {
                    let roles = await fetchRoles(node, propSource, userId, serverId, redStatus);
                    msg.payload = roles;

                    if (!(msg?.discord)) {
                        msg.discord = {
                            "userId": userId,
                            "serverId": serverId,
                            "roles": roles
                        }
                    } else {
                        msg.discord.roles = roles
                    }


                } catch (error) {
                    node.log(error)
                    node.status(redStatus('Failed to fetch status using payload-data'))
                    return done(`Failed to fetch roles with the following error: ${error.message}`);
                }

                send(msg)
                node.status(greenStatus("Roles fetched using id's specified"))

                return done()

            } else if (properties.type == 'discord') {

                try {
                    let roles = Array.from(messageStore.messages.get(messageId).member.roles.cache.map(role => role.name))

                    node.status(greenStatus("Roles fetched using message-object"))

                    msg.payload = roles
                    msg.discord.roles = roles
                } catch (error) {
                    try {
                        roles = await fetchRoles(node, "msg.discord", userId, serverId, redStatus, done);
                    } catch (error) {
                        return done(error);
                    }
                }

                send(msg)


                return done()

            } else {
                node.status(redStatus('Failed to fetch roles'))
                done('no parameters specified.');
            }

        })
    }

    RED.nodes.registerType('getRole', getRole);
}