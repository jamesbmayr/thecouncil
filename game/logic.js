/*** modules ***/
	var main       = require("../main/logic")
	module.exports = {}

/*** maps ***/
	var realms     = main.getAsset("realms")
	var races      = main.getAsset("races")
	var ideologies = main.getAsset("ideologies")
	var issues     = main.getAsset("issues")

/*** players ***/
	/* addPlayer */
		module.exports.addPlayer = addPlayer
		function addPlayer(request, callback) {
			try {
				if (!request.game) {
					callback([request.session.id], {success: false, message: "Game not found."})
				}
				else {
					// add player
						if (request.game.players[request.session.id]) {
							request.game.players[request.session.id].connected  = true
							request.game.players[request.session.id].connection = request.connection
						}

					// add observer
						else {
							request.game.observers[request.session.id] = main.getSchema("player")
							request.game.observers[request.session.id].id = request.session.id
							request.game.observers[request.session.id].connected  = true
							request.game.observers[request.session.id].connection = request.connection
						}

					// message
						if (!request.game.data.state.start) {
							callback([request.session.id], {success: true, message: "Waiting..."})
						}
						else if (request.game.data.state.end) {
							callback([request.session.id], {success: true, location: "../../../../"})
						}
						else {
							callback([request.session.id], {success: true,
								start:   request.game.data.state.start,
								showTally: (request.game.data.members[request.session.id] && request.game.data.members[request.session.id].state.leader) ? true : false,
								showRecall: request.game.past.length > 4 ? true : false,
								showCampaign: request.game.past.length > 2 ? true : false,
								id:      request.game.id,
								data:    request.game.data,
								message: "Rejoined game!"
							})
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to add player"})
			}
		}

	/* removePlayer */
		module.exports.removePlayer = removePlayer
		function removePlayer(request, callback) {
			try {
				main.logStatus("[CLOSED]: " + request.path.join("/") + " @ " + (request.ip || "?"))
				if (request.game) {
					// remove player or observer
						if (request.game.data.state.end || !request.game.data.state.start) {
							if (request.game.players[request.session.id]) {
								delete request.game.players[request.session.id]
							}
							else if (request.game.observers[request.session.id]) {
								delete request.game.observers[request.session.id]
							}
							callback([request.session.id], {success: true, location: "../../../../"})
						}

					// disable connection
						else {
							if (request.game.players[request.session.id]) {
								request.game.players[request.session.id].connected = false
							}
							else if (request.game.observers[request.session.id]) {
								request.game.observers[request.session.id].connected = false
							}
							callback([request.session.id], {success: true, location: "../../../../"})
						}

					// delete game ?
						var remaining = Object.keys(request.game.players).filter(function (p) {
							return request.game.players[p].connected
						}) || []

						if (!remaining.length) {
							callback(Object.keys(request.game.observers), {success: true, delete: true, location: "../../../../"})
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to remove player"})
			}
		}

/*** submits ***/
	/* submitStart */
		module.exports.submitStart = submitStart
		function submitStart(request, callback) {
			try {
				if (request.game.data.state.start) {
					callback([request.session.id], {success: false, message: "Game already started."})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "Game already ended."})
				}
				else if (Object.keys(request.game.players).length < 4 || Object.keys(request.game.players).length > 25) {
					callback([request.session.id], {success: false, message: "Must be 4 - 25 players."})
				}
				else {
					enactStart(request, callback)
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to start game"})
			}
		}

	/* submitRecall */
		module.exports.submitRecall = submitRecall
		function submitRecall(request, callback) {
			try {
				if (!request.game.data.state.start) {
					callback([request.session.id], {success: false, message: "Game has not started."})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "Game already ended."})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "Not a player."})
				}
				else if (request.game.data.state.cooldown) {
					callback([request.session.id], {success: false, message: "Something else is happening."})
				}
				else if (!request.game.data.state.leader) {
					callback([request.session.id], {success: false, message: "No leader to recall."})
				}
				else if (request.game.data.state.leader == request.session.id) {
					callback([request.session.id], {success: false, message: "Cannot recall yourself."})
				}
				else if (request.game.data.state.term < 120000) {
					callback([request.session.id], {success: false, message: "Leader was just elected."})
				}
				else if (request.game.data.rules.includes("term-length") && request.game.data.state.term < 300000) { // rule: term-length
					callback([request.session.id], {success: false, message: "Rule: leaders serve for 5+ minutes."})
				}
				else {
					enactRecall(request, callback)
					callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, recall: true, message: request.game.data.members[request.session.id].name + " calls for new leadership!"})
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to call for recall"})
			}
		}

	/* submitIssue */
		module.exports.submitIssue = submitIssue
		function submitIssue(request, callback) {
			try {
				if (!request.game.data.state.start) {
					callback([request.session.id], {success: false, message: "Game has not started."})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "Game already ended."})	
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "Not a player."})
				}
				else if (request.game.data.state.cooldown) {
					callback([request.session.id], {success: false, message: "Something else is happening."})
				}
				else if (!request.game.data.state.leader || !request.game.data.state.leader.id == request.session.id) {
					callback([request.session.id], {success: false, message: "Not the leader."})
				}
				else if (request.game.data.members[request.session.id].state.campaign && !request.game.data.rules.includes("absentee-voting")) { // rule: absentee-voting
					callback([request.session.id], {success: false, message: "Cannot legislate while campaigning."})
				}
				else if (!request.game.data.state.issue && !request.post.selection) {
					callback([request.session.id], {success: false, message: "Cannot unselect - no issue selected."})
				}
				else if ( request.game.data.state.issue ==  request.post.selection) {
					callback([request.session.id], {success: false, message: "Issue already selected."})
				}
				else if (!request.game.data.issues.find(function(i) { return i.id == request.post.selection })) {
					callback([request.session.id], {success: false, message: "Issue not found."})
				}
				else if (!request.post.selection && request.game.data.rules.includes("no-tabling")) { // rule: no-tabling
					callback([request.session.id], {success: false, message: "Rule: no tabling issues."})
				}
				else {
					selectIssue(request, callback)
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to select issue"})
			}
		}

	/* submitOption */
		module.exports.submitOption = submitOption
		function submitOption(request, callback) {
			try {
				if (!request.game.data.state.start) {
					callback([request.session.id], {success: false, message: "Game has not started."})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "Game already ended."})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "Not a player."})
				}
				else if (request.game.data.state.cooldown) {
					callback([request.session.id], {success: false, message: "Something else is happening."})
				}
				else if (request.game.data.members[request.session.id].state.leader && request.game.data.rules.includes("impartial-leader")) { // rule: impartial-leader
					callback([request.session.id], {success: false, message: "Rule: leader cannot vote."})
				}
				else if (request.game.data.members[request.session.id].state.campaign && !request.game.data.rules.includes("absentee-voting")) { // rule: absentee-voting
					callback([request.session.id], {success: false, message: "Cannot legislate while campaigning."})
				}
				else if (!request.game.data.state.issue) {
					callback([request.session.id], {success: false, message: "No issue selected."})
				}
				else if (!request.game.data.issues.find(function(i) { return i.id == request.game.data.state.issue })) {
					callback([request.session.id], {success: false, message: "Issue not found."})
				}
				else if (!request.game.data.members[request.session.id].state.selection && !request.post.selection) {
					callback([request.session.id], {success: false, message: "Cannot unselect - no option selected."})
				}
				else if ( request.game.data.members[request.session.id].state.selection ==  request.post.selection) {
					callback([request.session.id], {success: false, message: "Option already selected."})
				}
				else if (request.post.selection && !request.game.data.issues.find(function(i) { return i.id == request.game.data.state.issue }).options.find(function(o) { return o.id == request.post.selection })) {
					callback([request.session.id], {success: false, message: "Option not found."})
				}
				else if (request.game.data.issues.find(function(i) { return i.id == request.game.data.state.issue }).type == "leader" && request.game.data.rules.includes("no-self") && request.post.selection == request.session.id) { // rule: no-self
					callback([request.session.id], {success: false, message: "Rule: cannot elect yourself leader."})	
				}
				else {
					selectOption(request, callback)
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to cast vote"})
			}
		}

	/* submitTally */
		module.exports.submitTally = submitTally
		function submitTally(request, callback) {
			try {
				if (!request.game.data.state.start) {
					callback([request.session.id], {success: false, message: "Game has not started."})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "Game already ended."})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "Not a player."})
				}
				else if (request.game.data.state.cooldown) {
					callback([request.session.id], {success: false, message: "Something else is happening."})
				}
				else if (!request.game.data.state.issue) {
					callback([request.session.id], {success: false, message: "No issue selected."})
				}
				else if (request.game.data.rules.includes("no-abstentions") && Object.keys(request.game.data.members).filter(function(m) { return (!request.game.data.members[m].state.selection && !request.game.data.members[m].state.campaign && !(request.game.data.members[m].state.leader && request.game.data.rules.includes("impartial-leader"))) }).length) { // no-abstentions
					callback([request.session.id], {success: false, message: "Rule: members cannot abstain from voting."})
				}
				else if (request.game.data.members[request.session.id].state.campaign && !request.game.data.rules.includes("absentee-voting")) { // rule: absentee-voting
					callback([request.session.id], {success: false, message: "Cannot legislate while campaigning."})
				}
				else {
					enactTally(request, callback)
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to tally votes"})
			}
		}

	/* submitCampaign */
		module.exports.submitCampaign = submitCampaign
		function submitCampaign(request, callback) {
			try {
				if (!request.game.data.state.start) {
					callback([request.session.id], {success: false, message: "Game has not started."})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "Game already ended."})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "Not a player."})
				}
				else if (request.game.data.state.cooldown) {
					callback([request.session.id], {success: false, message: "Something else is happening."})
				}
				else if (request.game.data.members[request.session.id].state.campaign) {
					callback([request.session.id], {success: false, message: "Already campaigning."})
				}
				else if (request.game.data.rules.includes("short-season") && request.game.data.state.election - request.game.data.state.time > 300000) { // rule: short-season
					callback([request.session.id], {success: false, message: "Rule: no campaigning allowed until last 5 minutes."})
				}
				else if (request.game.data.members[request.session.id].state.leader && request.game.data.rules.includes("leader-presence")) { // rule: leader-presence
					callback([request.session.id], {success: false, message: "Rule: leaders cannot leave to campaign for reelection."})
				}
				else if (request.game.past.length < 3) {
					callback([request.session.id], {success: false, message: "Not enough issues to campaign on."})
				}
				else if (request.game.data.members[request.session.id].state.funds < 1000) {
					callback([request.session.id], {success: false, message: "Campaigning requires 1000 in funds."})
				}
				else {
					enactCampaign(request, callback)
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to conduct campaigning"})
			}
		}

/*** selects ***/
	/* selectIssue */
		module.exports.selectIssue = selectIssue
		function selectIssue(request, callback) {
			try {
				// issue
					request.game.data.state.issue = request.post.selection || null

				// reset selections
					for (var m in request.game.data.members) {
						request.game.data.members[m].state.selection = null
					}

				// rule: quick-voting
					if (request.game.data.rules.includes("quick-voting")) {
						var issue = request.game.data.issues.find(function (i) { return i.id == request.post.selection })
							issue.timeout = Math.min(60000, issue.timeout)
						callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: false, message: "Rule: 60-second voting period."})
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to select issue"})
			}
		}

	/* selectOption */
		module.exports.selectOption = selectOption
		function selectOption(request, callback) {
			try {
				// selection
					request.game.data.members[request.session.id].state.selection = request.post.selection || null

				// all selected?
					var allSelected = true
					for (var m in request.game.data.members) {
						if (!request.game.data.members[m].state.campaign && !request.game.data.members[m].state.selection) {
							allSelected = false
						}
					}

					if (allSelected) {
						enactTally(request, callback)
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to select option"})
			}
		}

/*** enacts ***/
	/* enactStart */
		module.exports.enactStart = enactStart
		function enactStart(request, callback) {
			try {
				// agencies
					for (var a in request.game.data.agencies) {
						request.game.data.agencies[a] = (Math.floor(Math.random() * 7) - 3) * 5 + 50
					}

				// ideologies
					var poolA = main.sortRandom(["socialist", "libertarian"])
					var poolB = main.sortRandom(["fascist", "populist", "anarchist", "crook"])
					var poolC = main.sortRandom(["socialist", "libertarian"])
					var available = ["liberal", "moderate", "conservative"]

					var playerCount = Object.keys(request.game.players).length
					while (available.length < playerCount) {
						if (available.length == 3) { // extreme
							available.push(poolA[0])
						}
						else if (available.length == 4) { // special
							available.push(poolB[0])
						}
						else if (available.length == 5) {
							available.push("moderate")
						}
						else if (available.length == 6) { // special
							available.push(poolB[1])
						}
						else if (available.length == 7) { // extreme
							available.push(poolA[1])
						}
						else if (available.length == 9) { // special
							available.push(poolB[2])
						}
						else if (available.length == 11) { // extreme
							available.push(poolC[0])
						}
						else if (available.length == 13) { // extreme
							available.push(poolC[1])
						}
						else if (available.length == 15) { // special
							available.push(poolB[3])
						}
						else {
							available.push(main.chooseRandom(["liberal", "moderate", "conservative"]))
						}
					}

				// members
					var count = 0
					for (var p in request.game.players) {
						count++
						var player = request.game.players[p]

						// info
							var member          = main.getSchema("member")
								member.id       = player.id
								member.name     = player.name
								member.district = count
								member.race     = main.chooseRandom(races)
								member.ideology = ideologies.find(function(i) { return i.name == available[0] })
								available.shift()
							request.game.data.members[member.id] = member

						// populations & approval ratings
							for (var c in member.constituents) {
								member.constituents[c].population = (Math.floor(Math.random() * 4) * 1000) + 1000
								member.constituents[c].approval   = (Math.floor(Math.random() * 7) - 3) * 5 + 40

								if (c == member.race.short) {
									member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + 20))
								}
							}
					}

				// approval ratings
					updateRatings(request, callback)

				// start
					request.game.data.state.name  = [main.chooseRandom(realms), main.chooseRandom(realms)]
					request.game.data.state.start = new Date().getTime()
					request.game.data.state.cooldown = 15000
					callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, start: true, message: "Starting the game!", data: request.game.data})
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to start game"})
			}
		}
		
	/* enactRecall */
		module.exports.enactRecall = enactRecall
		function enactRecall(request, callback) {
			try {
				// create issue
					var issue = getAttributes(main.getSchema("issue"), issues.leader[0], callback)

				// members
					for (var m in request.game.data.members) {
						request.game.data.members[m].state.selection = null

						var option = main.getSchema("option")
							option.id   = m
							option.name = request.game.data.members[m].name

						if (request.game.data.members[m].state.leader) {
							request.game.data.members[m].state.leader = false

							// rule: term-limits & rule: no consecutives
								if (!request.game.data.rules.includes("term-limits") && !request.game.data.rules.includes("no-consecutives")) {
									option.state.default = true
									option.treasury = 0
									issue.options.push(option)
								}
						}
						else {
							option.constituents[request.game.data.members[m].race.short].approval = 5
							issue.options.push(option)
						}
					}

				// enact
					request.game.data.issues.push(issue)
					request.game.data.state.issue  = issue.id
					request.game.data.state.leader = null

					if (!issue.options.find(function (o) { return o.state.default })) {
						main.chooseRandom(issue.options).state.default = true
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to enact recall"})
			}
		}

	/* enactTally */
		module.exports.enactTally = enactTally
		function enactTally(request, callback) {
			try {
				// assign votes to options
					var issue = request.game.data.issues.find(function(i) {
						return i.id == request.game.data.state.issue
					})
					
					for (var m in request.game.data.members) {
						var option = issue.options.find(function (o) {
							return o.id == request.game.data.members[m].state.selection
						})

						if (option) {
							option.state.votes.push(m)
						}
						request.game.data.members[m].state.selection = null
					}

				// determine winning option(s)
					var totalVotes = 0
					var winningOptions = {
						ids:   [],
						votes: 0
					}

					for (var o in issue.options) {
						if (issue.options[o].state.votes.length > winningOptions.votes) {
							winningOptions.votes = issue.options[o].state.votes.length
							winningOptions.ids   = [issue.options[o].id]
							totalVotes += 1
						}
						else if (issue.options[o].state.votes.length == winningOptions.votes) {
							winningOptions.ids.push(issue.options[o].id)
							totalVotes += 1
						}
					}

				// special event types
					// rebellion: insufficient funds
						if (issue.type == "rebellion" && (request.game.state.treasury + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Not enough treasury to meet the rebels' demands!"})
						}

					// rebellion: insufficient military
						else if (issue.type == "rebellion" && (request.game.state.agencies.m + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.m) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "The military is too weak to stop the rebels!"})
						}

					// protest: insufficient funds
						if (issue.type == "protest" && (request.game.state.treasury + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Not enough treasury to meet the protestors' demands!"})
						}

					// protest: insufficient military
						else if (issue.type == "protest" && (request.game.state.agencies.m + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.m) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "The military is too weak to suppress the protest!"})
						}

					// austerity: insufficient s
						else if (issue.type == "austerity" && (request.game.state.agencies.s + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.s) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Cutbacks to social services are not enough!"})
						}

					// austerity: insufficient r
						else if (issue.type == "austerity" && (request.game.state.agencies.r + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.r) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Cutbacks to regulation are not enough!"})
						}

					// austerity: insufficient t
						else if (issue.type == "austerity" && (request.game.state.agencies.t + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.t) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Cutbacks to tech & research are not enough!"})
						}

					// austerity: insufficient m
						else if (issue.type == "austerity" && (request.game.state.agencies.m + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.m) < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Cutbacks to military are not enough!"})
						}

				// special rules
					// rule: balanced-budget
						else if (request.game.data.rules.includes("balanced-budget") && (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury < 0) && (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury + request.game.data.treasury < 0)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Rule: the treasury must become and stay positive."})
						}

					// rule: executive-decision
						else if (request.game.data.rules.includes("executive-decision") && issue.timeout <= 120000 && issue.options.find(function(o) { return o.state.votes.includes(request.game.data.state.leader) })) {
							issue.options.find(function(o) {
								return o.state.votes.includes(request.game.data.state.leader)
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Rule: the leader can make executive decisions on urgent issues."})
						}

					// rule: tiebreaker-leader
						else if (winningOptions.ids.length > 1 && request.game.data.rules.includes("tiebreaker-leader") && request.game.data.state.leader && issue.options.find(function(o) { return winningOptions.ids.includes(o.id) && o.state.votes.includes(request.game.data.state.leader) })) {
							issue.options.find(function(o) {
								return winningOptions.ids.includes(o.id) && o.state.votes.includes(request.game.data.state.leader)
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Rule: in the event of a tie, the leader's choice carries."})
						}

					// rule: majority-threshold
						else if (request.game.data.rules.includes("majority-threshold") && (winningOption.ids.length <= totalVotes / 2)) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Rule: options must have an outright majority."})
						}

				// otherwise
					// tie --> default
						else if (winningOptions.ids.length !== 1) {
							issue.options.find(function(o) {
								return o.state.default
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "No option had a plurality of votes."})
						}

					// outright winner
						else {
							issue.options.find(function(o) {
								return o.id == winningOptions.ids[0]
							}).state.selected = true
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "A plurality has decided."})
						}

				// reset & enact consequences
					enactConsequences(request, callback, issue)

			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to tally votes"})
			}
		}

	/* enactConsequences */
		module.exports.enactConsequences = enactConsequences
		function enactConsequences(request, callback, issue) {
			try {
				// data
					var winningOption = issue.options.find(function(o) {
						return o.state.selected
					}) || issue.options.find(function(o) {
						return o.state.default
					})

				// special numbers
					// first issue?
						if (request.game.past.length == 0) {
							setTimeout(function() {
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Issues affect government agencies: Social services, Regulation, Technology/education, and Military."})
							}, 12000)
							setTimeout(function() {
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Make the agencies match your secret ideology to win."})
							}, 16000)

							winningOption.issues.push({name: main.chooseRandom(issues.small ).name, type: "small" , delay: 15000})
							winningOption.issues.push({name: main.chooseRandom(issues.medium).name, type: "medium", delay: 15000})
							winningOption.issues.push({name: main.chooseRandom(issues.large ).name, type: "large" , delay: 15000})
						}

					// third issue?
						else if (request.game.past.length == 2) {
							setTimeout(function() {
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, showCampaign: true, message: "Low approval ratings? Campaign on the most recent issues to double their effect."})
							}, 12000)
							setTimeout(function() {
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Campaigns last 30 seconds - you cannot vote while you're away."})
							}, 16000)
						}

					// fifth issue?
						else if (request.game.past.length == 4) {
							setTimeout(function() {
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, showRecall: true, message: "Unhappy with the leader? Anyone can recall the leader for a new one."})
							}, 12000)
						}

				// consequences
					// treasury
						request.game.data.treasury = request.game.data.treasury + winningOption.treasury

					// agencies
						for (var a in request.game.data.agencies) {
							request.game.data.agencies[a] = Math.max(0, Math.min(100, request.game.data.agencies[a] + winningOption.agencies[a]))
						}

					// member approval ratings & funds
						var approvalMultiplier = request.game.data.rules.includes("restricted-press") ? 0.5 : 1 // rule: restricted-press
						var donationMultiplier = request.game.data.rules.includes("kickback-ban") ? 0 : request.game.data.rules.includes("dark-money") ? 2 : 1 // rule: kickback-ban & rule: dark-money

						for (var o in issue.options) {
							for (var v in issue.options[o].state.votes) {
								var member = request.game.data.members[issue.options[o].state.votes[v]]
								
								if (issue.options[o].state.selected) {
									member.funds                          = Math.max(0, member.funds + winningOption.funds * donationMultiplier)
									for (var c in member.constituents) {
										member.constituents[c].approval   = Math.max(0, Math.min(100, member.constituents[c].approval + winningOption.constituents[c].approval * approvalMultiplier))
										member.constituents[c].population = Math.max(0, member.constituents[c].population + winningOption.constituents[c].population)
									}
								}
								else {
									member.funds                            = Math.max(0, member.funds + Math.floor(issue.options[o].funds / 2 * donationMultiplier))
									for (var c in member.constituents) {
										if (request.game.data.rules.includes("secret-voting")) { // rule: secret-voting
											member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + winningOption.constituents[c].approval * approvalMultiplier))
										}
										else {
											member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + issue.options[o].constituents[c].approval * approvalMultiplier))
										}
										member.constituents[c].population = Math.max(0, member.constituents[c].population + winningOption.constituents[c].population)
									}
								}
							}
						}

					// overall approval ratings
						updateRatings(request, callback)

					// future issues
						for (var i in winningOption.issues) {
							request.game.future.push(winningOption.issues[i])
						}

				// special types
					// rules
						for (var r in winningOption.rules) {
							var rule = winningOption.rules[r]

							if (rule.enact) {
								request.game.data.rules.push(rule.name)
							}
							else if (request.game.data.rules.includes(rule.name)) {
								request.game.data.rules.splice(request.game.data.rules.indexOf(rule.name), 1)
							}

							// change election time
								if ((rule.name == "snap-elections" && rule.enact) || (rule.name == "delayed-elections" && !rule.enact)) { // rule: snap-elections // rule: delayed-elections
									request.game.data.state.election -= 600000
								}
								else if ((rule.name == "snap-elections" && !rule.enact) || (rule.name == "delayed-elections" && rule.enact)) { // rule: snap-elections // rule: delayed-elections
									request.game.data.state.election += 600000
								}
						}

					// leader
						if (issue.type == "leader") {
							request.game.data.state.leader = winningOption.id
							request.game.data.members[winningOption.id].state.leader = true

							// new term
								if (!winningOption.state.default) {
									request.game.data.state.term = 0
								}

							// update "tally" button
								for (var m in request.game.data.members) {
									if (request.game.data.state.leader == m) {
										callback(m, {success: true, showTally: true})
									}
									else {
										callback(m, {success: true, showTally: false})
									}
								}
						}

					// rebellion
						else if (issue.type == "rebellion" && winningOption.state.default) {
							request.game.data.state.exists = false
							updateOverthrow(request, callback)
						}

				// communicate
					if (issue.id !== request.game.data.state.issue) {
						request.game.data.state.cooldown = 10000
						
						setTimeout(function() {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Time's up!<br><br>An unresolved issue is resolving itself..."})
						}, 0)
						setTimeout(function() {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: (issue.name + " &rarr; " + winningOption.name)})
						}, 5000)
					}
					else {
						request.game.data.state.cooldown = 10000
						request.game.data.state.issue = null

						var message = ""
						for (var o in issue.options) {
							message += issue.options[o].name + ": "
							if (issue.options[o].state.votes.length) {
								for (var v in issue.options[o].state.votes) {
									message += request.game.data.members[issue.options[o].state.votes[v]].name + ", "
								}
								message = message.substring(0, message.length - 2)
							}
							else {
								message += " -"
							}
							message += "<br><br>"
						}
						message = message.substring(0, message.length - 4)

						setTimeout(function() {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: message})
						}, 3000)
						setTimeout(function() {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: (issue.name + " &rarr; " + winningOption.name)})
						}, 8000)
					}

				// move issue to the past
					request.game.past.push(issue)
					for (var i in request.game.data.issues) {
						if (request.game.data.issues[i].id == issue.id) {
							request.game.data.issues.splice(i, 1)
							break
						}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to enact consequences"})
			}
		}

	/* enactCampaign */
		module.exports.enactCampaign = enactCampaign
		function enactCampaign(request, callback) {
			try {
				// timeout & funds
					var member = request.game.data.members[request.session.id]
						member.state.campaign = 30000
						member.funds -= 1000

				// member approvals
					var latestIssues = request.game.past.slice(request.game.past.length - 3, request.game.past.length)
					for (var i in latestIssues) {
						var option = latestIssues[i].options.find(function(o) {
							return o.state.votes.includes(member.id)
						})

						if (option && option.state.selected) {
							for (var c in member.constituents) {
								member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + option.constituents[c].approval))
							}
						}
						else if (option) {
							for (var c in member.constituents) {
								member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + Math.floor(option.constituents[c].approval / 2)))
							}
						}
					}

				// overall approval ratings
					updateRatings(request, callback)

				// message
					callback([request.session.id], {success: true, message: "Campaigning on " + latestIssues.map(function (i) { return i.name }).join(" & ") })
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to go campaigning"})
			}
		}

	/* enactElection */
		module.exports.enactElection = enactElection
		function enactElection(request, callback) {
			try {
				// special victory
					updateOverthrow(request, callback)

				// normal victory
					if (request.game.data.state.exists) {
						for (var m in request.game.data.members) {
							var member = request.game.data.members[m]
							if (getApproval(member, callback) >= 50) {
								member.state.reelected = true
							}
							if (getIdeology(request, member, callback)) {
								member.state.achieved = true
							}
						}

						enactEnd(request, callback)
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to conduct the election"})
			}
		}

	/* enactEnd */
		module.exports.enactEnd = enactEnd
		function enactEnd(request, callback) {
			try {
				request.game.data.state.end      = new Date().getTime()
				request.game.data.state.election = request.game.data.state.time
				request.game.data.state.leader   = null
				request.game.data.state.term     = 0
				request.game.data.state.issue    = null
				request.game.data.state.cooldown = 60000
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to end the game"})
			}
		}

/*** helpers ***/
	/* getIdeology */
		module.exports.getIdeology = getIdeology
		function getIdeology(request, member, callback) {
			try {
				// assume true
					var achieved = true

				// cycle through agencies
					for (var a in request.game.data.agencies) {
						if (request.game.data.agencies[a] < member.ideology[a][0] || request.game.data.agencies[a] > member.ideology[a][1]) {
							achieved = false
						}						
					}

				// return data
					return achieved || false
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to calculate approval rating"})
			}
		}

	/* getApproval */
		module.exports.getApproval = getApproval
		function getApproval(member, callback) {
			try {
				// start at zero
					var approval   = 0
					var population = 0

				// cycle through groups
					for (var c in member.constituents) {
						population += member.constituents[c].population
						approval   += member.constituents[c].population * member.constituents[c].approval
					}

				// divide
					return Math.floor(approval / population)
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to calculate approval rating"})
			}
		}

	/* getAttributes */
		module.exports.getAttributes = getAttributes
		function getAttributes(issue, info, callback) {
			try {
				for (var key in info) {
					if (typeof info[key] == "object" && Array.isArray(info[key])) {
						issue[key] = issue[key] || []

						if (key == "options") {
							while (issue.options.length < info.options.length) {
								issue.options.push(main.getSchema("option"))
							}
						}

						issue[key] = getAttributes(issue[key], info[key], callback)
					}
					else if (typeof info[key] == "object") {
						issue[key] = issue[key] || {}
						issue[key] = getAttributes(issue[key], info[key], callback)	
					}
					else {
						issue[key] = info[key]
					}
				}

				return issue
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to apply issue attributes"})
			}
		}

/*** updates ***/
	/* updateTime */
		module.exports.updateTime = updateTime
		function updateTime(request, callback) {
			try {
				if (request.game.data.state.start) {
					// updates
						request.game.data.state.time += 1000
						request.game.data.state.cooldown = Math.max(0, request.game.data.state.cooldown - 1000)
						request.game.data.state.term += 1000

					// messages
						updateMessages(request, callback)

					// events
						if (request.game.data.state.time == 30000) {
							enactRecall(request, callback)
						}
						else if (request.game.data.state.time == request.game.data.state.election) {
							enactElection(request, callback)
						}
						else if (!request.game.data.state.end && request.game.data.state.time > 30000) {
							// future issues
								updateRebellions(request, callback)
								updateFuture(request, callback)

							// random issues
								updateIssues(request, callback)

							// campaigns & donations (& riots)
								updateMembers(request, callback)
								if (request.game.data.state.exists && !request.game.data.state.cooldown) {
									updateOverthrow(request, callback)
								}

							// rule: term-limits
								if (request.game.data.state.exists && request.game.data.rules.includes("term-limits") && !request.game.data.state.cooldown && request.game.data.state.term >= 300000) {
									enactRecall(request, callback)
									callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "Rule: 5-minute term limit."})
								}

							// send data
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, data: request.game.data})
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to process time interval"})
			}
		}

	/* updateMessages */
		module.exports.updateMessages = updateMessages
		function updateMessages(request, callback) {
			try {
				// time
					var time = request.game.data.state.time
					var election = request.game.data.state.election
					var ids = Object.keys(request.game.players).concat(Object.keys(request.game.observers))
				
				// start
					if (time == 5000) {
						callback(ids, {success: true, message: "Welcome to the council of " + request.game.data.state.name[0] + "!"})
					}
					else if (time == 10000) {
						callback(ids, {success: true, message: "When the session ends, get reelected - that's 50%+ approval overall."})
					}
					else if (time == 15000) {
						callback(ids, {success: true, message: "Keep your ratings up amongst dwarves, elves, fairies, goblins, & lizardfolk."})
					}
					else if (time == 20000) {
						callback(ids, {success: true, message: "Decide issues on behalf of your constituents."})
					}
					else if (time == 25000) {
						callback(ids, {success: true, recall: true, message: "First, choose a council leader to select which issues are debated."})
					}

				// end
					else if (time == election) {
						callback(ids, {success: true, message: "Election day!"})
					}
					else if (time == election + 3000 && request.game.data.state.exists) {
						callback(ids, {success: true, message: "The people are voting..."})
					}
					else if (time == election + 6000 && request.game.data.state.exists) {
						for (var m in request.game.data.members) {
							callback([m], {success: true, message: request.game.data.members[m].state.reelected ? "...Congratulations on your reelection!" : "...The voters have spoken! you're out!"})
						}
					}
					else if (time == election + 11000 && request.game.data.state.exists) {
						for (var m in request.game.data.members) {
							callback([m], {success: true, message: request.game.data.members[m].state.achieved ? "You have accomplished your policy goals!" : "You have failed to achieve your policy goals."})
						}
					}
					else if (request.game.data.state.time == request.game.data.state.election + 15000 && request.game.data.state.exists) {
						for (var m in request.game.data.members) {
							callback([m], {success: true, message: request.game.data.members[m].state.reelected && request.game.data.members[m].state.achieved ? "You win!" : "You lose!"})
						}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to send out messages"})
			}
		}

	/* updateRatings */
		module.exports.updateRatings = updateRatings
		function updateRatings(request, callback) {
			try {
				// reset
					for (var c in request.game.data.constituents) {
						request.game.data.constituents[c].population = 0
						request.game.data.constituents[c].approval   = 0
					}

				// sum members
					for (var m in request.game.data.members) {
						var member = request.game.data.members[m]

						for (var c in request.game.data.constituents) {
							request.game.data.constituents[c].population = Math.max(0, request.game.data.constituents[c].population + member.constituents[c].population)
							request.game.data.constituents[c].approval   = request.game.data.constituents[c].approval + (member.constituents[c].population * member.constituents[c].approval)
						}
					}

				// divide for ratings
					for (var c in request.game.data.constituents) {
						request.game.data.constituents[c].approval = Math.floor(request.game.data.constituents[c].approval / request.game.data.constituents[c].population)
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update overall approval ratings"})
			}
		}

	/* updateRebellions */
		module.exports.updateRebellions = updateRebellions
		function updateRebellions(request, callback) {
			try {
				// rebellions
					for (var c in request.game.data.constituents) {
						if (request.game.data.constituents[c].approval <= 25 && !request.game.data.issues.find(function(i) { return i.type == "rebellion" })) {
							request.game.data.issues.push(getAttributes(main.getSchema("issue"), issues.rebellion[0], callback))
						}
					}

				// austerity
					if (request.game.data.treasury < 0 && !request.game.data.issues.find(function(i) { return i.type == "austerity" })) {
						request.game.data.issues.push(getAttributes(main.getSchema("issue"), issues.austerity[0], callback))
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update rebellions"})
			}
		}

	/* updateOverthrow */
		module.exports.updateOverthrow = updateOverthrow
		function updateOverthrow(request, callback) {
			try {
				// special ideoogies
					var fascist = null
					var populist = null
					var anarchist = null
					var crook = null
					for (var m in request.game.data.members) {
						if (request.game.data.members[m].ideology.name == "fascist") {
							fascist = request.game.data.members[m]
						}
						else if (request.game.data.members[m].ideology.name == "populist") {
							populist = request.game.data.members[m]
						}
						else if (request.game.data.members[m].ideology.name == "anarchist") {
							anarchist = request.game.data.members[m]
						}
						else if (request.game.data.members[m].ideology.name == "crook") {
							crook = request.game.data.members[m]
						}
					}

				// fascist
					if (fascist && getIdeology(request, fascist, callback) && fascist.state.leader) {
						fascist.state.reelected = true
						fascist.state.achieved  = true
						request.game.data.state.exists = false
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: fascist.name + ", the fascist, has overthrown the government!"})
					}

				// anarchist
					else if (anarchist && getIdeology(request, anarchist, callback) && !request.game.data.state.exists) {
						anarchist.state.reelected = true
						anarchist.state.achieved  = true
						request.game.data.state.exists = false
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: anarchist.name + ", the anarchist, has overthrown the government!"})
					}

				// populist
					else if (populist && getIdeology(request, populist, callback) && getApproval(populist, callback) >= 75) {
						populist.state.reelected = true
						populist.state.achieved  = true
						request.game.data.state.exists = false
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: populist.name + ", the populist, has overthrown the government!"})
					}

				// crook
					else if (crook && getIdeology(request, crook, callback) && crook.funds >= 25000) {
						crook.state.reelected = true
						crook.state.achieved  = true
						request.game.data.state.exists = false
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: crook.name + ", the crook, has overthrown the government!"})
					}

				// rebellion
					else if (!request.game.data.state.exists) {
						callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "The rebellion has taken down the government!"})
					}

				// end ?
					if (!request.game.data.state.exists) {
						enactEnd(request, callback)
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to check for special victory"})
			}
		}

	/* updateMembers */
		module.exports.updateMembers = updateMembers
		function updateMembers(request, callback) {
			try {
				for (var m in request.game.data.members) {
					var member = request.game.data.members[m]

					// campaigns
						if (member.state.campaign > 0) {
							member.state.campaign -= 1000
						}
						else {
							member.state.campaign = false
						}

					// donations vs. protest
						for (var c in member.constituents) {
							if (member.constituents[c].approval >= 75 && !request.game.data.rules.includes("donation-ban")) { // rule: donation-ban
								member.funds = Math.min(0, member.funds + Math.floor(member.constituents[c].population / 100))
							}
							else if (member.constituents[c].approval <= 25 && !request.game.data.issues.find(function(i) { return i.type == "protest" })) {
								request.game.data.issues.push(getAttributes(main.getSchema("issue"), main.chooseRandom(issues.protest), callback))
							}
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update members campaigns, donations, and protests"})
			}
		}

	/* updateFuture */
		module.exports.updateFuture = updateFuture
		function updateFuture(request, callback) {
			try {
				for (var f in request.game.future) {
					// delay
						request.game.future[f].delay -= 1000

					// add to issues
						if (request.game.future[f].delay <= 0) {
							var issue = issues[request.game.future[f].type].find(function (i) { return i.name == request.game.future[f].name })
								issue = getAttributes(main.getSchema("issue"), issue, callback)
							request.game.data.issues.push(issue)

							request.game.future.splice(f, 1)
							f--
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update future issues"})
			}
		}

	/* updateIssues */
		module.exports.updateIssues = updateIssues
		function updateIssues(request, callback) {
			try {
				// existing issues
					for (var i in request.game.data.issues) {
						request.game.data.issues[i].timeout -= 1000

						if (request.game.data.issues[i].timeout <= 0 && !request.game.data.state.cooldown) {
							if (request.game.data.state.issue == request.game.data.issues[i].id) {
								enactTally(request, callback)
							}
							else if (!request.game.data.state.issue) {
								enactConsequences(request, callback, request.game.data.issues[i])
							}
						}
					}

				// random new issue
					if (request.game.past.length > 1) { // not until 1st leader and 1st real issue are resolved
						var addIssue = false
						var type = main.chooseRandom(["small", "small", "small", "medium", "medium", "large"])
						if ((request.game.data.state.time % 300000 == 0) 										// 5 minutes  = 100%
						 || (request.game.data.state.time % 120000 == 0 && !Math.floor(Math.random() * 2))		// 2 minutes  = 50%
						 || (request.game.data.state.time %  60000 == 0 && !Math.floor(Math.random() * 3))		// 1 minute   = 33%
						 || (request.game.data.state.time %  30000 == 0 && !Math.floor(Math.random() * 5))		// 30 seconds = 20%
						 || (request.game.data.state.time %  15000 == 0 && !Math.floor(Math.random() * 8))) {	// 15 seconds = 12.5%
						 	var tryAgain = 10
							do {
								tryAgain--
								var issue = main.chooseRandom(issues[type])
							}
							while (issue && tryAgain && 
								(  request.game.past.find(       function (p) { return p.name == issue.name })
								|| request.game.data.issues.find(function (i) { return i.name == issue.name })
								|| request.game.future.find(     function (f) { return f.name == issue.name })))

							if (issue) {
								request.game.data.issues.push(getAttributes(main.getSchema("issue"), issue, callback))
							}
						}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update random new issues"})
			}
		}
