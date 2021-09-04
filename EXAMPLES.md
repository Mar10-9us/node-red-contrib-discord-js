# Examples
## 1. Reply to all messages
Replies to all messages sent to channels visible to the bot with 'hi'.

![Example1](/images/ExampleSendAndReply.png)
```json
[{"id":"5ffd464274adec5d","type":"receiveMessage","z":"65e4107c80f639a5","name":"","connection":"dd9bb72196c4c070","showStatus":true,"x":120,"y":460,"wires":[["12e81e1eb2d7624e"]]},{"id":"37c69a0ddc9990bb","type":"sendSimpleMessage","z":"65e4107c80f639a5","name":"","connection":"7df26bf332d6c2f8","action":"","channelId":"","message":"","x":500,"y":460,"wires":[]},{"id":"12e81e1eb2d7624e","type":"change","z":"65e4107c80f639a5","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"hi","tot":"str"},{"t":"set","p":"action","pt":"msg","to":"reply","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":310,"y":460,"wires":[["37c69a0ddc9990bb"]]}]
```


## 2. Reply to message if user is an administrator
Replies to the message if user is a part of the administrator-group.

![Example2](/images/ReplyToAdministrators.png)
```json
[{"id":"b6bdc4d2f7a8807a","type":"receiveMessage","z":"65e4107c80f639a5","name":"","connection":"dd9bb72196c4c070","showStatus":true,"x":120,"y":560,"wires":[["f21e5dbdda1aaba0"]]},{"id":"f21e5dbdda1aaba0","type":"getRole","z":"65e4107c80f639a5","name":"","connection":"7df26bf332d6c2f8","memberId":"","guildId":"","x":280,"y":560,"wires":[["d0e5a434d6524485"]]},{"id":"5a0b8a37e0301ead","type":"sendSimpleMessage","z":"65e4107c80f639a5","name":"","connection":"7df26bf332d6c2f8","action":"","channelId":"","message":"","x":740,"y":560,"wires":[]},{"id":"d0e5a434d6524485","type":"switch","z":"65e4107c80f639a5","name":"","property":"payload","propertyType":"msg","rules":[{"t":"cont","v":"Administrator","vt":"str"}],"checkall":"true","repair":false,"outputs":1,"x":410,"y":560,"wires":[["7c79372c51991f78"]]},{"id":"7c79372c51991f78","type":"change","z":"65e4107c80f639a5","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"hi, boss","tot":"str"},{"t":"set","p":"action","pt":"msg","to":"reply","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":560,"y":560,"wires":[["5a0b8a37e0301ead"]]}]
```

## 3. Create a bot which reacts to commands.
Implements a bot-command in the discord chat to look-up permission groups.

![Example3](/images/BotsnCommands.png)
!["Chat command"](/images/botCommand.png)


```json
[{"id":"9af746f565033118","type":"receiveMessage","z":"f061cf243f73728f","name":"","connection":"9ae97dae3589b501","showStatus":true,"x":220,"y":480,"wires":[["d832b06ca1f6da4c"]]},{"id":"d832b06ca1f6da4c","type":"switch","z":"f061cf243f73728f","name":"","property":"payload","propertyType":"msg","rules":[{"t":"regex","v":"^!bot ","vt":"str","case":true}],"checkall":"true","repair":false,"outputs":1,"x":370,"y":480,"wires":[["bfebf08c5c50bccc"]]},{"id":"bfebf08c5c50bccc","type":"function","z":"f061cf243f73728f","name":"SplitString","func":"var [ command, argument ] = (msg.payload.split(\" \")).slice(1)\n\nmsg.command = command;\nmsg.argument = argument;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":510,"y":480,"wires":[["e3067cd3360b220e"]]},{"id":"e3067cd3360b220e","type":"switch","z":"f061cf243f73728f","name":"Command","property":"command","propertyType":"msg","rules":[{"t":"regex","v":"getRole","vt":"str","case":true},{"t":"regex","v":"OtherCommand","vt":"str","case":true}],"checkall":"false","repair":false,"outputs":2,"x":670,"y":480,"wires":[["e803ab51b180fbe9"],[]]},{"id":"e803ab51b180fbe9","type":"change","z":"f061cf243f73728f","name":"","rules":[{"t":"set","p":"memberId","pt":"msg","to":"argument","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":870,"y":440,"wires":[["3cbc7dc3ea762f76"]]},{"id":"3cbc7dc3ea762f76","type":"getRole","z":"f061cf243f73728f","name":"","connection":"9ae97dae3589b501","memberId":"","guildId":"","x":1040,"y":440,"wires":[["04d6eef296e93058"]]},{"id":"a4b07ca605cf31c1","type":"sendSimpleMessage","z":"f061cf243f73728f","name":"","connection":"9ae97dae3589b501","action":"","channelId":"","message":"","x":1340,"y":440,"wires":[]},{"id":"04d6eef296e93058","type":"template","z":"f061cf243f73728f","name":"","field":"payload","fieldType":"msg","format":"handlebars","syntax":"mustache","template":"This is {{discord.username}}'s roles:\n{{discord.roles}}","output":"str","x":1180,"y":440,"wires":[["a4b07ca605cf31c1"]]}]
```

## 4. Send an embed-message using the inject-node.
Sends an embed-object with many fields to a channel.

![Example4](/images/sendEmbed.png)
```json
[{"id":"a594c1fa6d3fbabd","type":"sendAdvancedMessage","z":"f061cf243f73728f","name":"","connection":"9ae97dae3589b501","x":1050,"y":740,"wires":[]},{"id":"807f0818182fdbda","type":"inject","z":"f061cf243f73728f","name":"","props":[{"p":"payload"},{"p":"channelId","v":"REPLACEME","vt":"str"},{"p":"embed","v":"true","vt":"bool"},{"p":"action","v":"send","vt":"str"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"{\"color\":39423,\"title\":\"Some title\",\"url\":\"https://discord.js.org\",\"author\":{\"name\":\"Some name\",\"icon_url\":\"https://i.imgur.com/AfFp7pu.png\",\"url\":\"https://discord.js.org\"},\"description\":\"Some description here\",\"thumbnail\":{\"url\":\"https://i.imgur.com/AfFp7pu.png\"},\"fields\":[{\"name\":\"Regular field title\",\"value\":\"Some value here\"},{\"name\":\"I am a title\",\"value\":\"And this is my content\",\"inline\":false},{\"name\":\"Inline field title\",\"value\":\"Some value here\",\"inline\":true},{\"name\":\"Inline field title\",\"value\":\"Some value here\",\"inline\":true},{\"name\":\"Inline field title\",\"value\":\"Some value here\",\"inline\":true}],\"image\":{\"url\":\"https://i.imgur.com/AfFp7pu.png\"},\"timestamp\":\"2021-09-04T22:33:13.813Z\",\"footer\":{\"text\":\"Some footer text here\",\"icon_url\":\"https://i.imgur.com/AfFp7pu.png\"}}","payloadType":"json","x":850,"y":740,"wires":[["a594c1fa6d3fbabd"]]}]
```