/*** modules ***/
	var main       = require("../main/logic")
	module.exports = {}

/*** players ***/
	/* addPlayer */
		module.exports.addPlayer = addPlayer
		function addPlayer(request, callback) {
			try {
				if (!request.game) {
					callback([request.session.id], {success: false, message: "unable to find game"})
				}
				else if (!request.game.players[request.session.id] && !request.game.observers[request.session.id]) {
					callback([request.session.id], {success: false, message: "unable to find player or observer"})
				}
				else {
					// add player
						if (request.game.players[request.session.id]) {
							request.game.players[request.session.id].connected  = true
							request.game.players[request.session.id].connection = request.connection
						}

					// add observer
						else {
							request.game.observers[request.session.id].connected  = true
							request.game.observers[request.session.id].connection = request.connection
						}

					// message
						if (!request.game.data.state.start) {
							callback([request.session.id], {success: true, message: "waiting..."})
						}
						else if (request.game.data.state.end) {
							callback([request.session.id], {success: true, location: "../../../../"})
						}
						else {
							callback([request.session.id], {success: true,
								id:      request.game.id,
								data:    request.game.data,
								message: "rejoined game!"
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
					callback([request.session.id], {success: false, message: "game already started"})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "game already ended"})
				}
				else if (Object.keys(request.game.players).length < 5 || Object.keys(request.game.players).length > 25) {
					callback([request.session.id], {success: false, message: "must be 5 - 25 players"})
				}
				else {
					selectStart(request, callback)
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
					callback([request.session.id], {success: false, message: "game has not started"})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "not a player"})
				}
				else if (!request.game.data.state.leader) {
					callback([request.session.id], {success: false, message: "no leader to recall"})
				}
				else if (request.game.data.state.leader == request.session.id) {
					callback([request.session.id], {success: false, message: "cannot recall yourself"})
				}
				else if (request.game.data.state.term < 120000) {
					callback([request.session.id], {success: false, message: "leader was just elected"})
				}
				else {
					enactRecall(request, callback)
					callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: request.game.data.members[request.session.id].name + " calls for new leadership!"})
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
					callback([request.session.id], {success: false, message: "game has not started"})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "game already ended"})	
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "not a player"})
				}
				else if (!request.game.data.state.leader || !request.game.data.state.leader.id == request.session.id) {
					callback([request.session.id], {success: false, message: "not the leader"})
				}
				else if (request.game.data.members[request.session.id].state.campaign) {
					callback([request.session.id], {success: false, message: "cannot legislate while campaigning"})
				}
				else if (!request.game.data.state.issue && !request.post.selection) {
					callback([request.session.id], {success: false, message: "cannot unselect - no issue selected"})
				}
				else if ( request.game.data.state.issue ==  request.post.selection) {
					callback([request.session.id], {success: false, message: "issue already selected"})
				}
				else if (!request.game.data.issues.find(function(i) { return i.id == request.post.selection })) {
					callback([request.session.id], {success: false, message: "issue not found"})	
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
					callback([request.session.id], {success: false, message: "game has not started"})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "not a player"})
				}
				else if (request.game.data.members[request.session.id].state.campaign) {
					callback([request.session.id], {success: false, message: "cannot legislate while campaigning"})
				}
				else if (!request.game.data.state.issue) {
					callback([request.session.id], {success: false, message: "no issue selected"})
				}
				else if (!request.game.data.issues.find(function(i) { return i.id == request.game.data.state.issue })) {
					callback([request.session.id], {success: false, message: "issue not found"})
				}
				else if (!request.game.data.members[request.session.id].state.selection && !request.post.selection) {
					callback([request.session.id], {success: false, message: "cannot unselect - no option selected"})
				}
				else if ( request.game.data.members[request.session.id].state.selection ==  request.post.selection) {
					callback([request.session.id], {success: false, message: "option already selected"})
				}
				else if (!request.game.data.issues.find(function(i) { return i.id == request.game.data.state.issue }).options.find(function(o) { return o.id == request.post.selection })) {
					callback([request.session.id], {success: false, message: "option not found"})
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
					callback([request.session.id], {success: false, message: "game has not started"})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "not a player"})
				}
				else if (!request.game.data.state.issue) {
					callback([request.session.id], {success: false, message: "no issue selected"})
				}
				else if (Object.keys(request.game.data.members).filter(function(m) { return (!request.game.data.members[m].state.campaign && request.game.data.members[m].state.selection) }).length) {
					callback([request.session.id], {success: false, message: "some members have not voted"})
				}
				else if (request.game.data.members[request.session.id].state.campaign) {
					callback([request.session.id], {success: false, message: "cannot legislate while campaigning"})
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
					callback([request.session.id], {success: false, message: "game has not started"})
				}
				else if (request.game.data.state.end) {
					callback([request.session.id], {success: false, message: "game already ended"})
				}
				else if (!request.game.players[request.session.id]) {
					callback([request.session.id], {success: false, message: "not a player"})
				}
				else if (request.game.data.members[request.session.id].state.campaign) {
					callback([request.session.id], {success: false, message: "already campaigning"})
				}
				else if (!request.game.past.length < 3) {
					callback([request.session.id], {success: false, message: "not enough issues to campaign on"})
				}
				else if (request.game.data.members[request.session.id].state.funds < 1000) {
					callback([request.session.id], {success: false, message: "campaigning requires 1000 gold"})
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
	/* selectStart */
		module.exports.selectStart = selectStart
		function selectStart(request, callback) {
			try {
				// agencies
					for (var a in request.game.data.agencies) {
						request.game.data.agencies[a] = Math.floor(Math.randon() * 20) + 40
					}

				// ideologies
					var races = main.getAsset("races")
					var ideologies = main.getAsset("ideologies")
					var available = main.sortRandom(["socialist", "socialist",
						"liberal", "liberal", "liberal", "liberal", "liberal",
						"moderate", "moderate", "moderate", "moderate", "moderate", "moderate", "moderate",
						"conservative", "conservative", "conservative", "conservative", "conservative",
						"libertarian", "libertarian",
						"fascist", "populist", "anarchist", "crook"]).slice(0, Object.keys(request.game.players).length)

				// members
					for (var p in request.game.players) {
						var player = request.game.players[p]

						// info
							var member          = main.getSchema("member")
								member.id       = player.id
								member.name     = player.name
								member.race     = main.chooseRandom(races)
								member.ideology = ideologies.find(function(i) { return i.name == available[0] })
								available.shift()
							request.game.data.members[member.id] = member

						// populations & approval ratings
							for (var c in member.constituents) {
								member.constituents[c].population = Math.floor(Math.random() *  5) * 1000
								member.constituents[c].approval   = Math.floor(Math.random() * 20) + 40

								if (c == member.race.short) {
									member.constituents[c].approval = Math.max(0, Math.min(100, member.constituents[c].approval + 25))
								}
							}
					}

				// approval ratings
					updateRatings(request, callback)

				// start
					request.game.data.state.name  = main.chooseRandom(main.getAsset("names"))
					request.game.data.state.start = new Date().getTime()
					callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, start: true, message: "starting the game!"})
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to start game"})
			}
		}

	/* selectIssue */
		module.exports.selectIssue = selectIssue
		function selectIssue(request, callback) {
			try {
				// issue
					request.game.data.state.issue = request.post.selection

				// reset selections
					for (var m in request.game.data.members) {
						request.game.data.members[m].state.selection = null
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
					request.game.data.members[request.session.id].state.selection = request.post.selection

				// all selected?
					for (var m in request.game.data.members) {
						if (request.game.data.members[m].state.campaign || request.game.data.members[m].state.selection) {
							enactTally(request, callback)
						}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to select option"})
			}
		}

/*** enacts ***/
	/* enactRecall */
		module.exports.enactRecall = enactRecall
		function enactRecall(request, callback) {
			try {
				// create issue
					var issue = main.getSchema("issue")
						issue.name = "council leader"
						issue.description = "who should lead the council? the leader selects which issues are voted on."
						issue.timeout = 60000
						issue.intensity = 0

				// members
					for (var m in request.game.data.members) {
						request.game.data.members[m].state.selection = null

						var option = main.getSchema("option")
							option.id   = m
							option.name = request.game.data.members[m].name

						if (request.game.data.members[m].state.leader) {
							request.game.data.members[m].state.leader = false
							option.state.default = true
							option.treasury = 0
						}
						else {
							option.treasury = -1000
							option.constituents[request.game.data.members[m].race.short].approval = 5
						}

						issue.options.push(option)
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
						option.votes.push(m)
						request.game.data.members[m].state.selection = null
					}

				// determine winning option(s)
					var winningOptions = {
						ids:   [],
						votes: 0
					}

					for (var o in issue.options) {
						if (issue.options[o].votes.length > winningOptions.votes) {
							winningOptions.votes = issue.options[o].votes.length
							winningOptions.ids   = [o]
						}
						else if (issue.options[o].votes.length == winningOptions.votes) {
							winningOptions.ids.push(o)
						}
					}

				// tie --> default
					if (winningOptions.ids.length > 1) {
						issue.options.find(function(o) {
							return o.state.default
						}).state.selected = true
					}

				// outright winner
					else {
						issue.options.find(function(o) {
							return o.id == winningOptions.ids[0]
						}).state.selected = true
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
					})

				// treasury
					request.game.data.treasury = Math.min(0, request.game.data.treasury + winningOption.treasury)

				// agencies
					for (var a in request.game.data.agencies) {
						request.game.data.agencies[a] = Math.max(0, Math.min(100, request.game.data.agencies[a] + winningOption.agencies[a]))
					}

				// member approval ratings & funds
					for (var o in issue.options) {
						for (var v in issue.options[o].state.votes) {
							var member = request.game.data.members[issue.options[o].state.votes[v]]
							
							if (issue.options[o].selected) {
								member.funds                          = Math.max(0, member.funds + winningOption.funds)
								for (var c in member.constituents) {
									member.constituents[c].approval   = Math.max(0, Math.min(100, member.constituents[c].approval + winningOption.constituents[c].approval))
									member.constituents[c].population = Math.max(0, member.constituents[c].population + winningOption.constituents[c].population)
								}
							}
							else {
								member.funds                          = Math.max(0, member.funds + Math.floor(issue.options[o].funds / 2))
								for (var c in member.constituents) {
									member.constituents[c].approval   = Math.max(0, Math.min(100, member.constituents[c].approval + Math.floor(issue.options[o].constituents[c].approval / 2)))
									member.constituents[c].population = Math.max(0, member.constituents[c].population + winningOption.constituents[c].population)
								}
							}
						}
					}

				// overall approval ratings
					updateRatings(request, callback)

				// rules
					for (var r in winningOption.rules) {
						if (winningOption.rules[r].enact) {
							request.game.data.rules.push(winningOption.rules[r].name)
						}
						else if (request.game.data.rules.includes(winningOption.rules[r].name)) {
							request.game.data.rules.splice(request.game.data.rules.indexOf(winningOption.rules[r].name), 1)
						}
					}

				// future issues
					for (var i in winningOption.issues) {
						request.game.future.push(winningOption.issues[i])
					}

				// communicate
					if (issue.id == request.game.data.state.issue) {
						request.game.data.state.issue = null

						var message = ""
						for (var o in issue.options) {
							message += issue.options[o].name + ": "
							for (var v in issue.options[o].votes) {
								message += request.game.data.members[issue.options[o].votes[v]].name
							}
							message += "; "
						}

						callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: message})
						setTimeout(function() {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: ("results: " + issue.name + " --> " + winningOption.name)})
						}, 4000)
					}
					else {
						callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: ("time's up! " + issue.name + " --> " + winningOption.name)})
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
					var issues = request.game.past.slice(request.game.past.length - 3, request.game.past.length)
					for (var i in issues) {
						var option = issues[i].options.find(function(o) {
							return o.votes.includes(member.id)
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
					callback([request.session.id], {success: true, message: "campaigning on " + issues.map(function (i) { return i.name }).join(" & ") })
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
					if (!request.game.data.state.end) {
						for (var m in request.game.data.members) {
							var member = request.game.data.members[m]
							if (getApproval(member, callback) >= 50) {
								member.state.reelected = true
							}
							if (getIdeology(request, member, callback)) {
								member.state.achieved = true
							}
						}
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to conduct the election"})
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

/*** updates ***/
	/* updateTime */
		module.exports.updateTime = updateTime
		function updateTime(request, callback) {
			try {
				if (request.game.data.state.start && !request.game.data.state.end) {
					request.game.data.state.time += 1000

					// start
						if (request.game.data.state.time == 2000) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "congratulations! you've been elected to the council of " + request.game.data.state.name + "!"})
						}
						else if (request.game.data.state.time == 5000) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "your goal? get reelected when the council session ends. that means an overall approval rating of over 50%."})
						}
						else if (request.game.data.state.time == 8000) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "your real goal? take a look at your secret ideology - that's how you want the government to be run."})
						}
						else if (request.game.data.state.time == 12000) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "influence government agencies, the treasury, and your approval rating by voting on issues."})
						}
						else if (request.game.data.state.time == 15000) {
							enactRecall(request, callback)
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "first up: choose a council leader to select which issues are voted on."})
						}

					// end
						else if (request.game.data.state.time == request.game.data.state.election - 120000) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "the election is very soon!"})
						}
						else if (request.game.data.state.time == request.game.data.state.election - 60000) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "it's almost the election!"})
						}
						else if (request.game.data.state.time == request.game.data.state.election) {
							callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), {success: true, message: "election day!"})
							enactElection(request, callback)
						}
						else if (request.game.data.state.time == request.game.data.state.election + 2000) {
							for (var m in request.game.data.members) {
								callback([m], {success: true, message: request.game.data.members[m].state.reelected ? "...congratulations on your reelection!" : "...the voters have spoken! you're out!"})
							}
						}
						else if (request.game.data.state.time == request.game.data.state.election + 5000) {
							for (var m in request.game.data.members) {
								callback([m], {success: true, message: request.game.data.members[m].state.achieved ? "you have accomplished your policy goals!" : "you have failed to achieve your policy goals."})
							}
						}
						else if (request.game.data.state.time == request.game.data.state.election + 8000) {
							for (var m in request.game.data.members) {
								callback([m], {success: true, message: request.game.data.members[m].state.reelected && request.game.data.members[m].state.achieved ? "you win!" : "you lose!"})
							}
							request.game.data.state.end = new Date().getTime()
						}

					// gameplay
						else {
							// future issues
								updateRebellions(request, callback)
								updateFuture(request, callback)

							// random issues
								updateIssues(reuqest, callback)

							// campaigns & donations (& riots)
								updateMembers(request, callback)
								updateOverthrow(request, callback)

							// send data
								callback(Object.keys(request.game.players).concat(Object.keys(request.game.observers)), request.game.data)
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to process time interval"})
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

						for (var c in request.game.data.constituents)
							request.game.data.constituents[c].population = Math.max(0, request.game.data.constituents[c].population + member.constituents[c].population)
							request.game.data.constituents[c].approval   = request.game.data.constituents[c].approval + (member.constituents[c].population * member.constituents[c].approval)
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
				for (var c in request.game.data.constituents) {
					if (request.game.data.constituents[c].approval <= 20) {
						var issue = main.chooseRandom(main.getAsset("issues").filter(function(i) {
							return i.intensity = 5
						}))

						request.game.data.issues.push(issue)
					}
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
					var fascist = request.game.data.members.find(function(m) {
						return m.ideology.name == "fascist"
					}) || null

					var populist = request.game.data.members.find(function(m) {
						return m.ideology.name == "populist"
					}) || null

					var anarchist = request.game.data.members.find(function(m) {
						return m.ideology.name == "anarchist"
					}) || null

					var crook = request.game.data.members.find(function(m) {
						return m.ideology.name == "crook"
					}) || null

				// fascist
					if (fascist && getIdeology(request, fascist, callback) && fascist.state.leader) {
						fascist.state.reelected = true
						fascist.state.achieved  = true
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: fascist.name + ", the fascist, has overthrown the government!"})
						request.game.data.state.end = new Date().getTime()
					}

				// populist
					else if (populist && getIdeology(request, populist, callback) && getApproval(populist, callback) >= 80) {
						populist.state.reelected = true
						populist.state.achieved  = true
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: populist.name + ", the populist, has overthrown the government!"})
						request.game.data.state.end = new Date().getTime()
					}

				// anarchist
					else if (anarchist && getIdeology(request, anarchist, callback) && !request.game.data.state.exists) {
						anarchist.state.reelected = true
						anarchist.state.achieved  = true
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: anarchist.name + ", the anarchist, has overthrown the government!"})
						request.game.data.state.end = new Date().getTime()
					}

				// crook
					else if (crook && getIdeology(request, crook, callback) && crook.funds >= 100000) {
						crook.state.reelected = true
						crook.state.achieved  = true
						callback(Object.keys(request.game.players).concat(request.game.observers), {success: true, message: crook.name + ", the crook, has overthrown the government!"})
						request.game.data.state.end = new Date().getTime()
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

					// donations vs. riots
						for (var c in member.constituents) {
							if (member.constituents[c].approval >= 80) {
								member.funds = Math.min(0, member.funds + Math.floor(member.constituents[c].population / 100))
							}
							else if (member.constituents[c].approval <= 20) {
								var issue = main.chooseRandom(main.getAsset("issues").filter(function(i) {
									return i.intensity = 4
								}))

								request.game.data.issues.push(issue)
							}
						}

					// leader
						if (member.state.leader) {
							member.state.term += 1000
						}
						else {
							member.state.term = 0
						}
				}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update members campaigns, donations, and riots"})
			}
		}

	/* updateFuture */
		module.exports.updateFuture = updateFuture
		function updateFuture(request, callback) {
			try {
				for (var f in request.game.future) {
					// timeout
						request.game.future[f].timeout -= 1000

					// add to issues
						if (request.game.future[f].timeout <= 0) {
							var issue = main.getAsset("issues").find(function (i) { return i.name == request.game.future[f].name })
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

						if (request.game.data.issues[i].timeout <= 0) {
							if (request.game.data.state.issue == request.game.data.issues[i].id) {
								enactTally(request, callback)
								var option = request.game.data.issues[i].options.find(function(o) { return o.state.selected })
							}
							else {
								var option = request.game.data.issues[i].options.find(function(o) { return o.state.default  })
								enactConsequences(request, callback, request.game.data.issues[i])
							}
						}
					}

				// random new issue
					var addIssue = false
					if ((request.game.data.state.time % 300000 == 0) 										// 5 minutes  = 100%
					 || (request.game.data.state.time % 120000 == 0 && !Math.floor(Math.random() * 2))		// 2 minutes  = 50%
					 || (request.game.data.state.time %  60000 == 0 && !Math.floor(Math.random() * 3))		// 1 minute   = 33%
					 || (request.game.data.state.time %  30000 == 0 && !Math.floor(Math.random() * 5))		// 30 seconds = 20%
					 || (request.game.data.state.time %  15000 == 0 && !Math.floor(Math.random() * 8))) {	// 15 seconds = 12.5%
						do {
							var issue = main.chooseRandom(main.getAsset("issues"))
						}
						while (request.game.past.find(       function (p) { return p.name == issue.name })
							|| request.game.data.issues.find(function (i) { return i.name == issue.name })
							|| request.game.future.find(     function (f) { return f.name == issue.name }))

						request.game.data.issues.push(issue)
					}
			}
			catch (error) {
				main.logError(error)
				callback([request.session.id], {success: false, message: "unable to update random new issues"})
			}
		}
