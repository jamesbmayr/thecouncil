/*** modules ***/
	var MAIN       = require("../main/logic")
	module.exports = {}

/*** maps ***/
	var REALMS     = MAIN.getAsset("realms")
	var RACES      = MAIN.getAsset("races")
	var IDEOLOGIES = MAIN.getAsset("ideologies")
	var ISSUES     = MAIN.getAsset("issues")
	var RULES      = MAIN.getAsset("rules")
	var MESSAGES   = MAIN.getAsset("messages")
	var CONFIGS    = MAIN.getAsset("configs")

/*** players ***/
	/* addPlayer */
		module.exports.addPlayer = addPlayer
		function addPlayer(REQUEST, callback) {
			try {
				if (!REQUEST.game) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["no-game"]})
				}
				else {
					// add player
						if (REQUEST.game.players[REQUEST.session.id]) {
							REQUEST.game.players[REQUEST.session.id].connected  = true
							REQUEST.game.players[REQUEST.session.id].connection = REQUEST.connection
							callback(Object.keys(REQUEST.game.observers), {success: true, names: [REQUEST.game.players[REQUEST.session.id].name]})
						}

					// add observer
						else {
							REQUEST.game.observers[REQUEST.session.id] = MAIN.getSchema("player")
							REQUEST.game.observers[REQUEST.session.id].id = REQUEST.session.id
							REQUEST.game.observers[REQUEST.session.id].connected  = true
							REQUEST.game.observers[REQUEST.session.id].connection = REQUEST.connection
						}

					// message
						if (!REQUEST.game.data.state.start) {
							callback([REQUEST.session.id], {success: true,
								id:           REQUEST.game.id,
								names:        Object.keys(REQUEST.game.players).length ? Object.keys(REQUEST.game.players).map(function(id) { return REQUEST.game.players[id].name }) : []
							})
						}
						else if (REQUEST.game.data.state.end) {
							callback([REQUEST.session.id], {success: true, location: CONFIGS.redirect})
						}
						else {
							callback([REQUEST.session.id], {success: true,
								start:        REQUEST.game.data.state.start,
								showTally:   (REQUEST.game.data.members[REQUEST.session.id] && REQUEST.game.data.members[REQUEST.session.id].state.leader) ? true : false,
								showRecall:   REQUEST.game.past.length >= CONFIGS.issueCountRecall ? true : false,
								showCampaign: REQUEST.game.past.length >= CONFIGS.issueCountCampaign ? true : false,
								id:           REQUEST.game.id,
								data:         REQUEST.game.data
							})
						}
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to add player"})
			}
		}

	/* removePlayer */
		module.exports.removePlayer = removePlayer
		function removePlayer(REQUEST, callback) {
			try {
				MAIN.logStatus("[CLOSED]: " + REQUEST.path.join("/") + " @ " + (REQUEST.ip || "?"))
				if (REQUEST.game) {
					// remove player or observer
						if (REQUEST.game.data.state.end || !REQUEST.game.data.state.start) {
							if (REQUEST.game.players[REQUEST.session.id]) {
								var name = REQUEST.game.players[REQUEST.session.id].name
								delete REQUEST.game.players[REQUEST.session.id]
							}
							else if (REQUEST.game.observers[REQUEST.session.id]) {
								delete REQUEST.game.observers[REQUEST.session.id]
							}
							callback([REQUEST.session.id], {success: true, location: CONFIGS.redirect})
							callback(Object.keys(REQUEST.game.observers), {success: true, names: [false, name]})
						}

					// disable connection
						else {
							if (REQUEST.game.players[REQUEST.session.id]) {
								REQUEST.game.players[REQUEST.session.id].connected = false
							}
							else if (REQUEST.game.observers[REQUEST.session.id]) {
								REQUEST.game.observers[REQUEST.session.id].connected = false
							}
							callback([REQUEST.session.id], {success: true, location: CONFIGS.redirect})
						}

					// delete game ?
						var remaining = Object.keys(REQUEST.game.players).filter(function(p) {
							return REQUEST.game.players[p].connected
						}) || []

						if (!remaining.length) {
							callback(Object.keys(REQUEST.game.observers), {success: true, delete: true, location: CONFIGS.redirect})
						}
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to remove player"})
			}
		}

/*** submits ***/
	/* submitStart */
		module.exports.submitStart = submitStart
		function submitStart(REQUEST, callback) {
			try {
				if (REQUEST.game.data.state.start) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-started"]})
				}
				else if (REQUEST.game.data.state.end) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-ended"]})
				}
				else if (Object.keys(REQUEST.game.players).length < CONFIGS.playerCountMinimum || Object.keys(REQUEST.game.players).length > CONFIGS.playerCountMaximum) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["player-count"]})
				}
				else {
					enactStart(REQUEST, callback)
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to start game"})
			}
		}

	/* submitRecall */
		module.exports.submitRecall = submitRecall
		function submitRecall(REQUEST, callback) {
			try {
				if (!REQUEST.game.data.state.start) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-started"]})
				}
				else if (REQUEST.game.data.state.end) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-ended"]})
				}
				else if (!REQUEST.game.players[REQUEST.session.id]) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-playing"]})
				}
				else if (REQUEST.game.data.state.cooldown) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["ongoing-event"]})
				}
				else if (!REQUEST.game.data.state.leader) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["recall-no-leader"]})
				}
				else if (REQUEST.game.data.state.leader == REQUEST.session.id) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["recall-self"]})
				}
				else if (REQUEST.game.data.state.term < CONFIGS.recallTimeMinimum) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["recall-too-soon"]})
				}
				else if (REQUEST.game.data.rules.includes("term-length") && REQUEST.game.data.state.term < RULES["term-length"].term) { // rule: term-length
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["term-length"].description}) // rule: formal-language
				}
				else {
					callback(Object.keys(REQUEST.game.observers), {success: true, recall: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].recall : "") + REQUEST.game.data.members[REQUEST.session.id].name + MESSAGES["recall-called"]}) // rule: formal-language
					enactRecall(REQUEST, callback)
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to call for recall"})
			}
		}

	/* submitIssue */
		module.exports.submitIssue = submitIssue
		function submitIssue(REQUEST, callback) {
			try {
				if (!REQUEST.game.data.state.start) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-started"]})
				}
				else if (REQUEST.game.data.state.end) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-ended"]})	
				}
				else if (!REQUEST.game.players[REQUEST.session.id]) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-playing"]})
				}
				else if (REQUEST.game.data.state.cooldown) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["ongoing-event"]})
				}
				else if (!REQUEST.game.data.state.leader || REQUEST.game.data.state.leader !== REQUEST.session.id) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-leader"]})
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].state.campaign && !REQUEST.game.data.rules.includes("absentee-voting")) { // rule: absentee-voting
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["absentee-voting"].description}) // rule: formal-language
				}
				else if (!REQUEST.game.data.state.issue && !REQUEST.post.selection) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["issue-none-selected"]})
				}
				else if ( REQUEST.game.data.state.issue ==  REQUEST.post.selection) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["issue-already-selected"]})
				}
				else if (REQUEST.post.selection && !REQUEST.game.data.issues.find(function(i) { return i.id == REQUEST.post.selection })) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["issue-none"]})
				}
				else if (!REQUEST.post.selection && REQUEST.game.data.rules.includes("no-tabling")) { // rule: no-tabling
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["no-tabling"].description}) // rule: formal-language
				}
				else {
					selectIssue(REQUEST, callback)
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to select issue"})
			}
		}

	/* submitOption */
		module.exports.submitOption = submitOption
		function submitOption(REQUEST, callback) {
			try {
				if (!REQUEST.game.data.state.start) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-started"]})
				}
				else if (REQUEST.game.data.state.end) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-ended"]})
				}
				else if (!REQUEST.game.players[REQUEST.session.id]) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-playing"]})
				}
				else if (REQUEST.game.data.state.cooldown) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["ongoing-event"]})
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].state.leader && REQUEST.game.data.rules.includes("impartial-leader")) { // rule: impartial-leader
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["impartial-leader"].description}) // rule: formal-language
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].state.campaign && !REQUEST.game.data.rules.includes("absentee-voting")) { // rule: absentee-voting
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["absentee-voting"].description}) // rule: formal-language
				}
				else if (!REQUEST.game.data.state.issue) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["issue-none-selected"]})
				}
				else if (!REQUEST.game.data.issues.find(function(i) { return i.id == REQUEST.game.data.state.issue })) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["issue-none"]})
				}
				else if (!REQUEST.game.data.members[REQUEST.session.id].state.selection && !REQUEST.post.selection) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["option-none-selected"]})
				}
				else if ( REQUEST.game.data.members[REQUEST.session.id].state.selection ==  REQUEST.post.selection) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["option-already-selected"]})
				}
				else if (REQUEST.post.selection && !REQUEST.game.data.issues.find(function(i) { return i.id == REQUEST.game.data.state.issue }).options.find(function(o) { return o.id == REQUEST.post.selection })) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["option-none"]})
				}
				else if (REQUEST.game.data.issues.find(function(i) { return i.id == REQUEST.game.data.state.issue }).type == "leader" && REQUEST.game.data.rules.includes("no-self") && REQUEST.post.selection == REQUEST.session.id) { // rule: no-self
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["no-self"].description}) // rule: formal-language
				}
				else {
					selectOption(REQUEST, callback)
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to cast vote"})
			}
		}

	/* submitTally */
		module.exports.submitTally = submitTally
		function submitTally(REQUEST, callback) {
			try {
				if (!REQUEST.game.data.state.start) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-started"]})
				}
				else if (REQUEST.game.data.state.end) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-ended"]})
				}
				else if (!REQUEST.game.players[REQUEST.session.id]) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-playing"]})
				}
				else if (REQUEST.game.data.state.cooldown) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["ongoing-event"]})
				}
				else if (!REQUEST.game.data.state.issue) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["issue-none-selected"]})
				}
				else if (REQUEST.game.data.rules.includes("no-abstentions") && Object.keys(REQUEST.game.data.members).filter(function(m) { return (!REQUEST.game.data.members[m].state.selection && !REQUEST.game.data.members[m].state.campaign && !(REQUEST.game.data.members[m].state.leader && REQUEST.game.data.rules.includes("impartial-leader"))) }).length) { // no-abstentions
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["no-abstentions"].description}) // rule: formal-language
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].state.campaign && !REQUEST.game.data.rules.includes("absentee-voting")) { // rule: absentee-voting
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["absentee-voting"].description}) // rule: formal-language
				}
				else {
					enactTally(REQUEST, callback)
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to tally votes"})
			}
		}

	/* submitCampaign */
		module.exports.submitCampaign = submitCampaign
		function submitCampaign(REQUEST, callback) {
			try {
				if (!REQUEST.game.data.state.start) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-started"]})
				}
				else if (REQUEST.game.data.state.end) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["already-ended"]})
				}
				else if (!REQUEST.game.players[REQUEST.session.id]) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["not-playing"]})
				}
				else if (REQUEST.game.data.state.cooldown) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["ongoing-event"]})
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].state.campaign) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["campaign-already"]})
				}
				else if (REQUEST.game.data.rules.includes("short-season") && REQUEST.game.data.state.election - REQUEST.game.data.state.time > RULES["short-season"].time) { // rule: short-season
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["short-season"].description}) // rule: formal-language
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].state.leader && REQUEST.game.data.rules.includes("leader-presence")) { // rule: leader-presence
					callback([REQUEST.session.id], {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["leader-presence"].description}) // rule: formal-language
				}
				else if (REQUEST.game.past.length <= CONFIGS.issueCountCampaign) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["campaign-too-soon"]})
				}
				else if (REQUEST.game.data.members[REQUEST.session.id].funds < CONFIGS.campaignCost) {
					callback([REQUEST.session.id], {success: false, message: MESSAGES["campaign-insufficient-funds"]})
				}
				else {
					enactCampaign(REQUEST, callback)
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to conduct campaigning"})
			}
		}

/*** selects ***/
	/* selectIssue */
		module.exports.selectIssue = selectIssue
		function selectIssue(REQUEST, callback) {
			try {
				// issue
					REQUEST.game.data.state.issue = REQUEST.post.selection || null

				// reset selections
					for (var m in REQUEST.game.data.members) {
						REQUEST.game.data.members[m].state.selection = null
					}

				// rule: quick-voting
					if (REQUEST.game.data.rules.includes("quick-voting")) {
						var issue = REQUEST.game.data.issues.find(function(i) { return i.id == REQUEST.post.selection })
							issue.timeout = Math.min(RULES["quick-voting"].timeout, issue.timeout)
						callback(Object.keys(REQUEST.game.observers), {success: false, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["quick-voting"].description}) // rule: formal-language
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to select issue"})
			}
		}

	/* selectOption */
		module.exports.selectOption = selectOption
		function selectOption(REQUEST, callback) {
			try {
				// selection
					REQUEST.game.data.members[REQUEST.session.id].state.selection = REQUEST.post.selection || null

				// all selected?
					if (REQUEST.game.data.issues.length && REQUEST.game.data.state.issue) {
						var issue = REQUEST.game.data.issues.find(function(i) {
							return i.id == REQUEST.game.data.state.issue
						})

						if (issue && issue.type == "leader") {
							var allSelected = true
							for (var m in REQUEST.game.data.members) {
								if (!REQUEST.game.data.members[m].state.campaign && !REQUEST.game.data.members[m].state.selection) {
									allSelected = false
								}
							}

							if (allSelected) {
								enactTally(REQUEST, callback)
							}
						}
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to select option"})
			}
		}

/*** enacts ***/
	/* enactStart */
		module.exports.enactStart = enactStart
		function enactStart(REQUEST, callback) {
			try {
				// agencies
					var agencyRange = CONFIGS.agencyStartingMaximum + CONFIGS.agencyStep - CONFIGS.agencyStartingMinimum
					for (var a in REQUEST.game.data.agencies) {
						REQUEST.game.data.agencies[a] = CONFIGS.agencyStartingMinimum + Math.floor(Math.random() * agencyRange / CONFIGS.agencyStep) * CONFIGS.agencyStep
					}

				// ideologies
					var ideologySet = []
					var pools = {
						a: MAIN.sortRandom(CONFIGS.playerIdeologies.poolA),
						b: MAIN.sortRandom(CONFIGS.playerIdeologies.poolB),
						c: MAIN.sortRandom(CONFIGS.playerIdeologies.poolC),
						d: MAIN.sortRandom(CONFIGS.playerIdeologies.poolD),
						e: MAIN.sortRandom(CONFIGS.playerIdeologies.poolE)
					}

					var playerCount = Object.keys(REQUEST.game.players).length
					while (ideologySet.length < playerCount) {
						var pool = pools[CONFIGS.playerIdeologies.counts[String(ideologySet.length)]]
						ideologySet.push(pool.pop())
					}

				// members
					var count = 0
					var populationRange = CONFIGS.populationStartingMaximum + CONFIGS.populationStep - CONFIGS.populationStartingMinimum
					var approvalRange = CONFIGS.approvalStartingMaximum + CONFIGS.approvalStep - CONFIGS.approvalStartingMinimum
					
					for (var p in REQUEST.game.players) {
						count++
						var player = REQUEST.game.players[p]

						// info
							var member          = MAIN.getSchema("member")
								member.id       = player.id
								member.name     = player.name
								member.district = count
								member.race     = MAIN.chooseRandom(RACES)
								member.ideology = IDEOLOGIES[ideologySet[0]]
								member.funds    = CONFIGS.startingFunds
								ideologySet.shift()
							REQUEST.game.data.members[member.id] = member

						// populations & approval ratings
							for (var c in member.constituents) {
								member.constituents[c].population = CONFIGS.populationStartingMinimum + Math.floor(Math.random() * populationRange / CONFIGS.populationStep) * CONFIGS.populationStep
								member.constituents[c].approval   = CONFIGS.approvalStartingMinimum + Math.floor(Math.random() * approvalRange / CONFIGS.approvalStep) * CONFIGS.approvalStep

								if (c == member.race.short) {
									member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + CONFIGS.approvalRaceBonus))
								}
							}
					}

				// approval ratings
					updateRatings(REQUEST, callback)

				// start
					REQUEST.game.data.state.name  = [MAIN.chooseRandom(REALMS), MAIN.chooseRandom(REALMS)]
					REQUEST.game.data.treasury = MAIN.chooseRandom(CONFIGS.startingTreasuryAmounts)
					REQUEST.game.data.state.start = new Date().getTime()
					REQUEST.game.data.state.election = CONFIGS.electionTime
					REQUEST.game.data.state.cooldown = CONFIGS.launchSequenceTime
					callback(Object.keys(REQUEST.game.players).concat(Object.keys(REQUEST.game.observers)), {success: true, start: true, message: MESSAGES["starting"], data: REQUEST.game.data})
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to start game"})
			}
		}
		
	/* enactRecall */
		module.exports.enactRecall = enactRecall
		function enactRecall(REQUEST, callback) {
			try {
				// create issue
					var issue = getAttributes(MAIN.getSchema("issue"), ISSUES.leader[0], callback)

				// members
					for (var m in REQUEST.game.data.members) {
						REQUEST.game.data.members[m].state.selection = null

						var option = MAIN.getSchema("option")
							option.id   = m
							option.name = REQUEST.game.data.members[m].name

						if (REQUEST.game.data.members[m].state.leader) {
							REQUEST.game.data.members[m].state.leader = false

							// rule: term-limits & rule: no consecutives
								if (!REQUEST.game.data.rules.includes("term-limits") && !REQUEST.game.data.rules.includes("no-consecutives")) {
									option.default = true
									issue.options.push(option)
								}
						}
						else {
							option.constituents[REQUEST.game.data.members[m].race.short].approval = CONFIGS.leaderVoteRaceBonus
							issue.options.push(option)
						}
					}

				// enact
					REQUEST.game.data.issues.push(issue)
					REQUEST.game.data.state.issue  = issue.id
					REQUEST.game.data.state.leader = null

					if (!issue.options.find(function(o) { return o.default })) {
						MAIN.chooseRandom(issue.options).default = true
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to enact recall"})
			}
		}

	/* enactTally */
		module.exports.enactTally = enactTally
		function enactTally(REQUEST, callback) {
			try {
				// assign votes to options
					var issue = REQUEST.game.data.issues.find(function(i) {
						return i.id == REQUEST.game.data.state.issue
					})
					
					for (var m in REQUEST.game.data.members) {
						var option = issue.options.find(function(o) {
							return o.id == REQUEST.game.data.members[m].state.selection
						})

						if (option) {
							option.state.votes.push(m)
						}
						REQUEST.game.data.members[m].state.selection = null
					}

				// determine winning option(s)
					var totalVotes = 0
					var winningOptions = {
						ids:   [],
						votes: 0
					}

					for (var o in issue.options) {
						totalVotes += issue.options[o].state.votes.length
						if (issue.options[o].state.votes.length > winningOptions.votes) {
							winningOptions.votes = issue.options[o].state.votes.length
							winningOptions.ids   = [issue.options[o].id]
						}
						else if (issue.options[o].state.votes.length == winningOptions.votes) {
							winningOptions.ids.push(issue.options[o].id)
						}
					}

				// special event types
					// recall
						if (issue.type == "leader" && totalVotes < Object.keys(REQUEST.game.data.members).length) {
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + MESSAGES["recall-requires-all"]}) // rule: formal-language
							return
						}

					// rebellion: insufficient funds
						else if (issue.type == "rebellion" && winningOptions.ids.length && (REQUEST.game.data.treasury + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-treasury"] : "") + MESSAGES["consequence-rebellion-insufficient-treasury"]}) // rule: formal-language
						}

					// rebellion: insufficient military
						else if (issue.type == "rebellion" && winningOptions.ids.length && (REQUEST.game.data.agencies.m + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.m) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-military"] : "") + MESSAGES["consequence-rebellion-insufficient-military"]}) // rule: formal-language
						}

					// protest: insufficient funds
						if (issue.type == "protest" && winningOptions.ids.length && (REQUEST.game.data.treasury + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-treasury"] : "") + MESSAGES["consequence-protest-insufficient-treasury"]}) // rule: formal-language
						}

					// protest: insufficient military
						else if (issue.type == "protest" && winningOptions.ids.length && (REQUEST.game.data.agencies.m + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.m) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-military"] : "") + MESSAGES["consequence-protest-insufficient-military"]}) // rule: formal-language
						}

					// austerity: insufficient s
						else if (issue.type == "austerity" && winningOptions.ids.length && (REQUEST.game.data.agencies.s + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.s) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-cutbacks"] : "") + MESSAGES["consequence-cutbacks-insufficient-s"]}) // rule: formal-language
						}

					// austerity: insufficient r
						else if (issue.type == "austerity" && winningOptions.ids.length && (REQUEST.game.data.agencies.r + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.r) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-cutbacks"] : "") + MESSAGES["consequence-cutbacks-insufficient-r"]}) // rule: formal-language
						}

					// austerity: insufficient t
						else if (issue.type == "austerity" && winningOptions.ids.length && (REQUEST.game.data.agencies.t + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.t) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-cutbacks"] : "") + MESSAGES["consequence-cutbacks-insufficient-t"]}) // rule: formal-language
						}

					// austerity: insufficient m
						else if (issue.type == "austerity" && winningOptions.ids.length && (REQUEST.game.data.agencies.m + (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).agencies.m) < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"]["insufficient-cutbacks"] : "") + MESSAGES["consequence-cutbacks-insufficient-m"]}) // rule: formal-language
						}

				// special rules
					// rule: balanced-budget
						else if (REQUEST.game.data.rules.includes("balanced-budget") && winningOptions.ids.length && (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury < 0) && (issue.options.find(function(o) { return o.id == winningOptions.ids[0] }).treasury + REQUEST.game.data.treasury < 0)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["balanced-budget"].description}) // rule: formal-language
						}

					// rule: executive-decision
						else if (REQUEST.game.data.rules.includes("executive-decision") && issue.timeout <= RULES["executive-decision"].timeout && issue.options.find(function(o) { return o.state.votes.includes(REQUEST.game.data.state.leader) })) {
							issue.options.find(function(o) {
								return o.state.votes.includes(REQUEST.game.data.state.leader)
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["executive-decision"].description}) // rule: formal-language
						}

					// rule: tiebreaker-leader
						else if (winningOptions.ids.length > 1 && REQUEST.game.data.rules.includes("tiebreaker-leader") && REQUEST.game.data.state.leader && issue.options.find(function(o) { return winningOptions.ids.includes(o.id) && o.state.votes.includes(REQUEST.game.data.state.leader) })) {
							issue.options.find(function(o) {
								return winningOptions.ids.includes(o.id) && o.state.votes.includes(REQUEST.game.data.state.leader)
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["tiebreaker-leader"].description}) // rule: formal-language
						}

					// rule: majority-threshold
						else if (REQUEST.game.data.rules.includes("majority-threshold") && winningOptions.ids.length && (winningOption.ids.length <= totalVotes / 2)) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["majority-threshold"].description}) // rule: formal-language
						}

				// otherwise
					// tie --> default
						else if (winningOptions.ids.length !== 1) {
							issue.options.find(function(o) {
								return o.default
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].tie : "") + MESSAGES["tie"]}) // rule: formal-language
						}

					// outright winner
						else {
							issue.options.find(function(o) {
								return o.id == winningOptions.ids[0]
							}).state.selected = true
							callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].plurality : "") + MESSAGES["plurality"]}) // rule: formal-language
						}

				// reset & enact consequences
					enactConsequences(REQUEST, callback, issue)

			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to tally votes"})
			}
		}

	/* enactConsequences */
		module.exports.enactConsequences = enactConsequences
		function enactConsequences(REQUEST, callback, issue) {
			try {
				// data
					var winningOption = issue.options.find(function(o) {
						return o.state.selected
					}) || issue.options.find(function(o) {
						return o.default
					})

					winningOption.state.selected = true

				// special numbers
					var messageData = MESSAGES["issue-sequence"][String(REQUEST.game.past.length)]
					if (messageData) {
						var observers = Object.keys(REQUEST.game.observers)
						var players = Object.keys(REQUEST.game.players)

						for (var time in messageData) {
							if (messageData[time].observers) {
								enactMessage(observers, messageData[time].observers, Number(time), callback)
							}
							if (messageData[time].players) {
								enactMessage(players, messageData[time].players, Number(time), callback)
							}
						}
					}
				
				// first issue (leader) --> get more issues
					if (REQUEST.game.past.length == 0) {
						winningOption.issues = {
							"0-1": {name: MAIN.chooseRandom(ISSUES.small.filter(function(i)  { return i.type == "small"})).name,  type: "small" , delay: CONFIGS.firstIssueDelay},
							"0-2": {name: MAIN.chooseRandom(ISSUES.medium.filter(function(i) { return i.type == "medium"})).name, type: "medium", delay: CONFIGS.firstIssueDelay + CONFIGS.loopTime},
							"0-3": {name: MAIN.chooseRandom(ISSUES.large.filter(function(i)  { return i.type == "large"})).name,  type: "large" , delay: CONFIGS.firstIssueDelay + CONFIGS.loopTime + CONFIGS.loopTime}
						}
					}

				// consequences
					// treasury
						REQUEST.game.data.treasury = REQUEST.game.data.treasury + winningOption.treasury

					// agencies
						for (var a in REQUEST.game.data.agencies) {
							REQUEST.game.data.agencies[a] = Math.max(0, Math.min(100, REQUEST.game.data.agencies[a] + winningOption.agencies[a]))
						}

					// member approval ratings & funds
						var approvalMultiplier = REQUEST.game.data.rules.includes("restricted-press") ? RULES["restricted-press"].approvalMultiplier : 1 // rule: restricted-press
						var donationMultiplier = REQUEST.game.data.rules.includes("kickback-ban") ? RULES["kickback-ban"].donationMultiplier : REQUEST.game.data.rules.includes("dark-money") ? RULES["dark-money"].donationMultiplier : 1 // rule: kickback-ban & rule: dark-money

						for (var o in issue.options) {
							for (var v in issue.options[o].state.votes) {
								var member = REQUEST.game.data.members[issue.options[o].state.votes[v]]
								
								if (issue.options[o].state.selected) {
									member.funds                          = Math.max(0, member.funds + winningOption.funds * donationMultiplier)
									for (var c in member.constituents) {
										member.constituents[c].approval   = Math.max(0, Math.min(100, member.constituents[c].approval + winningOption.constituents[c].approval * approvalMultiplier))
										member.constituents[c].population = Math.max(0, member.constituents[c].population + winningOption.constituents[c].population)
									}
								}
								else {
									member.funds                            = Math.max(0, member.funds + Math.floor(issue.options[o].funds * CONFIGS.failedVoteFundsMultiplier * donationMultiplier))
									for (var c in member.constituents) {
										if (REQUEST.game.data.rules.includes("secret-voting")) { // rule: secret-voting
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
						updateRatings(REQUEST, callback)

					// future issues
						var randomChance = Math.random()
						for (var i in winningOption.issues) {
							if (Number(i.split("-")[0]) <= randomChance && randomChance < Number(i.split("-")[1])) {
								REQUEST.game.future.push(winningOption.issues[i])
							}
						}

				// special types
					// rules
						for (var r in winningOption.rules) {
							var rule = winningOption.rules[r]

							if (rule.enact) {
								if (!REQUEST.game.data.rules.includes(rule.name)) {
									REQUEST.game.data.rules.push(rule.name)
								}
							}
							else if (REQUEST.game.data.rules.includes(rule.name)) {
								REQUEST.game.data.rules.splice(REQUEST.game.data.rules.indexOf(rule.name), 1)
							}

							// change election time
								if ((rule.name == "immediate-end" && rule.enact)) { // rule: immediate-end
									REQUEST.game.data.state.election = REQUEST.game.data.state.time + RULES["immediate-end"].time
								}
								else if ((rule.name == "snap-elections" && rule.enact) || (rule.name == "delayed-elections" && !rule.enact)) { // rule: snap-elections // rule: delayed-elections
									REQUEST.game.data.state.election += RULES["snap-elections"].time
								}
								else if ((rule.name == "snap-elections" && !rule.enact) || (rule.name == "delayed-elections" && rule.enact)) { // rule: snap-elections // rule: delayed-elections
									REQUEST.game.data.state.election += RULES["delayed-elections"].time
								}
						}

					// leader
						if (issue.type == "leader") {
							REQUEST.game.data.state.leader = winningOption.id
							REQUEST.game.data.members[winningOption.id].state.leader = true

							// new term
								if (!winningOption.default) {
									REQUEST.game.data.state.term = 0
								}

							// update "tally" button
								var ids = Object.keys(REQUEST.game.data.members)
								for (var i in ids) {
									if (REQUEST.game.data.state.leader == ids[i]) {
										callback([ids[i]], {success: true, showTally: true})
									}
									else {
										callback([ids[i]], {success: true, showTally: false})
									}
								}
						}

					// rebellion
						else if (issue.type == "rebellion" && winningOption.default) {
							REQUEST.game.data.state.exists = false
							updateOverthrow(REQUEST, callback)
						}

				// reset
					REQUEST.game.data.state.cooldown = CONFIGS.betweenIssueCooldown
					if (issue.id == REQUEST.game.data.state.issue) {
						REQUEST.game.data.state.issue = null
					}

				// communicate
					enactMessage(
						Object.keys(REQUEST.game.observers),
						{
							success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].issue : "") +  // rule: formal-language
							issue.name + MESSAGES["issue-between"] + 
							(REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].decision : "") + // rule: formal-language
							winningOption.name
						},
						CONFIGS.messageDelay,
						callback
					)

				// move issue to the past
					REQUEST.game.data.last = MAIN.duplicateObject(issue)
					REQUEST.game.past.push(issue)
					for (var i in REQUEST.game.data.issues) {
						if (REQUEST.game.data.issues[i].id == issue.id) {
							REQUEST.game.data.issues.splice(i, 1)
							break
						}
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to enact consequences"})
			}
		}

	/* enactMessage */
		module.exports.enactMessage = enactMessage
		function enactMessage(recipients, data, timeout, callback) {
			try {
				// timeout
					setTimeout(function() {
						callback(recipients, data)
					}, timeout)
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to enact message"})
			}
		}

	/* enactCampaign */
		module.exports.enactCampaign = enactCampaign
		function enactCampaign(REQUEST, callback) {
			try {
				// timeout & funds
					var member = REQUEST.game.data.members[REQUEST.session.id]
						member.state.campaign = CONFIGS.campaignTime
						member.funds -= CONFIGS.campaignCost

				// member approvals
					for (var c in member.constituents) {
						member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + MAIN.chooseRandom(CONFIGS.campaignApprovalBumps)))
					}

				// overall approval ratings
					updateRatings(REQUEST, callback)

				// message
					callback([REQUEST.session.id], {success: true, message: MESSAGES["campaigning"]})
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to go campaigning"})
			}
		}

	/* enactElection */
		module.exports.enactElection = enactElection
		function enactElection(REQUEST, callback) {
			try {
				// special victory
					updateOverthrow(REQUEST, callback)

				// normal victory
					if (REQUEST.game.data.state.exists) {
						for (var m in REQUEST.game.data.members) {
							var member = REQUEST.game.data.members[m]
							if (getApproval(member, callback) >= CONFIGS.midPoint) {
								member.state.reelected = true
							}
							if (getIdeology(REQUEST, member, callback)) {
								member.state.achieved = true
							}
							if (member.state.reelected && member.state.achieved) {
								member.state.victory = true
							}
						}

						enactEnd(REQUEST, callback)
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to conduct the election"})
			}
		}

	/* enactEnd */
		module.exports.enactEnd = enactEnd
		function enactEnd(REQUEST, callback) {
			try {
				REQUEST.game.data.state.end      = new Date().getTime()
				REQUEST.game.data.state.election = REQUEST.game.data.state.time
				REQUEST.game.data.state.leader   = null
				REQUEST.game.data.state.term     = 0
				REQUEST.game.data.state.issue    = null
				REQUEST.game.data.state.cooldown = CONFIGS.electionSequenceTime

				callback(Object.keys(REQUEST.game.players).concat(Object.keys(REQUEST.game.observers)), {success: true, end: true, data: REQUEST.game.data})
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to end the game"})
			}
		}

/*** helpers ***/
	/* getIdeology */
		module.exports.getIdeology = getIdeology
		function getIdeology(REQUEST, member, callback) {
			try {
				// assume true
					var achieved = true

				// cycle through agencies
					for (var a in REQUEST.game.data.agencies) {
						if (REQUEST.game.data.agencies[a] < member.ideology[a][0] || REQUEST.game.data.agencies[a] > member.ideology[a][1]) {
							achieved = false
						}						
					}

				// return data
					return achieved || false
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to calculate approval rating"})
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
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to calculate approval rating"})
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
								issue.options.push(MAIN.getSchema("option"))
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
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to apply issue attributes"})
			}
		}

/*** updates ***/
	/* updateTime */
		module.exports.updateTime = updateTime
		function updateTime(REQUEST, callback) {
			try {
				if (REQUEST.game.data.state.start) {
					// updates
						REQUEST.game.data.state.time += CONFIGS.loopTime
						REQUEST.game.data.state.cooldown = Math.max(0, REQUEST.game.data.state.cooldown - CONFIGS.loopTime)
						REQUEST.game.data.state.term += CONFIGS.loopTime

					// messages
						updateMessages(REQUEST, callback)

					// events
						if (REQUEST.game.data.state.time == CONFIGS.launchSequenceTime) {
							enactRecall(REQUEST, callback)
						}
						else if (REQUEST.game.data.state.time == REQUEST.game.data.state.election) {
							enactElection(REQUEST, callback)
						}
						else if (!REQUEST.game.data.state.end && REQUEST.game.data.state.time > CONFIGS.launchSequenceTime) {
							// future issues
								updateRebellions(REQUEST, callback)
								updateFuture(REQUEST, callback)

							// random issues
								updateIssues(REQUEST, callback)

							// campaigns & donations (& riots)
								updateMembers(REQUEST, callback)
								if (REQUEST.game.data.state.exists && !REQUEST.game.data.state.cooldown) {
									updateOverthrow(REQUEST, callback)
								}

							// rule: term-limits
								if (REQUEST.game.data.state.exists && REQUEST.game.data.rules.includes("term-limits") && !REQUEST.game.data.state.cooldown && REQUEST.game.data.state.term >= RULES["term-limits"].term) { // rule: term-limits
									enactRecall(REQUEST, callback)
									callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].rules : "") + RULES["term-limits"].description}) // rule: formal-language
								}

							// send data
								callback(Object.keys(REQUEST.game.players).concat(Object.keys(REQUEST.game.observers)), {success: true, data: REQUEST.game.data})
						}
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to process time interval"})
			}
		}

	/* updateMessages */
		module.exports.updateMessages = updateMessages
		function updateMessages(REQUEST, callback) {
			try {
				// time
					var time = REQUEST.game.data.state.time
					var election = REQUEST.game.data.state.election
					var observers = Object.keys(REQUEST.game.observers)
					var players = Object.keys(REQUEST.game.players)
				
				// start
					if (time <= CONFIGS.launchSequenceTime) {
						var messageData = MESSAGES["launch-sequence"][String(time)]
						if (messageData && messageData.observers) {
							callback(observers, messageData.observers)
						}
						if (messageData && messageData.players) {
							callback(players, messageData.players)
						}
					}

				// end
					if (time >= election && REQUEST.game.data.state.exists) {
						var messageData = MESSAGES["election-sequence"][STRING(time - election)]
						if (messageData && messageData.observers) {
							callback(observers, messageData.observers)
						}
						if (messageData && messageData.member) {
							for (var m in REQUEST.game.data.members) {
								if (REQUEST.game.data.members[m].state[messageData.member.factor]) {
									callback([m], messageData.member.positive)
								}
								else {
									callback([m], messageData.member.negative)
								}
							}
						}
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to send out messages"})
			}
		}

	/* updateRatings */
		module.exports.updateRatings = updateRatings
		function updateRatings(REQUEST, callback) {
			try {
				// reset
					for (var c in REQUEST.game.data.constituents) {
						REQUEST.game.data.constituents[c].population = 0
						REQUEST.game.data.constituents[c].approval   = 0
					}

				// sum members
					for (var m in REQUEST.game.data.members) {
						var member = REQUEST.game.data.members[m]

						for (var c in REQUEST.game.data.constituents) {
							REQUEST.game.data.constituents[c].population = Math.max(0, REQUEST.game.data.constituents[c].population + member.constituents[c].population)
							REQUEST.game.data.constituents[c].approval   = REQUEST.game.data.constituents[c].approval + (member.constituents[c].population * member.constituents[c].approval)
						}
					}

				// divide for ratings
					for (var c in REQUEST.game.data.constituents) {
						REQUEST.game.data.constituents[c].approval = Math.floor(REQUEST.game.data.constituents[c].approval / REQUEST.game.data.constituents[c].population)
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to update overall approval ratings"})
			}
		}

	/* updateRebellions */
		module.exports.updateRebellions = updateRebellions
		function updateRebellions(REQUEST, callback) {
			try {
				// collapse
					var totalPopulation = 0
					for (var c in REQUEST.game.data.constituents) {
						totalPopulation += REQUEST.game.data.constituents[c].population
					}
					if (totalPopulation < CONFIGS.minimumPopulation) {
						if (!REQUEST.game.data.issues.find(function(i) { return i.type == "collapse" })) {
							REQUEST.game.data.issues.push(getAttributes(MAIN.getSchema("issue"), ISSUES.collapse[0], callback))
						}
						return
					}

				// rebellions & protest
					for (var c in REQUEST.game.data.constituents) {
						if (REQUEST.game.data.constituents[c].approval <= CONFIGS.rebellionApproval && !REQUEST.game.data.issues.find(function(i) { return i.type == "rebellion" })) {
							REQUEST.game.data.issues.push(getAttributes(MAIN.getSchema("issue"), ISSUES.rebellion[0], callback))
						}
						else if (REQUEST.game.data.constituents[c].approval <= CONFIGS.protestApproval && !REQUEST.game.data.issues.find(function(i) { return i.type == "protest" })) {
							REQUEST.game.data.issues.push(getAttributes(MAIN.getSchema("issue"), MAIN.chooseRandom(ISSUES.protest), callback))
						}
					}

				// austerity
					if (REQUEST.game.data.treasury < 0 && !REQUEST.game.data.issues.find(function(i) { return i.type == "austerity" })) {
						REQUEST.game.data.issues.push(getAttributes(MAIN.getSchema("issue"), ISSUES.austerity[0], callback))
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to update rebellions"})
			}
		}

	/* updateOverthrow */
		module.exports.updateOverthrow = updateOverthrow
		function updateOverthrow(REQUEST, callback) {
			try {
				// observers
					var observers = Object.keys(REQUEST.game.observers)

				// special ideoogies
					var fascist = null
					var populist = null
					var anarchist = null
					var crook = null
					var monarchist = null
					var bureaucrat = null
					var factionalist = null
					var apocalyptist = null

					for (var m in REQUEST.game.data.members) {
						if (REQUEST.game.data.members[m].ideology.name == "fascist") {
							fascist = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "populist") {
							populist = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "anarchist") {
							anarchist = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "crook") {
							crook = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "bureaucrat") {
							bureaucrat = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "monarchist") {
							monarchist = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "factionalist") {
							factionalist = REQUEST.game.data.members[m]
						}
						else if (REQUEST.game.data.members[m].ideology.name == "apocalyptist") {
							apocalyptist = REQUEST.game.data.members[m]
						}
					}

				// apocalyptist
					if (apocalyptist && getIdeology(REQUEST, apocalyptist, callback) && REQUEST.game.data.rules.includes(IDEOLOGIES["apocalyptist"].rule)) {
						apocalyptist.state.reelected = true
						apocalyptist.state.achieved  = true
						apocalyptist.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: apocalyptist.name + MESSAGES["overthrow-apocalyptist"]})
						enactEnd(REQUEST, callback)
						return
					}

				// world ended
					if (REQUEST.game.data.rules.includes("immediate-end")) {
						callback(observers, {success: true, message: RULES["immediate-end"].description})
						enactEnd(REQUEST, callback)
						return
					}

				// anarchist
					if (anarchist && getIdeology(REQUEST, anarchist, callback) && !REQUEST.game.data.state.exists) {
						anarchist.state.reelected = true
						anarchist.state.achieved  = true
						anarchist.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: anarchist.name + MESSAGES["overthrow-anarchist"]})
						enactEnd(REQUEST, callback)
						return
					}

				// fascist
					if (fascist && getIdeology(REQUEST, fascist, callback) && fascist.state.leader) {
						fascist.state.reelected = true
						fascist.state.achieved  = true
						fascist.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: fascist.name + MESSAGES["overthrow-fascist"]})
						enactEnd(REQUEST, callback)
						return
					}

				// monarchist
					if (monarchist && getIdeology(REQUEST, monarchist, callback) && REQUEST.game.data.rules.includes(IDEOLOGIES["monarchist"].rule)) {
						monarchist.state.reelected = true
						monarchist.state.achieved  = true
						monarchist.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: monarchist.name + MESSAGES["overthrow-monarchist"]})
						enactEnd(REQUEST, callback)
						return
					}

				// populist
					if (populist && getIdeology(REQUEST, populist, callback) && getApproval(populist, callback) >= IDEOLOGIES["populist"].approval) {
						populist.state.reelected = true
						populist.state.achieved  = true
						populist.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: populist.name + MESSAGES["overthrow-populist"]})
						enactEnd(REQUEST, callback)
						return
					}

				// factionalist
					else if (factionalist && getIdeology(REQUEST, factionalist, callback) && REQUEST.game.data.constituents[factionalist.race.short].approval >= IDEOLOGIES["factionalist"].approval) {
						factionalist.state.reelected = true
						factionalist.state.achieved  = true
						factionalist.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: factionalist.name + MESSAGES["overthrow-factionalist"]})
						enactEnd(REQUEST, callback)
						return
					}

				// rebellion
					if (!REQUEST.game.data.state.exists) {
						enactMessage(observers, {success: true, message: MESSAGES["overthrow-rebellion"]}, CONFIGS.messageDelay, callback)
						enactEnd(REQUEST, callback)
						return
					}

				// crook
					if (crook && getIdeology(REQUEST, crook, callback) && crook.funds >= IDEOLOGIES["crook"].funds) {
						crook.state.reelected = true
						crook.state.achieved  = true
						crook.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: crook.name + MESSAGES["overthrow-crook"]})
						enactEnd(REQUEST, callback)
						return
					}

				// bureaucrat
					if (bureaucrat && getIdeology(REQUEST, bureaucrat, callback) && REQUEST.game.data.rules.length >= IDEOLOGIES["bureaucrat"].rules) {
						bureaucrat.state.reelected = true
						bureaucrat.state.achieved  = true
						bureaucrat.state.victory   = true
						REQUEST.game.data.state.exists = false
						callback(observers, {success: true, message: bureaucrat.name + MESSAGES["overthrow-bureaucrat"]})
						enactEnd(REQUEST, callback)
						return
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to check for special victory"})
			}
		}

	/* updateMembers */
		module.exports.updateMembers = updateMembers
		function updateMembers(REQUEST, callback) {
			try {
				for (var m in REQUEST.game.data.members) {
					var member = REQUEST.game.data.members[m]

					// campaigns
						if (member.state.campaign > 0) {
							member.state.campaign -= CONFIGS.loopTime
						}
						else {
							member.state.campaign = false
						}

					// public financing
						if (REQUEST.game.data.rules.includes("public-financing")) { // rule: public financing
							if (REQUEST.game.data.state.time % RULES["public-financing"].timeModulo == 0) {
								member.funds = Math.min(0, member.funds + RULES["public-financing"].funds)
							}
						}

					// donations
						else if (REQUEST.game.data.state.time % CONFIGS.donationTimeModulo == 0 && !REQUEST.game.data.rules.includes("donation-ban")) { // rule: donation-ban
							for (var c in member.constituents) {
								if (member.constituents[c].approval >= CONFIGS.donationApproval) {
									member.funds = Math.min(0, member.funds + member.constituents[c].population)
								}
							}
						}
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to update members campaigns, donations, and protests"})
			}
		}

	/* updateFuture */
		module.exports.updateFuture = updateFuture
		function updateFuture(REQUEST, callback) {
			try {
				for (var f in REQUEST.game.future) {
					// delay
						REQUEST.game.future[f].delay -= CONFIGS.loopTime

					// add to issues
						if (REQUEST.game.future[f].delay <= 0) {
							var issue = ISSUES[REQUEST.game.future[f].type].find(function(i) { return i.name == REQUEST.game.future[f].name })
								issue = getAttributes(MAIN.getSchema("issue"), issue, callback)

							// already on the board ?
								if (!REQUEST.game.past.find(       function(p) { return p.name.trim() == issue.name.trim() })
								 && !REQUEST.game.data.issues.find(function(i) { return i.name.trim() == issue.name.trim() })
								 && !REQUEST.game.future.find(     function(f) { return f.name.trim() == issue.name.trim() })) {
									REQUEST.game.data.issues.push(issue)
								}

							// remove from future
								REQUEST.game.future.splice(f, 1)
								f--
						}
				}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to update future issues"})
			}
		}

	/* updateIssues */
		module.exports.updateIssues = updateIssues
		function updateIssues(REQUEST, callback) {
			try {
				// existing issues
					for (var i in REQUEST.game.data.issues) {
						REQUEST.game.data.issues[i].timeout -= CONFIGS.loopTime

						if (REQUEST.game.data.issues[i].timeout <= 0 && !REQUEST.game.data.state.cooldown) {
							if (REQUEST.game.data.state.issue == REQUEST.game.data.issues[i].id) {
								enactTally(REQUEST, callback)
							}
							else if (!REQUEST.game.data.state.issue) {
								callback(Object.keys(REQUEST.game.observers), {success: true, message: (REQUEST.game.data.rules.includes("formal-language") ? RULES["formal-language"].timeout : "") + MESSAGES["timeout"]}) // rule: formal-language
								enactConsequences(REQUEST, callback, REQUEST.game.data.issues[i])
							}
						}
					}

				// random new issue
					if (REQUEST.game.past.length >= CONFIGS.minimumIssuesResolvedBeforeMore && REQUEST.game.data.issues.length < CONFIGS.desiredIssuesPresent) { // not until 1st leader and 1st real issue are resolved
						var timeToAddIssue = false
						
						if (REQUEST.game.data.issues.length < CONFIGS.minimumIssuesPresent) {
							timeToAddIssue = true
						}
						else {
							var randomChance = Math.random()
							for (var i in CONFIGS.issueChances) {
								if (REQUEST.game.data.state.time % Number(i) == 0 && randomChance < CONFIGS.issueChances[i]) {
									timeToAddIssue = true
									break
								}
							}
						}

						if (timeToAddIssue) {
							var type = MAIN.chooseRandom(CONFIGS.issueTypes)
						 	var tryAgain = CONFIGS.issueRetries

							do {
								tryAgain--
								var issue = MAIN.chooseRandom(ISSUES[type])
							}
							while (issue && tryAgain && // ensure this issue isn't already done / current / upcoming
								(  REQUEST.game.past.find(       function(p) { return p.name.trim() == issue.name.trim() })
								|| REQUEST.game.data.issues.find(function(i) { return i.name.trim() == issue.name.trim() })
								|| REQUEST.game.future.find(     function(f) { return f.name.trim() == issue.name.trim() })))

							if (issue) {
								REQUEST.game.data.issues.push(getAttributes(MAIN.getSchema("issue"), issue, callback))
							}
						}
					}
			}
			catch (error) {
				MAIN.logError(error)
				callback([REQUEST.session.id], {success: false, message: "unable to update random new issues"})
			}
		}
