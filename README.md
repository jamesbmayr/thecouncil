# The Council

Keep the republic from crumbling - rule the fantasy realm together in The Council, a card game of politics and persuasion.

---
<pre>
-----------------------------
--------------*--------------
-----------*-----*-----------
---------*---------*---------
--------*-----*-----*--------
---------*---------*---------
-----------*-----*-----------
--------------*--------------
-----------------------------
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
|   |- logic.js (logError, logStatus, logMessage, logTime; getEnvironment, getAsset, getSchema; isNumLet, isBot; renderHTML, sanitizeString, duplicateObject; generateRandom, chooseRandom, sortRandom; determineSession; createFlag)
|   |- \_404.html
|   |- stylesheet.css
|   |- script.js (sanitizeString; isEmail, isNumLet; chooseRandom; sendPost; displayMessage)
|   |- draw.js (clearData, randomizeData; clearCanvas, rotateCanvas; drawLine, drawCircle, drawTriangle, drawRectangle, drawShape, drawText, drawGradient; createFlag, addField, addStructure, addSeals, addRing, addEmblems)
|   |- images
|      |- banner.png
|      |- icon.png
|      |- j.png
|      |- logo.png
|      |- x.png
|
|- home
|   |- logic.js (createGame, createPlayer; joinGame)
|   |- index.html
|   |- stylesheet.css
|   |- script.js (createGame, joinGame; updateBackground, moveFlags, cycleColors)
|
|- about
|   |- index.html
|   |- stylesheet.css
|   |- script.js (submitFeedback; createFlags, cycleColors)
|
|- game
    |- logic.js (addPlayer, removePlayer; submitStart, submitRecall, submitIssue, submitOption, submitTally, submitCampaign; selectIssue, selectOption; enactStart, enactRecall, enactTally, enactConsequences, enactCampaign, enactElection, enactEnd; getIdeology, getApproval, getAttributes; updateTime, updateMessages, updateRatings, updateRebellions, updateOverthrow, updateMembers, updateFuture, updateIssues)
    |- main.html
    |- main.css
    |- main.js (createSocket, checkLoop; cycleColors; submitStart; receivePost, receiveStart, receiveEnd; createNameFlag, createIssue, createGovernment, createEndMember; updateNameFlag, updateIssues, updateGovernment)
    |- player.html
    |- player.css
    |- player.js (createSocket, checkLoop; selectCouncil, selectDistrict; submitRecall, submitIssue, submitOption, submitTally, submitCampaign; receivePost, receiveStart, receiveEnd; createIssue, createMember, createEndMember; updateIssues, updateMember, updateButtons)
</pre>
