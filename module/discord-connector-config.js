module.exports = function (RED) {
    var events = require('events')
    var Discord = require('discord.js')
    function DiscordConnection(config) {
        RED.nodes.createNode(this, config);

        // Due to the object received by the discord-client causes node-red to crash, i've decided to temporary save the object to a lookup-table.
        // The message-object get's deleted after x seconds, or when it is processed by a reply-node.
        // Each messageStore is unique to each bot.
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
        }


        let DCClient = (token) => {
            let client = new Discord.Client();

            client.on('ready', () => {
            });

            try {
                client.login(token);

            } catch (e) {
                client.destroy();
                return;
            }
            return client
        }

        // FUNCTION ENDS HERE


        this.name = config.name
        this.messageStore = messageStore

        this.client = DCClient(this.credentials.token)

        var node = this;

        node.on('close', function (removed, done) {
            if (removed) {
                // if removed
                try {
                    console.log('bapri')
                    node.client.removeAllListeners();
                    node.client.destroy();
                } catch (err) {
                    return done(err)
                }
            } else {
                // if restarted
                try {
                    node.client.removeAllListeners();
                    node.client.destroy();
                } catch (err) {
                    return done(err)
                }

                // establish connection after a node is restarted.
                try {
                    if (node.client) {
                        node.client.destroy();
                    }
                    node.client = DCClient(this.credentials.token)
                    console.log('logged in again')
                } catch (err) {
                    return done(err)
                }

            }

            done();
        })

    }

    RED.nodes.registerType("DiscordConnection", DiscordConnection, {
        credentials: {
            token: { type: "text" }
        }
    })
}