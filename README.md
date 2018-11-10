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
|   |- logic.js (logError, logStatus, logMessage, logTime; getEnvironment, getAsset, getSchema; isNumLet, isBot; renderHTML, sanitizeString, duplicateObject; generateRandom, chooseRandom, sortRandom; determineSession)
|   |- stylesheet.css
|   |- icon.png
|   |- logo.png
|   |- banner.png
|   |- \_404.html
|   |- script.js (sanitizeString; isEmail, isNumLet; sendPost; displayMessage)
|
|- home
|   |- logic.js (createGame, createPlayer; joinGame)
|   |- index.html
|   |- stylesheet.css
|   |- script.js (createGame, joinGame)
|
|- about
|   |- index.html
|   |- stylesheet.css
|   |- script.js (submitFeedback)
|
|- game
    |- logic.js (addPlayer, removePlayer; submitStart, submitRecall, submitIssue, submitOption, submitTally, submitCampaign; selectIssue, selectOption; enactStart, enactRecall, enactTally, enactConsequences, enactCampaign, enactElection, enactEnd; getIdeology, getApproval; updateTime, updateRatings, updateRebellions, updateOverthrow, updateMembers, updateFuture, updateIssues)
    |- index.html
    |- stylesheet.css
    |- script.js (createSocket, checkLoop; submitStart, submitRecall, submitIssue, submitOption, submitTally, submitCampaign; receivePost, receiveStart; createIssue, createGovernment, createMember; updateIssues, updateGovernment, updateMember, updateButtons)
</pre>
