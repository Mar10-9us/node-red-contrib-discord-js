module.exports = function (RED) {
    var { fetchRoles, getDiscordProperty } = require('./helperFunctions/MessageHandling')
    var { redStatus, greenStatus } = require('./helperFunctions/nodeStatus')
    function getRole(config) {
        RED.nodes.createNode(this, config);

        this.connection = RED.nodes.getNode(config.connection);
        var messageStore = this.connection.messageStore
        this.client = this.connection.client
        this.messageStore = this.connection.messageStore

        var node = this;

        node.on('input', async function (msg, send, done) {
            if (!(node.client.uptime)) return done('Client is not connected to discord.');

            // msg > config > discord-object
            let memberId = msg?.memberId || config?.memberId || msg?.discord?.memberId || null
            let guildId = msg?.guildId || config?.guildId || msg?.discord?.guildId || null
            let messageId = msg?.discord?.messageId || null

            if (!(memberId)) return done('No memberId specified')
            if (!(guildId)) return done('No guildId(server id) specified')

            // if messageId exists, it's most likely originating from the receiveMessage-node.
            if (messageId) {
                let roles 
                try {
                    roles = Array.from(messageStore.messages.get(messageId).member.roles.cache.map(role => role.name))

                    node.status(greenStatus("Roles fetched using message-object"))
                    msg.payload = roles
                    msg.discord.roles = roles
                } catch (error) {
                }

                if (roles) {
                    send(msg)
                    return done()
                }
            }

            // goes down this path if message was not found in messageStore or it failed to retrieve the roles.
            msg.discord = msg?.discord || {}

            try {
                guild = await node.client.guilds.fetch(guildId)
                msg.discord.guildName = msg.discord?.guildName || guild.name
                msg.discord.guildId = msg.discord?.guildId || guild.id
            } catch (error) {
                node.status(redStatus('Failed to fetch roles'))
                return done(`Failed to fetch guildId with the following error: ${error.message}`);
            }

            try {
                member = await guild.members.fetch(memberId)
                msg.discord.memberId = msg.discord?.memberId || member.id
                msg.discord.username = msg.discord?.username || member.user.username
            } catch (error) {
                node.status(redStatus('Failed to fetch member'))
                return done(`Failed to fetch memberId with the following error: ${error.message}`);
            }

            try {
                let roles = Array.from(member.roles.cache.map(role => `${role.name}`));
                msg.discord.roles = msg.discord?.roles || roles

            } catch (error) {
                node.status(redStatus('Failed to fetch roles'))
                return done(`xFailed to fetch roles with the following error: ${error.message}`);
            }

            send(msg)
            node.status(greenStatus('Roles fetched'))

            return done()


        })
    }

    RED.nodes.registerType('getRole', getRole);
}