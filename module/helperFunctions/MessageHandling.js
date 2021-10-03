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

    if (msg?.payload?.serverId && msg?.payload?.memberId) {
        return {
            memberId: msg.payload.memberId,
            serverId: msg.payload.serverId,
            messageId: null,
            propSource: 'payload'
        }
    } else if (node.memberId && node.serverId) {
        return {
            memberId: node.memberId,
            serverId: node.serverId,
            messageId: null,
            propSource: 'config'
        }
    } else if (msg?.discord?.messageId && msg?.discord?.serverId && msg?.discord?.memberId) {
        return {
            memberId: msg.discord.memberId,
            serverId: msg.discord.serverId,
            messageId: msg.discord.messageId,
            propSource: 'discord'
        }
    } else {
        return {
            memberId: null,
            serverId: null,
            messageId: null,
            propSource: null
        }
    }


}

// Should this also tell the user that the 
function removeNonDigits(str) {
    if(typeof str === 'string') {
        if(/\D/g.test(str)) {
            var newStr = str.replace(/\D/g, '')
            return newStr
        } else {
            return str
        }
    } else {
        return null
    }
}


function isString(x) {
    return Object.prototype.toString.call(x) === "[object String]"
}

/**
 * 
 * @param {Object} node Node-object
 * @param {string} memberId a discord-users id
 * @param {string} serverId a discord-servers id
 * @param {Object} redStatus object for generating status.
 * @param {Object} msg msg-object from discord. Will be used to populate discord-object of msg.
 * @returns {string[]} Roles
 */

let fetchRoles = async (node, memberId, serverId, redStatus, msg) => {
    msg.discord = msg?.discord || {} 

    try {
        guild = await node.client.guilds.fetch(serverId)
        msg.discord.guildName = msg.discord?.guildName || guild.name
        msg.discord.guildId = msg.discord?.guildId || guild.id
    } catch (error) {
        node.status(redStatus('Failed to fetch roles'))
        throw `Failed to fetch guildId with the following error: ${error.message}`;
    }

    try {
        member = await guild.members.fetch(memberId)
        msg.discord.memberId = msg.discord?.memberId || member.id
        msg.discord.username = msg.discord?.username || member.user.username 
    } catch (error) {
        node.status(redStatus('Failed to fetch member'))
        throw `Failed to fetch memberId with the following error: ${error.message}`;
    }


    try {
        let roles = Array.from(member.roles.cache.map(role => `${role.name}`));
        msg.discord.roles = msg.discord?.roles || roles
        return roles
    } catch (error) {
        node.status(redStatus('Failed to fetch roles'))
        throw `Failed to fetch roles with the following error: ${error.message}`;
    }

}

exports.getDiscordProperty = getDiscordProperty;
exports.fetchRoles = fetchRoles;
exports.isString = isString;
exports.messageListener = messageListener;
exports.messageStore = messageStore;
exports.removeNonDigits = removeNonDigits;