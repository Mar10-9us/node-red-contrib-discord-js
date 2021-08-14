var Discord = require('discord.js')
// TODO bør kanskje legges omtil discord-connector-config pga lexical-scope.....
let DCClient = (token) => {
    let client = new Discord.Client();

    client.on('ready', () => {
        console.log('im ready boiih')
    });

    client.login(token);

    return client
}

exports.DCClient = DCClient