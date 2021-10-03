# node-red-contrib-discord-js-drusilla
### Current version: 1.1.1

This node implements Discord.js V12.5.3 in Node-RED. The only reason for it being named 'Drusilla' at the end is because i had to make the package-name unique.

Not sure where to start? [Take a look at the examples!](https://github.com/Mar10-9us/node-red-contrib-discord-js/blob/main/EXAMPLES.md)

Nodes and functionalities
* receiveMessage
	* Receives message sent in a channel the bot has access to, or via direct messages.
* getRole
	* Fetches the role of the user specified. Can easily be chained with other nodes in this module.
* sendSimpleMesasge
	* Node for sending and editing messages. Supports [embeds](https://discordjs.guide/popular-topics/embeds.html#using-an-embed-object).
* [DEPRECATED] sendAdvancedMessage
	* Ment to be a more advanced node which was only configurable using msg.properties. All of its features is now implemented in sendSimpleMessage.
 		
[Remember to get your bot-token!](https://discord.com/developers/applications)


## Changelog
#### [1.1.1]
HOTFIX:
* Logic rebuilt to properly handle setting the embed-value using both msg-properties and node configuration.

#### [1.1.0]
Features:
* sendSimpleMessage now supports embeds and is now the primary node for sending and editing messages. sendAdvancedMessage is deprecated and will not receive further development or bug-fixes.
----


### TODO:
* getUser node
* Sending files
* send-nodes should have outputs.