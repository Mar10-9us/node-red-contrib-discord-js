# node-red-contrib-discord-js-drusilla
This node implements Discord.js V12.5.3 in Node-RED. The only reason for it being named 'Drusilla' at the end is because i had to make the package-name unique.

Not sure where to start? [Take a look at the examples!](EXAMPLES.md)

This module currently has these functionalities
* Multiple bot support
	* Each node can connect to the bot of your choice
* Receive messages
	* Listens for messages where the bot has access to. This includes direct messages!
* Get roles
	* Gets the roles of the specified user.
* Send messages
	* Send messages to a channel, user or reply to a message using strings or objects([embeds](https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object)).

[Remember to get your bot-token!](https://discord.com/developers/applications)
