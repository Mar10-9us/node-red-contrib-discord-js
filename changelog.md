# Changelog
A summary of the most important features changed per version is found here.

## [1.1.1]
HOTFIX:
* Logic rebuilt to properly handle setting the embed-value using both msg-properties and node configuration.

## [1.1.0]
Features:
* sendSimpleMessage now supports embeds and is now the primary node for sending and editing messages. sendAdvancedMessage is deprecated and will not receive further development or bug-fixes.

## [1.0.5]
FEATURES
- This module now supports sending embed-messages using sendAdvancedMessage-node. 
 
BUGFIXES
- The configuration node now properly handles multiple discord-connections.

## [1.0.3]
You can now specify both message and channelId in the sendSimpleMessage-node