var events = require('events')
let messageStore = {
    delayedDelete: async function (id, ms) {
        try {
            if (ms !== 0) {
                this.eventHandler.emit('updateStatus')
            }
            setTimeout(() => {
                if (this.messages.has(id)) {
                    this.messages.delete(id)
                    this.eventHandler.emit('updateStatus')
                    return this
                }
            }, ms)
        } catch (err) {
            done(err)
        }
    },

    eventHandler: new events.EventEmitter(),

    messages: new Map()
};

let messageListener = message => {
    if (message.author.bot) return;

    if (this.content === 'test') {
        console.log(node.client.size)
    }

    node.messageStore.messages.set(this.id, this)

    let msg = {
        "payload": this.content,

        "discord": {
            "messageId": this.id,
            "servername": this.channel.guild.name,
            "serverId": this.guild.id,
            "SenderMemberId": this.member.id,
            "senderUsername": this.member.user.username
        }
    }

    // Construct mesasge object
    node.send(msg, false);

    // makes sure 
    node.messageStore.delayedDelete(this.id, 15000)
}

function getDiscordProperty(msg, node) {
    // Will check payload -> config -> discord-object 

    if (msg?.payload?.serverId && msg?.payload?.userId) {
        return {
            userId: msg.payload.userId,
            serverId: msg.payload.serverId,
            messageId: null,
            propSource: 'payload'
        }
    } else if (node.userId && node.serverId) {
        return {
            userId: node.userId,
            serverId: node.serverId,
            messageId: null,
            propSource: 'config'
        }
    } else if (msg?.discord?.messageId && msg?.discord?.serverId && msg?.discord?.userId) {
        return {
            userId: msg.discord.userId,
            serverId: msg.discord.serverId,
            messageId: msg.discord.messageId,
            propSource: 'discord'
        }
    } else {
        return {
            userId: null,
            serverId: null,
            messageId: null,
            propSource: null
        }
    }


}

function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

/**
 * 
 * @param {Object} node Node-object
 * @param {string} errorSource 
 * @param {string} userId a discord-users id
 * @param {string} serverId a discord-servers id
 * @param {Object} redStatus object for generating status.
 * @returns {string[]} Roles
 */

let fetchRoles = async (node, errorSource, userId, serverId, redStatus) => {
    try {
        guild = await node.client.guilds.fetch(serverId)
    } catch (error) {
        node.status(redStatus('Failed to fetch roles'))
        throw `Failed to fetch server using ${errorSource} with the following error: ${error.message}`;
    }

    try {
        member = await guild.members.fetch(userId)
    } catch (error) {
        node.status(redStatus('Failed to fetch status using payload-data'))
        throw `Failed to fetch user using ${errorSource} with the following error: ${error.message}`
    }


    try {
        let roles = Array.from(member.roles.cache.map(role => `${role.name}`));
        return roles
    } catch (error) {
        node.status(redStatus('Failed to fetch roles'))
        throw `Failed to fetch roles using ${errorSource} with the following error: ${error.message}`
    }

}

exports.getDiscordProperty = getDiscordProperty;
exports.fetchRoles = fetchRoles;
exports.isString = isString;
exports.messageListener = messageListener;
exports.messageStore = messageStore;