# Examples
## 1. Reply to all messages
Reply to all messages sent to channels visible to the bot with 'hi'.

![Example1](/images/ExampleSendAndReply.png)
```json
[{"id":"5ffd464274adec5d","type":"receiveMessage","z":"65e4107c80f639a5","name":"","connection":"dd9bb72196c4c070","showStatus":true,"x":120,"y":460,"wires":[["12e81e1eb2d7624e"]]},{"id":"37c69a0ddc9990bb","type":"sendSimpleMessage","z":"65e4107c80f639a5","name":"","connection":"7df26bf332d6c2f8","action":"","channelId":"","message":"","x":500,"y":460,"wires":[]},{"id":"12e81e1eb2d7624e","type":"change","z":"65e4107c80f639a5","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"hi","tot":"str"},{"t":"set","p":"action","pt":"msg","to":"reply","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":310,"y":460,"wires":[["37c69a0ddc9990bb"]]}]
```


## 2. Reply to message if user is an administrator

![Example2](/images/ReplyToAdministrators.png)
```json
[{"id":"b6bdc4d2f7a8807a","type":"receiveMessage","z":"65e4107c80f639a5","name":"","connection":"dd9bb72196c4c070","showStatus":true,"x":120,"y":560,"wires":[["f21e5dbdda1aaba0"]]},{"id":"f21e5dbdda1aaba0","type":"getRole","z":"65e4107c80f639a5","name":"","connection":"7df26bf332d6c2f8","memberId":"","guildId":"","x":280,"y":560,"wires":[["d0e5a434d6524485"]]},{"id":"5a0b8a37e0301ead","type":"sendSimpleMessage","z":"65e4107c80f639a5","name":"","connection":"7df26bf332d6c2f8","action":"","channelId":"","message":"","x":740,"y":560,"wires":[]},{"id":"d0e5a434d6524485","type":"switch","z":"65e4107c80f639a5","name":"","property":"payload","propertyType":"msg","rules":[{"t":"cont","v":"Administrator","vt":"str"}],"checkall":"true","repair":false,"outputs":1,"x":410,"y":560,"wires":[["7c79372c51991f78"]]},{"id":"7c79372c51991f78","type":"change","z":"65e4107c80f639a5","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"hi, boss","tot":"str"},{"t":"set","p":"action","pt":"msg","to":"reply","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":560,"y":560,"wires":[["5a0b8a37e0301ead"]]}]
```