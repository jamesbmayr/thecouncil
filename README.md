# The Council

Keep the republic from crumbling - rule the fantasy realm together in The Council, a card game of politics and persuasion.

---
<pre>
????????????????
????????????????
????????????????
????????????????
????????????????
????????????????
????????????????
????????????????
</pre>
---

## Launch
Every game has a unique 4-character id. Go to the homepage on a computer to start a new game.
Join a game on a computer or mobile device by entering the 4-character id.

## Gameplay
In this real-time game, players act as elected council members in a fantasy realm. Every issue before the group must be decided one way or another - but each decision will have consequences for the treasury, the scope of government, and the approval of constituents.

Can you stay in office and enact your policy goals before your term runs out?

## Code
The app is powered by nodeJS and websockets, written in 100% raw javascript. 

---
<pre>
thecouncil
|- package.json
|- index.js (handleRequest, parseRequest, routeRequest, \_302, \_403, \_404; handleSocket, parseSocket, routeSocket, updateSocket, \_400)
|- node_modules
|   |- websocket
|
|- main
|   |- logic.js (logError, logStatus, logMessage, logTime; getEnvironment, getAsset, getSchema; isNumLet, isBot; renderHTML, sanitizeString, duplicateObject; generateRandom, chooseRandom, sortRandom; determineSession, cleanDatabase)
|   |- stylesheet.css
|   |- icon.png
|   |- logo.png
|   |- banner.png
|   |- \_404.html
|
|- home
|   |- logic.js (createGame, createPlayer; joinGame)
|   |- index.html
|   |- stylesheet.css
|   |- script.js (isNumLet, sendPost, displayError; createGame, joinGame; drawLoop)
|
|- about
|   |- index.html
|   |- stylesheet.css
|   |- script.js (sanitizeString, sendPost, displayError; submitFeedback; drawLoop)
|
|- game
    |- logic.js (addPlayer, removePlayer; submitArrow, submitNote, submitTeam; changeSelection, launchGame; createAvatar, createTower, createColumn, createStartPosition, createArrow; triggerMove, triggerNote; getAngle, getScalar, getCells, getAvatar, getTower, getMatch, getBeatAgo; updateBeat, updateState, updateEffects, updateArrow, updateTower, updateVelocity, updateCollisions, updatePosition, updateHealth, updateMusic, updateMessage, updateWinning)
    |- index.html
    |- stylesheet.css
    |- script.js (createSocket, checkLoop; submitClick, submitKey, submitTouch; receivePost; createOverlay, drawMessage, drawMenu; drawDPad, drawKeyboard, drawEscape, buildMobileControls; setInstruments, playMusic, playSoundEffects, playSoundtrack, playAvatarSounds)
</pre>
